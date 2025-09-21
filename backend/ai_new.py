import os
import requests
import json
import io
import uuid
from PIL import Image
from google import genai
from dotenv import load_dotenv
from typing import List, Dict, Any, Optional, Union, Literal, get_origin, get_args
from abc import ABC, abstractmethod
from dataclasses import dataclass, asdict, fields, is_dataclass, field
from enum import Enum
from google.genai import types
from datetime import datetime
import time
import base64
from io import BytesIO

# --- API Client Setup ---
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
FREEPIK_API_KEY = os.getenv("FREEPIK_API_KEY")
IMAGE_PROVIDER = os.getenv("IMAGE_PROVIDER", "gemini")  # or "freepik"
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found.")


user_native_language = "en"  # for ai to see where to give translation
client = genai.Client(api_key=GEMINI_API_KEY)
MODEL_ID = "gemini-2.5-flash"

fallback_image_url = "https://images.pexels.com/photos/16653303/pexels-photo-16653303/free-photo-of-a-woman-in-a-sari-standing-in-a-field.jpeg"

# --- CONFIG & CONSTANTS ---
USE_DUMMY_IMAGE = True
FREEPIK_URL = "https://api.freepik.com/v1/ai/gemini-2-5-flash-image-preview"

# --- Global Data Stores ---
products_db, chats_db, ads_db, posts_db = [], [], [], []


def load_all_data():
    global products_db, chats_db, ads_db, posts_db

    def _load(filename):
        try:
            with open(os.path.join("data", filename), "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print("error", e)
            return []

    products_db = _load("products.json")
    chats_db = _load("chats.json")
    ads_db = _load("ads.json")
    posts_db = _load("posts.json")


load_all_data()


@dataclass
class Option:
    label: str
    id: str


# added
@dataclass
class GraphData:
    x: str
    y: float
    series: Optional[str] = ""


class Xtype(Enum):
    datetime = "datetime"
    string = "string"
    integer = "int"
    float = "float"


# added
@dataclass
class Graph:
    title: str
    type: str  # bar,line,pie
    x_type: Xtype
    data: List[GraphData]


# added now
@dataclass
class Metric:
    name: str  # name of metric
    value: float
    unit: Optional[str] = ""  # %, "" if count


@dataclass
class Insight:
    text: str
    metric: Optional[Metric] = None


@dataclass
class SelectionPrompt:
    prompt_id: str
    prompt: str  # The question or instruction for the user
    options: Optional[List[Option]] = field(
        default_factory=list
    )  # List of options, if any
    selection_type: Optional[Literal["single", "multi", "none"]] = (
        "none"  # How to select
    )


# question, select , select multiple


@dataclass  # only for reference
class ResponseSelection:
    prompt_id: str
    selected_option_ids: Optional[List[str]] = field(
        default_factory=list
    )  # for single or multi select
    selection_type: Optional[Literal["single", "multi", "none"]] = (
        "none"  # should match SelectionPrompt
    )


# --- Specialized Draft Dataclasses ---
# (keep comments for reference)
@dataclass
class Draft:
    draft_id: str  # general
    language: str
    translation: Optional[str] = ""  # for UI translation


@dataclass
class PostDraft(Draft):
    images: List[str] = field(default_factory=list)  # all except chat
    hashtags: List[str] = field(default_factory=list)  # all except chat
    replacement_of: Optional[str] = ""  # for optimize tasks
    caption: str = ""  # caption for post
    platforms: List[str] = field(default_factory=list)  # posts, ads only
    region: str = ""  # region to post ad, post


@dataclass
class AdDraft(Draft):
    images: List[str] = field(default_factory=list)  # all except chat
    hashtags: List[str] = field(default_factory=list)  # all except chat
    budget: float = 0.0  # ad only
    platforms: List[str] = field(default_factory=list)  # posts, ads only
    replacement_of: Optional[str] = ""  # for optimize tasks
    headline: str = ""  # headline for ad
    region: str = ""  # region to post ad, post
    duration_days: int = 0  # for ads


@dataclass
class ProductDraft(Draft):
    images: List[str] = field(default_factory=list)  # all except chat
    description: str = ""  # description for product
    hashtags: List[str] = field(default_factory=list)  # all except chat
    replacement_of: Optional[str] = ""  # for optimize tasks
    name: str = ""  # only for product
    price: float = 0.0  # only for product
    category: str = ""


@dataclass
class ChatDraft(Draft):
    chat_id: str = ""  # chat_id
    message: str = ""  # chat message


@dataclass
class Source:
    title: str
    url: str


@dataclass
class AssistantResponse:
    role: str = "assistant"  # not filled here
    turn_id: str = ""  # not filled here
    tool_name: str = ""  # added, not filled here. used to infer draft type
    assistant_message: str = ""
    timestamp: str = ""  # not filled here
    drafts: Optional[List[Draft]] = field(default_factory=list)
    insights: Optional[List[Insight]] = field(default_factory=list)  # used only here
    charts: Optional[List[Graph]] = field(
        default_factory=list
    )  # used only here, changed from List[Dict]
    sources: Optional[List[Source]] = field(default_factory=list)
    editing_enabled: Optional[bool] = True  # added
    selections: Optional[List[SelectionPrompt]] = field(
        default_factory=list
    )  # used only here . if included, also include a send or some buttont
    stats: Optional[List[Metric]] = field(default_factory=list)
    selections_text: Optional[str] = (
        "Can you please clarify these for me before we proceed?"  # ai generated or as is. added
    )
    product_id: Optional[str] = ""  # product it affects, if any


@dataclass  # internal reference only
class FinalizedEntry:
    drafts: Optional[List[Draft]] = field(default_factory=list)
    stats: Optional[List[List[Metric]]] = field(
        default_factory=list
    )  # same number as drafts, used in localisation
    # views,clicks,conversions for product, engagement_rate,reach,likes,shares for posts
    insights: Optional[List[Insight]] = field(default_factory=list)  # used only here
    recommendations: Optional[List[str]] = field(default_factory=list)  # used only here
    graphs: Optional[List[Graph]] = field(
        default_factory=list
    )  # used only here, changed from List[Dict]

    # for chat, product, take only first of draft and stats
    created_at: Optional[str] = ""


def generate_structured_content(
    prompt: str,
    schema: Dict = None,
    previous_ai_response: Dict = None,
    image_data: Dict = None,
) -> Dict:
    try:
        full_prompt = prompt
        if schema:
            full_prompt += (
                "\n\nReturn ONLY valid JSON strictly matching this schema. "
                "No explanations, no extra text. No trailing commas.\n"
                f"{json.dumps(schema, indent=2)}"
            )

        content_parts = [full_prompt]
        if image_data and image_data.get("data"):
            content_parts.append(Image.open(io.BytesIO(image_data["data"])))

        json_config = {"response_mime_type": "application/json"}
        response = client.models.generate_content(
            model=MODEL_ID, contents=content_parts, config=json_config
        )

        cleaned_response = (
            response.text.strip().replace("```json", "").replace("```", "")
        )

        try:
            return json.loads(cleaned_response)
        except json.JSONDecodeError as e:
            print("\n[generate_structured_content] JSON parsing failed ❌")
            print("Error:", e)
            print("Raw model response:")
            print(cleaned_response)
            print("-" * 80)
            raise  # re-raise so outer except also catches

    except Exception as e:
        print(f"[generate_structured_content] Exception: {e}")
        return {
            "assistant_message": "Sorry, I encountered an issue. Please try again.",
            "error": str(e),
        }


def file_to_base64(path):
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def generate_image(prompt: str, reference_images: List[str] = None) -> List[str]:
    """
    Returns a list of local file paths (relative URLs) for images generated by Freepik or Gemini.
    """
    os.makedirs("data/uploads", exist_ok=True)

    if USE_DUMMY_IMAGE or not (FREEPIK_API_KEY or GEMINI_API_KEY):
        return [fallback_image_url]

    if IMAGE_PROVIDER == "freepik":
        start_headers = {
            "Content-Type": "application/json",
            "x-freepik-api-key": FREEPIK_API_KEY,
        }
        start_data = {"prompt": prompt}
        if reference_images:
            images = []
            for img_path in reference_images:
                try:
                    img = file_to_base64(img_path)
                    images.append(img)
                except Exception as e:
                    print(f"Failed to load reference image {img_path}: {e}")
            start_data["reference_images"] = images
        try:
            start_resp = requests.post(
                FREEPIK_URL, headers=start_headers, json=start_data, timeout=30
            )
            start_resp.raise_for_status()
            task_id = (start_resp.json().get("data", {}) or {}).get("task_id")
            if not task_id:
                print("Freepik API did not return a task ID.")
                return []
            status_url = FREEPIK_URL + f"/{task_id}"
            status_headers = {"x-freepik-api-key": FREEPIK_API_KEY}
            time.sleep(10)  # Initial wait before polling
            for _ in range(24):
                status_resp = requests.get(
                    status_url, headers=status_headers, timeout=30
                )
                status_resp.raise_for_status()
                status_json = status_resp.json()
                job_status = (status_json.get("data", {}) or {}).get("status")
                if (
                    job_status == "COMPLETED"
                    and (status_json.get("data") or {}).get("generated") != []
                ):
                    images_data = status_json["data"].get("generated") or []
                    paths = []
                    for img_info in images_data[:1]:  # Limit to first image
                        url = img_info
                        if url:
                            try:
                                img_resp = requests.get(url)
                                img_resp.raise_for_status()
                                filename = f"freepik_{uuid.uuid4().hex}.png"
                                rel_path = os.path.join("data", "uploads", filename)
                                with open(rel_path, "wb") as f:
                                    f.write(img_resp.content)
                                paths.append(rel_path)
                            except Exception as e:
                                print(f"Failed to download Freepik image: {e}")
                    if paths:
                        return paths
                    print("Job completed but no image URL found.")
                    return []
                elif job_status == "FAILED":
                    print(f"Freepik job failed. Reason: {status_json.get('error')}")
                    return []
                time.sleep(5)
            print("Freepik job timed out after 2 minutes.")
            return []
        except requests.RequestException as e:
            print(f"Freepik API request failed: {e}")
            return []
    elif IMAGE_PROVIDER == "gemini":
        max_retries = 3
        for attempt in range(1, max_retries + 1):
            try:
                images = []
                if reference_images:
                    for img_path in reference_images:
                        try:
                            img = Image.open(img_path)
                            images.append(img)
                        except Exception as e:
                            print(f"Failed to load reference image {img_path}: {e}")
                contents = [prompt] + images
                response = client.models.generate_content(
                    model="gemini-2.5-flash-image-preview",
                    contents=contents,
                )
                paths = []
                for candidate in getattr(response, "candidates", [])[
                    :1
                ]:  # Limit to first candidate
                    for part in getattr(candidate.content, "parts", []):
                        if getattr(part, "inline_data", None) is not None:
                            img = Image.open(BytesIO(part.inline_data.data))
                            filename = f"gemini_{uuid.uuid4().hex}.png"
                            rel_path = os.path.join("data", "uploads", filename)
                            img.save(rel_path)
                            paths.append(rel_path)
                return paths
            except Exception as e:
                print(f"Gemini image generation failed (attempt {attempt}): {e}")
                if attempt == max_retries:
                    return []
                time.sleep(2)  # Optional: wait before retrying
    else:
        print("Unknown IMAGE_PROVIDER, using fallback image.")
        return []


def dataclass_to_schema(typ):
    """
    Recursively convert a dataclass or type hint to a simple AI-friendly schema.
    """
    origin = get_origin(typ)
    args = get_args(typ)
    is_optional = False

    # 1. Handle Optional[X] (which is Union[X, NoneType]) first
    if origin is Union and type(None) in args:
        is_optional = True
        # Get the actual type from the Union, e.g., str from Optional[str]
        non_none_args = [a for a in args if a is not type(None)]
        if not non_none_args:
            return "any(optional)"  # Should not happen with valid Optional
        typ = non_none_args[0]
        # Re-evaluate origin and args for the unwrapped type
        origin = get_origin(typ)
        args = get_args(typ)

    # 2. Process the main type (after unwrapping Optional)
    val = "string"  # Default value

    if origin is list:
        # It's a list, so recurse on its inner type
        inner_type = args[0] if args else Any
        val = [
            dataclass_to_schema(inner_type)
        ]  # Create a list containing the inner schema
    elif origin is dict:
        val = {"key": "value"}
    elif is_dataclass(typ):
        # It's a dataclass, so process its fields
        schema = {}
        for f in fields(typ):
            # Recursively get the schema for each field's type
            schema[f.name] = dataclass_to_schema(f.type)
        val = schema
    elif isinstance(typ, type) and issubclass(typ, Enum):
        # It's an Enum
        val = "/".join(str(e.value) for e in typ)
    elif typ is str:
        val = "string"
    elif typ is float:
        val = "number"
    elif typ is int:
        val = "integer"
    elif typ is bool:
        val = "boolean"

    # 3. Apply the optional marker at the end if necessary
    if is_optional:
        if isinstance(val, str):
            val = f"{val}(optional)"
        elif isinstance(val, list) and val and isinstance(val[0], (str, dict)):
            # Special handling for optional lists of objects or strings
            # Note: This schema format doesn't have a perfect way to show
            # the list itself is optional, so we mark the inner type.
            inner_content = val[0]
            if isinstance(inner_content, dict):
                # This is tricky; we won't modify the inner dict for simplicity.
                # The presence of default_factory=list implies it can be empty.
                pass
            else:
                val[0] = f"{inner_content}(optional)"
        # For dictionaries or complex objects, we assume optionality is clear enough
        # from context or by the key not being present in the final JSON.

    return val


# --- Abstract Base Class for Tools ---


def _serialize_obj(obj):
    """Recursively serialize dataclasses and enums to dicts/values.(obj to dict)"""
    if hasattr(obj, "__dataclass_fields__"):
        return {k: _serialize_obj(v) for k, v in asdict(obj).items()}
    if isinstance(obj, Enum):
        return obj.value
    if isinstance(obj, dict):
        return {k: _serialize_obj(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_serialize_obj(i) for i in obj]
    return obj


def _deserialize_obj(data, cls):
    """Recursively deserialize dicts to dataclasses and enums.(dict to obj) only needs to know what to convert to"""
    if hasattr(cls, "__dataclass_fields__") and isinstance(data, dict):
        field_types = {f.name: f.type for f in fields(cls)}
        kwargs = {}
        for k, v in data.items():
            typ = field_types.get(k)
            if typ is None:
                continue
            origin = get_origin(typ)
            args = get_args(typ)
            # Handle Optional
            if origin is Union and type(None) in args:
                typ = [a for a in args if a is not type(None)][0]
                origin = get_origin(typ)
                args = get_args(typ)
            if origin is list and isinstance(v, list):
                inner = args[0]
                kwargs[k] = [_deserialize_obj(i, inner) for i in v]
            elif origin is dict and isinstance(v, dict):
                kwargs[k] = {ik: _deserialize_obj(iv, args[1]) for ik, iv in v.items()}
            elif isinstance(typ, type) and issubclass(typ, Enum):
                kwargs[k] = typ(v)
            elif hasattr(typ, "__dataclass_fields__"):
                kwargs[k] = _deserialize_obj(v, typ)
            else:
                kwargs[k] = v
        return cls(**kwargs)
    elif isinstance(cls, type) and issubclass(cls, Enum):
        return cls(data)
    else:
        return data


class BaseTool(ABC):
    db_name = ""

    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description

    def gen_uid(self):
        return self.db_name[:-1] + "_" + str(uuid.uuid4())

    @abstractmethod
    def execute(
        self, current_user_turn, prev_ai_response, image_data, image_url
    ) -> AssistantResponse:
        pass


# --- Generic Draft Tool Base Class ---
class GenericDraftTool(BaseTool):
    draft_cls = Draft  # Override in subclasses
    db = []  # Override in subclasses
    db_name = ""  # Override in subclasses

    @abstractmethod
    def get_ai_prompt(self, current_user_turn, prev_ai_response, image_data, image_url):
        """Override in subclass to provide the AI prompt string."""
        pass

    def get_context_data(
        self, current_user_turn, prev_ai_response, image_data, image_url
    ):
        """Override in subclass to provide extra context for the AI prompt."""
        return {}

    # overwrite in subclass if needed
    def task_state(self, prev_ai_response):
        if prev_ai_response.get("tool_name") != self.name:
            return "first_turn"
        if any(
            getattr(draft, "replacement_of", None) not in [None, ""]
            for draft in prev_ai_response.get("drafts") or []
            if draft
        ):
            return "optimize"
        return "new"

    def execute(
        self, current_user_turn, prev_ai_response, image_data, image_url
    ) -> AssistantResponse:
        user_message = current_user_turn.get("message") or ""
        user_drafts = current_user_turn.get("drafts") or []

        selections = current_user_turn.get("selections") or []
        schema = dataclass_to_schema(AssistantResponse)
        # remove irrelavnt keys
        for key in ["role", "turn_id", "timestamp", "drafts", "selections_text"]:
            schema.pop(key, None)
        # make drafts a list of draft_cls
        # to do
        schema["drafts"] = [dataclass_to_schema(self.draft_cls)]
        schema["image_prompts"] = [
            {"draft_id": "string", "prompt": "string", "reference_images": ["string"]}
        ]
        print("schema sent to ai", schema)
        prev_drafts = prev_ai_response.get("drafts") or [] if prev_ai_response else []
        ai_selections = (
            prev_ai_response.get("selections") or [] if prev_ai_response else []
        )
        # --- AI decides if user wants to publish/post ---
        publish_prompt = f"""
        Decide if the user wants to publish/post/launch/confirm the current {self.db_name[:-1]}.
        User message: "{user_message}"
        Selections: {json.dumps(selections)}
        Selections prvoided by ai: {json.dumps(ai_selections)}
        Previous drafts: {json.dumps(prev_drafts)}
        Uploaded images: {image_url}
        Reply with 'true' if the user wants to publish/post, otherwise 'false'.
        Note:
        if there are any pending changes or any changes needed, consider it as user doesnt want to publish yet.
        if user expresses a desire to cancel the task, include "cancel": true in your response.
        if there are pending questions, but the values are draft are sensible enough, assume it means user accepts those values and wants to publish
        """
        print("pubslish prompt:", publish_prompt)
        publish_schema = {
            "publish": "boolean",
            "cancel": "boolean(optional)",
            "reason": "string",
        }
        publish_decision = generate_structured_content(
            publish_prompt, publish_schema, prev_ai_response
        )
        wants_publish = publish_decision.get("publish", False)
        wants_cancel = publish_decision.get("cancel", False)

        print("wants to publish?", wants_publish, " wants cancel?", wants_cancel)
        print("reason", publish_decision.get("reason", ""))
        if wants_publish and not wants_cancel:
            response = {
                "assistant_message": f"{self.db_name[:-1].title()} published successfully.",
                "editing_enabled": False,
                "drafts": prev_drafts,
            }
            self.finalize_and_save(prev_drafts, prev_ai_response.get("product_id"))
            return dict_to_assistant_response(
                response, tool_name=self.name, draft_cls=self.draft_cls
            )

        # --- AI prompt for drafts with image handling instructions ---
        if wants_cancel:
            prev_ai_response = {}
        context = self.get_context_data(
            current_user_turn, prev_ai_response, image_data, image_url
        )
        prompt = self.get_ai_prompt(
            current_user_turn, prev_ai_response, image_data, image_url
        )
        instructions = """
                # Translation Instructions:
                - If the draft's language differs from the user's native language, provide a translation in the 'translation' field.
                - If the draft's language matches the user's native language, set 'translation' to ''
                # Image Handling Instructions:
                - Limit to 1 image per draft.
                - If the user uploaded an image and wants to use it, replace the draft's image with it.
                - If the user requests a new or changed image or an image is needed as per the draft, add it to an 'image_prompts' array with objects:
                - reference image can be user uploaded image or existing draft images or both
                - do so for each draft needing image update/generation.
                - Do not generate images yourself, just specify what is needed in 'image_prompts'. ill generate them after that, so assume any image prompts you fill have been generated
                - if needed,generate images, then ask user if they want to change it, dont wait for them to specify to change
                # General Instructions:
                - Ensure all drafts are complete and well-written.
                - Use the user's message and selections to guide improvements.
                - Maintain consistency in style and tone across drafts.
                - The selections are used to clarify user intent and should be considered when updating drafts.
                - If selections are missing or unclear, generate appropriate selection prompts to clarify user intent.
                - include charts, stats, sources and insights as much as possible, making up their data if needed, they include reasonings or general stats related to your response or task
                - charts mean graphs user will see, stats are metrics used to give user some idea like popularity, searches,etc. 
                - for selections, we use this heading: 'Can you please clarify these for me before we proceed?'
                - for each that you leave blank, dont put null, but put emptry string,array or whatever fits the schema
                - for all fields, fill sensible vlaues, like in bduget, then ask for user to confirm it, so the draft is in a publishable state
                """
        common_context = {
            "User uploaded image URL": image_url,
            "User native language": user_native_language,
            "User message": f"'{user_message}'",
            "User drafts (current turn)": json.dumps(user_drafts, ensure_ascii=False),
            "User selections (current turn)": json.dumps(
                selections, ensure_ascii=False
            ),
            "Previous assistant message": prev_ai_response.get("assistant_message")
            or "",
            "Previous drafts": json.dumps(
                prev_ai_response.get("drafts") or [], ensure_ascii=False
            ),
            "Previous insights": json.dumps(
                prev_ai_response.get("insights") or [], ensure_ascii=False
            ),
            "Previous charts": json.dumps(
                prev_ai_response.get("charts", []) or [], ensure_ascii=False
            ),
            "Previous sources": json.dumps(
                prev_ai_response.get("sources", []) or [], ensure_ascii=False
            ),
            "Previous selections": json.dumps(
                prev_ai_response.get("selections", []) or [], ensure_ascii=False
            ),
            "Previous stats": json.dumps(
                prev_ai_response.get("stats", []) or [], ensure_ascii=False
            ),
        }

        prompt += (
            "\nHere is the info you have:\n"
            + "\n".join(f"{k}: {v}" for k, v in common_context.items())
            + "\n"
        )
        if context:
            prompt += "\n".join(f"{k}: {v}" for k, v in context.items())
        prompt += instructions
        # --- Get AI response ---
        print("prompt sent to ai: ", prompt)
        response = generate_structured_content(
            prompt, schema, prev_ai_response, image_data
        )
        print("response from ai", response)
        # --- Handle image_prompt if present ---
        image_prompts = response.get("image_prompts", []) or []

        # check if drafts has images field
        if any("images" in draft for draft in response.get("drafts", [])) or []:
            global fallback_image_url
            local_fallback_image = fallback_image_url
            if image_prompts:
                for img_req in image_prompts:
                    draft_id = img_req.get("draft_id")
                    img_prompt = img_req.get("prompt", user_message) or user_message
                    ref_imgs = img_req.get("reference_images", []) or []
                    gen_img = generate_image(img_prompt, reference_images=ref_imgs)
                    img_url = gen_img[0] if gen_img and len(gen_img) > 0 else None
                    # Find and update the draft's images field
                    for draft in response.get("drafts", []) or []:
                        if draft.get("draft_id") == draft_id and img_url:
                            local_fallback_image = img_url
                            draft["images"] = [img_url]
                # Remove image_prompts key after processing
            for draft in response.get("drafts", []) or []:
                if "images" in draft and (
                    not draft["images"] or len(draft["images"]) == 0
                ):
                    draft["images"] = [
                        local_fallback_image
                    ]  # use a default fallback image if none generated
        response.pop("image_prompts", None)
        response["editing_enabled"] = True
        return dict_to_assistant_response(
            response, tool_name=self.name, draft_cls=self.draft_cls
        )

    @abstractmethod
    def add_fields_and_format_drafts(self, finalized_entry, product_id):
        pass

    def _finalized_entry_schema(self):
        """
        Returns a schema for FinalizedEntry with:
        - The 'drafts' field using the schema for the provided draft_cls (or self.draft_cls)
        - Specified fields removed from both the drafts and the top-level entry
        """

        # Get base schema for FinalizedEntry
        entry_schema = dataclass_to_schema(FinalizedEntry)
        remove_from_entry = ["created_at", "drafts", "status", "drafts"]
        # Remove specified fields from the top-level entry schema
        for k in remove_from_entry:
            if k in entry_schema:
                del entry_schema[k]
        entry_schema["drafts"] = [dataclass_to_schema(self.draft_cls)]

        return entry_schema

    def _deserialize_drafts(self, drafts):
        # Convert dicts to the correct draft dataclass, handling nested dataclasses and enums
        return [
            _deserialize_obj(d, self.draft_cls) if isinstance(d, dict) else d
            for d in drafts
        ]

    def _serialize_drafts(self, drafts):
        # Recursively serialize dataclasses and enums to dicts/values
        return [_serialize_obj(d) for d in drafts]

    def _get_finalized_entry_with_ai_fields(
        self, drafts, product_id
    ):  # need to overwrite in subclasses if needed
        """Uses AI to fill in missing analytical fields for finalized entry."""
        # Use the schema for FinalizedEntry, but with the correct draft_cls
        entry_schema = self._finalized_entry_schema()
        print("finalized schema for saving", entry_schema)
        # Attach a reference entry (first in db) if available
        reference_entry = self.db[0] if self.db and len(self.db) > 0 else None
        product = next(
            (item for item in products_db if item.get("product_id") == product_id), None
        )
        prompt = f"""
            You are an expert assistant that analyzes and enhances {self.db_name[:-1]} content.

            Your task:
            - Fill in the following analytical fields for the provided drafts:
                - **stats**: Provide a list of stats for each draft (the number of stats lists must match the number of drafts).
                - **insights**, **recommendations**, and **graphs**: These are common to all drafts, but if you refer to a specific draft, use its language or region to identify it.
            - Fill in realistic, plausible data for all fields.
            - If you refer to a specific draft in insights, recommendations, or graphs, clearly mention its language or region.
            - I have attached a reference entry with filled data for you to use as an example of how to fill these fields.
            Drafts to analyze:
            {json.dumps([_serialize_obj(d) for d in drafts], ensure_ascii=False, indent=2)}

            Reference entry:
            {json.dumps(_serialize_obj(reference_entry), ensure_ascii=False, indent=2) if reference_entry else "None"}

            {"product this content is for:\n" + json.dumps(product) if product else ""}

            Return only valid JSON strictly matching this schema. No explanations, no extra text.
            """

        result = generate_structured_content(prompt, entry_schema)
        return result

    def finalize_and_save(self, drafts, product_id):
        # uses ai to make drafts into proper draft obejct ready to save
        if not drafts or len(drafts) == 0:
            return None
        drafts_edited = self._deserialize_drafts(drafts)
        print("drafts feed for finalize", drafts_edited)
        ai_filled = self._get_finalized_entry_with_ai_fields(drafts_edited, product_id)
        print("finalized entry for saving", ai_filled)
        finalized_entry = FinalizedEntry(
            drafts=drafts_edited,
            stats=[_deserialize_obj(s, Metric) for s in ai_filled.get("stats", [])]
            or []
            if ai_filled.get("stats")
            else None,
            insights=[
                _deserialize_obj(i, Insight)
                for i in ai_filled.get("insights", []) or []
            ]
            if ai_filled.get("insights")
            else None,
            recommendations=ai_filled.get("recommendations") or [],
            graphs=[
                _deserialize_obj(g, Graph) for g in ai_filled.get("graphs", []) or []
            ]
            if ai_filled.get("graphs")
            else None,
            created_at=datetime.now().isoformat() + "Z",
        )
        finalized_entry = _serialize_obj(finalized_entry)
        print("entry sent to sublcasses", finalized_entry)
        finalized_entry = self.add_fields_and_format_drafts(finalized_entry, product_id)
        print("finalized entry after subclasses formatted data", finalized_entry)
        self._finalize_and_save(finalized_entry)

    # to do: chat
    # add a layer before to generate the directly saveable draft
    def _finalize_and_save(self, draft):
        # This version assumes 'draft' AND all items in 'self.db' are dictionaries.
        print("inside finalize and save to db")
        print("db before", self.db)
        print("db name", self.db_name)
        # 1. Get a reference dictionary if the database is not empty.
        #    No asdict() is needed because self.db[0] is already a dictionary.
        if f"{self.db_name[:-1]}_id" in draft and draft[f"{self.db_name[:-1]}_id"] in [
            "",
            None,
        ]:
            draft[f"{self.db_name[:-1]}_id"] = self.gen_uid()
        if self.db and len(self.db) > 0:
            reference_entry = self.db[0]

            # --- KEY ALIGNMENT LOGIC (This part remains the same) ---
            for key in list(draft.keys()):
                if key not in reference_entry:
                    print("removing key:", key)
                    draft.pop(key)

            for key, ref_value in reference_entry.items():
                if key not in draft:
                    if isinstance(ref_value, str):
                        draft[key] = ""
                    elif isinstance(ref_value, list):
                        draft[key] = []
                    elif isinstance(ref_value, dict):
                        draft[key] = {}
                    else:
                        draft[key] = None
        print("db after", self.db)
        # --- DATABASE UPDATE LOGIC ---
        draft_id_key = f"{self.db_name[:-1]}_id"
        draft_id_value = draft.get(draft_id_key)

        found_and_updated = False
        if draft_id_value:
            for idx, entry_dict in enumerate(self.db):
                # THE FIX: Use .get() for dictionary access, not getattr().
                if entry_dict.get(draft_id_key) == draft_id_value:
                    print("found match", draft_id_key)
                    # THE FIX: Store the 'draft' dictionary directly. No deserialization needed.
                    self.db[idx] = draft
                    found_and_updated = True
                    break

        if not found_and_updated:
            # THE FIX: Append the 'draft' dictionary directly.
            print("appending")
            self.db.append(draft)
        print("db after all", self.db)
        # --- SAVING TO FILE ---
        with open(
            os.path.join("data", f"{self.db_name}.json"), "w", encoding="utf-8"
        ) as f:
            # THE FIX: Dump self.db directly. It is already a list of dictionaries.
            # No _serialize_obj is needed.
            json.dump(self.db, f, indent=2, ensure_ascii=False)


class PostCreationTool(GenericDraftTool):
    # status: str = "active"  #running, not running , ads,products only
    draft_cls = PostDraft
    db = posts_db
    db_name = "posts"
    remove_from_entry = ["status"]

    def __init__(self):
        super().__init__(
            name="handle_post_creation",
            description="Use to create or edit a social media post, caption, or image.",
        )

    def get_ai_prompt(self, current_user_turn, prev_ai_response, image_data, image_url):
        state = self.task_state(prev_ai_response)
        print("state: ", state)
        if state == "first_turn":
            return """
            You are an expert assistant for social media post creation and optimization.

            - Analyze the user's message and context to determine if they want to create a new post or optimize an existing one.
            - If the user wants to optimize an existing post, identify which post (if possible) and set the 'replacement_of' field to the post_id of the post being optimized. Retain any fields from the original draft that are not being changed.
            - If the user wants to create a new post, automatically detect which product the post is for, based on their message and context.
            - Present your detected product or post to the user and ask for confirmation before proceeding.
            - If you are unsure, make your best guess and ask the user to confirm or correct it.
            - Once confirmed, proceed with the appropriate action (creation or optimization).

            Be concise, clear, and ensure all required fields are filled.
            """
        elif state == "optimize":
            return """
            You are an expert assistant for social media post optimization.
            - The user wants to optimize an existing post.
            - Set the 'replacement_of' field to the post_id of the post being optimized.
            - Retain any fields from the original draft that you are not changing.
            - All drafts should have the same 'replacement_of' value.
            - Your output will fully replace the original post.
            - You can also analyze post performance and suggest improvements.
            Be concise, clear, and ensure all required fields are filled.
            """
        else:  # "new"
            return """
            You are an expert assistant for social media post creation.
            - Create a new post for the specified product (see the 'product_id' field).
            - Only create one post at a time. The 'drafts' list is for localizations (e.g., different languages or regions) of the same post.
            - You can also analyze post performance and suggest improvements.
            Be concise, clear, and ensure all required fields are filled.
            """

    def get_context_data(
        self, current_user_turn, prev_ai_response, image_data, image_url
    ):
        state = self.task_state(prev_ai_response)
        prev_drafts = (
            prev_ai_response.get("drafts", []) or [] if prev_ai_response else []
        )
        if state == "first_turn":
            return {
                "All products": json.dumps(products_db, ensure_ascii=False),
                "All posts": json.dumps(posts_db, ensure_ascii=False),
            }
        if state == "optimize":
            post_id = (
                prev_drafts[0].get("replacement_of", None)
                if prev_drafts and len(prev_drafts) > 0
                else None
            )
            post = next(
                (item for item in posts_db if item.get("post_id") == post_id), None
            )
            return {
                "Post being optimized": json.dumps(post, ensure_ascii=False),
                "Product this post is for": json.dumps(
                    next(
                        (
                            item
                            for item in products_db
                            if item.get("product_id") == post.get("product_id")
                        ),
                        None,
                    ),
                    ensure_ascii=False,
                )
                if post
                else None,
            }
        if state == "new":
            return {
                "Product this post is for": json.dumps(
                    next(
                        (
                            item
                            for item in products_db
                            if item.get("product_id") == post.get("product_id")
                        ),
                        None,
                    ),
                    ensure_ascii=False,
                )
                if post
                else None
            }

    def add_fields_and_format_drafts(self, finalized_entry, product_id):
        # --- CHANGES START HERE ---

        # 1. Use .get() for safe dictionary access. This prevents errors if a key is missing.
        draft_list = finalized_entry.get("drafts", [])
        stats_list = finalized_entry.get("stats", [])
        replacement_of = None

        localizations = []  # Create a new list to store the modified drafts

        # 2. Use dictionary methods (.pop, ['key']=) inside the loop
        for idx, draft_dict in enumerate(draft_list):
            # The dictionary way to check for a key is 'in'.
            # The dictionary way to GET and REMOVE a value is .pop().
            if "replacement_of" in draft_dict:
                replacement_of = draft_dict.pop("replacement_of")

            # Safely remove 'draft_id' if it exists.
            draft_dict.pop("draft_id", None)

            # The dictionary way to set a new key. This line was already correct.
            draft_dict["stats"] = (
                stats_list[idx] if stats_list and idx < len(stats_list) else []
            )
            localizations.append(draft_dict)

        # 3. Use dictionary assignment and .pop() instead of setattr/delattr
        finalized_entry["localizations"] = localizations
        finalized_entry.pop("drafts", None)  # Safely remove the old 'drafts' key
        finalized_entry.pop("stats", None)
        if replacement_of:
            # The dictionary way to set a dynamic key name
            finalized_entry[f"{self.db_name[:-1]}_id"] = replacement_of
        else:
            finalized_entry[f"{self.db_name[:-1]}_id"] = self.gen_uid()
        # The dictionary way to set a key
        finalized_entry["product_id"] = product_id
        # finalized_entry["status"] = "running" #only diff
        return finalized_entry


# --- Refactored AdCreationTool ---
class AdCreationTool(GenericDraftTool):
    draft_cls = AdDraft
    db = ads_db
    db_name = "ads"

    def __init__(self):
        super().__init__(
            name="handle_ad_creation",
            description="Use to create a new paid advertisement, or to analyze, optimize, or edit an existing ad campaign.",
        )

    def get_ai_prompt(self, current_user_turn, prev_ai_response, image_data, image_url):
        state = self.task_state(prev_ai_response)
        print("state: ", state)
        if state == "first_turn":
            return """
    You are an expert assistant for social media ad campaign creation and optimization.

    - Analyze the user's message and context to determine if they want to create a new ad campaign or optimize an existing one.
    - If the user wants to optimize an existing ad, identify which ad (if possible) and set the 'replacement_of' field to the ad_id of the ad being optimized. Retain any fields from the original draft that are not being changed.
    - If the user wants to create a new ad, automatically detect which product the ad is for, based on their message and context.
    - Present your detected product or ad to the user and ask for confirmation before proceeding.
    - If you are unsure, make your best guess and ask the user to confirm or correct it.
    - Once confirmed, proceed with the appropriate action (creation or optimization).
    - budget is total, always
    Be concise, clear, and ensure all required fields are filled.
    """
        elif state == "optimize":
            return """
    You are an expert assistant for social media ad campaign optimization.
    - The user wants to optimize an existing ad campaign.
    - Set the 'replacement_of' field to the ad_id of the ad being optimized.
    - Retain any fields from the original draft that you are not changing.
    - All drafts should have the same 'replacement_of' value.
    - Your output will fully replace the original ad.
    - You can also analyze ad performance and suggest improvements.
    - budget is total, always
    Be concise, clear, and ensure all required fields are filled.
    """
        else:  # "new"
            return """
    You are an expert assistant for social media ad campaign creation.
    - Create a new ad campaign for the specified product (see the 'product_id' field).
    - Only create or optimize one ad at a time. The 'drafts' list is for localizations (e.g., different languages or regions) of the same ad.
    - You can also analyze ad performance and suggest improvements.
    - budget is total, always
    Be concise, clear, and ensure all required fields are filled.
    """

    def get_context_data(
        self, current_user_turn, prev_ai_response, image_data, image_url
    ):
        state = self.task_state(prev_ai_response)
        prev_drafts = (
            prev_ai_response.get("drafts", []) or [] if prev_ai_response else []
        )
        if state == "first_turn":
            return {
                "All products": json.dumps(products_db, ensure_ascii=False),
                "All ads": json.dumps(ads_db, ensure_ascii=False),
            }
        if state == "optimize":
            ad_id = (
                prev_drafts[0].get("replacement_of", None)
                if prev_drafts and len(prev_drafts) > 0
                else None
            )
            ad = next((item for item in ads_db if item.get("ad_id") == ad_id), None)
            return {
                "Ad being optimized": json.dumps(ad, ensure_ascii=False),
                "Product this ad is for": json.dumps(
                    next(
                        (
                            item
                            for item in products_db
                            if item.get("product_id") == ad.get("product_id")
                        ),
                        None,
                    ),
                    ensure_ascii=False,
                )
                if ad
                else None,
            }
        if state == "new":
            ad_id = (
                prev_drafts[0].get("replacement_of", None)
                if prev_drafts and len(prev_drafts) > 0
                else None
            )
            ad = next((item for item in ads_db if item.get("ad_id") == ad_id), None)
            return {
                "Product this ad is for": json.dumps(
                    next(
                        (
                            item
                            for item in products_db
                            if item.get("product_id") == ad.get("product_id")
                        ),
                        None,
                    ),
                    ensure_ascii=False,
                )
                if ad
                else None
            }

    def add_fields_and_format_drafts(self, finalized_entry, product_id):
        # --- CHANGES START HERE ---

        # 1. Use .get() for safe dictionary access. This prevents errors if a key is missing.
        draft_list = finalized_entry.get("drafts", [])
        stats_list = finalized_entry.get("stats", [])
        replacement_of = None

        localizations = []  # Create a new list to store the modified drafts

        # 2. Use dictionary methods (.pop, ['key']=) inside the loop
        for idx, draft_dict in enumerate(draft_list):
            # The dictionary way to check for a key is 'in'.
            # The dictionary way to GET and REMOVE a value is .pop().
            if "replacement_of" in draft_dict:
                replacement_of = draft_dict.pop("replacement_of")

            # Safely remove 'draft_id' if it exists.
            draft_dict.pop("draft_id", None)

            # The dictionary way to set a new key. This line was already correct.
            draft_dict["stats"] = (
                stats_list[idx] if stats_list and idx < len(stats_list) else []
            )
            localizations.append(draft_dict)

        # 3. Use dictionary assignment and .pop() instead of setattr/delattr
        finalized_entry["localizations"] = localizations
        finalized_entry.pop("drafts", None)  # Safely remove the old 'drafts' key
        finalized_entry.pop("stats", None)
        if replacement_of:
            # The dictionary way to set a dynamic key name
            finalized_entry[f"{self.db_name[:-1]}_id"] = replacement_of
        else:
            finalized_entry[f"{self.db_name[:-1]}_id"] = self.gen_uid()

        # The dictionary way to set a key
        finalized_entry["product_id"] = product_id
        finalized_entry["status"] = "running"  # only diff
        return finalized_entry


class ChatInteractionTool(GenericDraftTool):
    # graphs not needed in chats.
    # chat always works in replace mode
    draft_cls = ChatDraft
    db = chats_db
    db_name = "chats"
    remove_from_entry = ["graphs", "status"]

    def __init__(self):
        super().__init__(
            name="handle_chat_interaction",
            description="Use to reply to customer messages, or summarize recent chats.",
        )

    def _finalized_entry_schema(self):
        # Start from base schema
        entry_schema = dataclass_to_schema(FinalizedEntry)
        # Remove fields not used in chat
        for k in ["graphs", "created_at"]:
            if k in entry_schema:
                del entry_schema[k]
        # Make insights and recommendations lists of lists
        entry_schema["insights"] = [[dataclass_to_schema(Insight)]]
        entry_schema["recommendations"] = [["string"]]
        return entry_schema

    def _get_finalized_entry_with_ai_fields(self, drafts, product_id=None):
        entry_schema = self._finalized_entry_schema()
        print("savign schema for chats", entry_schema)
        all_chats = self.db  # all chat entries
        prompt = f"""
            You are an expert assistant for chat interactions.

            Your task:
            - Fill in the following analytical fields for the provided chat drafts:
                - **insights**: Provide a list of lists of insights, one list per draft.
                - **recommendations**: Provide a list of lists of recommendations, one list per draft.
            - Use all previous chats as context (attached below).
            - Fill in realistic, plausible data for all fields.

            Drafts to analyze:
            {json.dumps([_serialize_obj(d) for d in drafts], ensure_ascii=False, indent=2)}

            All previous chats:
            {json.dumps([_serialize_obj(c) for c in all_chats], ensure_ascii=False, indent=2)}

            Return only valid JSON strictly matching this schema. No explanations, no extra text.
            """
        result = generate_structured_content(prompt, entry_schema)
        return result

    def add_fields_and_format_drafts(self, finalized_entry, product_id):
        pass

    def finalize_and_save(self, drafts, product_id=None):
        if not drafts or len(drafts) == 0:
            return None
        drafts_edited = self._deserialize_drafts(drafts)
        ai_filled = self._get_finalized_entry_with_ai_fields(drafts_edited, product_id)
        print("chats ai filled", ai_filled)
        insights = ai_filled.get("insights", []) or []
        recommendations = ai_filled.get("recommendations", []) or []
        stats = ai_filled.get("stats", []) or []
        chats = []
        for idx, draft in enumerate(drafts_edited):
            chat_dict = _serialize_obj(draft)
            chat_dict["insights"] = insights[idx] if idx < len(insights) else []
            chat_dict["recommendations"] = (
                recommendations[idx] if idx < len(recommendations) else []
            )
            chat_dict["graphs"] = []  # always empty for chat
            chat_dict["stats"] = stats[idx] if stats and idx < len(stats) else []
            chats.append(chat_dict)
        self._finalize_and_save(chats)

    def _finalize_and_save(self, chats):
        for chat_dict in chats:
            chat_id = chat_dict.get("chat_id")
            if not chat_id:
                continue
            for idx, entry in enumerate(self.db):
                if entry.get("chat_id") == chat_id:
                    self.db[idx]["insights"] = chat_dict.get("insights", []) or []
                    self.db[idx]["recommendations"] = (
                        chat_dict.get("recommendations", []) or []
                    )
                    self.db[idx]["graphs"] = []  # always empty for chat
                    self.db[idx]["stats"] = chat_dict.get("stats", []) or []
                    self.db[idx]["conversation_history"].append(
                        {
                            "role": "artisan",
                            "message": chat_dict.get("message", "") or "",
                            "timestamp": datetime.now().isoformat() + "Z",
                            "translation": chat_dict.get("translation", "") or "",
                        }
                    )
                    break
        # Save all chats to file
        with open(
            os.path.join("data", f"{self.db_name}.json"), "w", encoding="utf-8"
        ) as f:
            json.dump(self.db, f, indent=2, ensure_ascii=False)

    def get_context_data(
        self, current_user_turn, prev_ai_response, image_data, image_url
    ):
        state = self.task_state(prev_ai_response)
        if state == "first_turn":
            return {
                "All products": json.dumps(products_db, ensure_ascii=False),
                "All chats": json.dumps(chats_db, ensure_ascii=False),
            }
        # For other states, only include chats referenced by current drafts
        drafts = current_user_turn.get("drafts", []) or []
        chat_ids = set(d.get("chat_id") for d in drafts if d.get("chat_id"))
        relevant_chats = [chat for chat in chats_db if chat.get("chat_id") in chat_ids]
        if not relevant_chats:
            return {
                "All products": json.dumps(products_db, ensure_ascii=False),
                "All chats": json.dumps(chats_db, ensure_ascii=False),
            }
        return {
            "Relevant chats": json.dumps(relevant_chats, ensure_ascii=False),
            "all products": json.dumps(products_db, ensure_ascii=False),
        }

    def get_ai_prompt(self, current_user_turn, prev_ai_response, image_data, image_url):
        state = self.task_state(prev_ai_response)
        print("chat state:", state)
        if state == "first_turn":
            return """
    You are an expert assistant for chat interactions.

    - Analyze the user's message and context to determine which chats they want summary and suggested replies for.
    - summary will be in your reply, and replies in drafts. 
    - For each draft, use the full conversation history of its chat_id as context.
    - keep product_id as empty string
    """
        else:  # "new" (or any subsequent turn)
            return """
    You are an expert assistant for chat interactions.

    - For each draft, use the full conversation history of its chat_id as context.
    - If the user asks for a summary, generate a concise summary of the conversation so far.
    - If the user is editing, update only the relevant fields in the draft.
    - If the user is finalizing the chat, set editing_enabled to false and reply minimally.
    - Otherwise, regenerate drafts as needed.
    """


# --- Refactored ProductHelperTool ---
class ProductHelperTool(GenericDraftTool):
    draft_cls = ProductDraft
    db = products_db
    db_name = "products"

    def __init__(self):
        super().__init__(
            name="handle_product_helper",
            description="Use to create, update, or optimize a product listing, its price, or description.",
        )

    def get_ai_prompt(self, current_user_turn, prev_ai_response, image_data, image_url):
        state = self.task_state(prev_ai_response)
        print("state: ", state)
        if state == "first_turn":
            return """
    You are an expert assistant for product listing creation and optimization.

    - Analyze the user's message and context to determine if they want to create a new product listing or optimize an existing one.
    - If the user wants to optimize an existing product, identify which product (if possible) and set the 'replacement_of' field to the product_id of the product being optimized. Retain any fields from the original draft that are not being changed.
    - If the user wants to create a new product, automatically detect the product details from the user's message and context.
    - Present your detected product or product details to the user and ask for confirmation before proceeding.
    - If you are unsure, make your best guess and ask the user to confirm or correct it.
    - Once confirmed, proceed with the appropriate action (creation or optimization).

    Be concise, clear, and ensure all required fields are filled.
    """
        elif state == "optimize":
            return """
    You are an expert assistant for product listing optimization.
    - The user wants to optimize an existing product listing.
    - Set the 'replacement_of' field to the product_id of the product being optimized.
    - Retain any fields from the original draft that you are not changing.
    - Your output will fully replace the original product listing.
    - You can also analyze product performance and suggest improvements.
    Be concise, clear, and ensure all required fields are filled.
    """
        else:  # "new"
            return """
    You are an expert assistant for product listing creation.
    - Create a new product listing using the details provided (see the 'product_id' field).
    - Only create or optimize one product at a time. The 'drafts' list is for localizations (e.g., different languages or regions) of the same product.
    - You can also analyze product performance and suggest improvements.
    Be concise, clear, and ensure all required fields are filled.
    """

    def get_context_data(
        self, current_user_turn, prev_ai_response, image_data, image_url
    ):
        state = self.task_state(prev_ai_response)
        prev_drafts = (
            prev_ai_response.get("drafts", []) or [] if prev_ai_response else []
        )
        if state == "first_turn":
            return {"All products": json.dumps(products_db, ensure_ascii=False)}
        if state == "optimize":
            product_id = (
                prev_drafts[0].get("replacement_of", "") or ""
                if prev_drafts and len(prev_drafts) > 0
                else None
            )
            product = next(
                (item for item in products_db if item.get("product_id") == product_id),
                None,
            )
            return {"Product being optimized": json.dumps(product, ensure_ascii=False)}
        if state == "new":
            return {}

    # product
    def add_fields_and_format_drafts(self, finalized_entry, product_id):
        # 1. Use .get() to safely access keys from the dictionary
        drafts_list = finalized_entry.get("drafts", [])
        stats_list = finalized_entry.get("stats", [])
        first_draft = drafts_list[0] if drafts_list else None

        if first_draft:
            # 2. Use .pop() to get and remove keys from the draft dictionary
            replacement_of = first_draft.pop("replacement_of", "")
            first_draft.pop("draft_id", None)  # Also remove the draft_id

            # 3. Use .update() to merge the remaining keys from the draft
            #    into the main dictionary. This is the dictionary equivalent
            #    of the original for loop.
            finalized_entry.update(first_draft)

            # 4. Use dictionary key assignment to set keys
            if replacement_of:
                # Assumes the name is 'handle_ad_creation' -> 'ad_id'
                finalized_entry[f"{self.db_name[:-1]}_id"] = replacement_of
            else:
                finalized_entry[f"{self.db_name[:-1]}_id"] = self.gen_uid()

        # If there were no drafts, set the product_id directly
        else:
            finalized_entry[f"{self.db_name[:-1]}_id"] = self.gen_uid()
            print("set id", finalized_entry[f"{self.db_name[:-1]}_id"])

        # 5. Re-assign the 'stats' key to be the first list of stats, or an empty list
        finalized_entry["stats"] = stats_list[0] if stats_list else []

        # 6. Set the status
        finalized_entry["status"] = "running"

        # 7. Use .pop() to clean up the now-redundant 'drafts' key
        finalized_entry.pop("drafts", None)

        return finalized_entry


def dict_to_assistant_response(
    data: Dict, tool_name: str, draft_cls=Draft
) -> AssistantResponse:
    """Convert a dict (from AI output) to an AssistantResponse instance, handling nested dataclasses and draft type.
    importnat fields: assistant_message, editing_enabled
    """
    print("inside dict to assitant repsone")
    return AssistantResponse(
        assistant_message=data.get("assistant_message", "") or "",
        insights=[
            _deserialize_obj(ins, Insight) for ins in data.get("insights", []) or []
        ]
        if data.get("insights")
        else [],
        charts=[
            _deserialize_obj(chart, Graph) for chart in data.get("charts", []) or []
        ]
        if data.get("charts")
        else [],
        sources=data.get("sources", []),
        editing_enabled=data.get("editing_enabled", False),
        tool_name=tool_name,
        selections=[
            _deserialize_obj(sel, SelectionPrompt)
            for sel in data.get("selections", []) or []
        ]
        if data.get("selections")
        else [],
        stats=[_deserialize_obj(stat, Metric) for stat in data.get("stats", []) or []]
        if data.get("stats")
        else [],
        product_id=data.get("product_id") or "",
        drafts=[_deserialize_obj(d, draft_cls) for d in data.get("drafts", []) or []]
        if data.get("drafts")
        else [],
        role="assistant",
        turn_id="",
        timestamp="",
    )


class MarketResearchTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="handle_market_research",
            description="Use for market analysis, finding trends, or checking what's popular.",
        )

    def execute(
        self, current_user_turn, prev_ai_response, image_data, image_url
    ) -> AssistantResponse:
        # If user asks a follow-up (e.g. clarifies, asks about a previous trend), don't call full research again
        is_follow_up = (
            prev_ai_response.get("tool_name", "") in self.name
            if prev_ai_response
            else False
        )
        schema = dataclass_to_schema(AssistantResponse)
        print("generated scehma", schema)
        for key in [
            "role",
            "turn_id",
            "timestamp",
            "tool_name",
            "drafts",
            "selections_text",
        ]:
            schema.pop(key, None)
        print("is follow up research:", is_follow_up)
        if is_follow_up:
            prev_message = prev_ai_response.get("assistant_message") or ""
            prev_insights = prev_ai_response.get("insights") or []
            prev_recommendations = prev_ai_response.get("recommendations") or []
            prev_charts = prev_ai_response.get("charts") or []
            prev_sources = prev_ai_response.get("sources") or []
            prev_stats = prev_ai_response.get("stats") or []
            prev_selections = prev_ai_response.get("selections") or []
            followup_prompt = f"""
            You are a business research assistant. The user previously received this market research summary:
            ---
            {prev_message}
            Insights: {json.dumps(prev_insights, ensure_ascii=False)}
            Recommendations: {json.dumps(prev_recommendations, ensure_ascii=False)}
            Charts: {json.dumps(prev_charts, ensure_ascii=False)}
            Sources: {json.dumps(prev_sources, ensure_ascii=False)}
            Stats: {json.dumps(prev_stats, ensure_ascii=False)}
            Selections: {json.dumps(prev_selections, ensure_ascii=False)}
            ---
            The user now asked: '{current_user_turn.get("message", "")}'.
            and gave these selections: '{json.dumps(current_user_turn.get("selections", {}), ensure_ascii=False)}'
            {"user uploaded this image: with url " + image_url if image_url else ""}
            Respond conversationally, referencing the above insights, recommendations, charts, and sources as needed. If the user asks for more detail, expand or clarify. If they ask for a chart or source, summarize or highlight from the above. If you can't answer, say so politely. Do not repeat the entire previous answer, but build on it.
            and whereever needed, add new insights, recommendations, charts, or sources if relevant or reuse previous ones.
            """
            # Dynamically generate schema from AssistantResponse dataclass

            followup_gen = generate_structured_content(
                followup_prompt, schema, prev_ai_response, image_data
            )
            return dict_to_assistant_response(followup_gen, tool_name=self.name)

        # --- Gather raw research content ---
        scraped_data = {}
        reference_urls = []

        # --- Gemini with Grounding ---
        gemini_summary = ""
        citations = []

        try:
            print("RESEARCH: Attempting Tier 1 - Gemini with Grounding")

            # 1. Define the grounding tool directly
            # The GoogleSearch object implicitly tells the model to use grounding.
            grounding_tool = types.Tool(google_search=types.GoogleSearch())
            config = types.GenerateContentConfig(tools=[grounding_tool])
            content_parts = [
                f"As a business analyst, provide a concise summary of the market for '{current_user_turn.get('message', '')}'. Include key trends and major competitors."
            ]
            if image_data and image_data.get("data"):
                content_parts.append(Image.open(io.BytesIO(image_data["data"])))

            # 2. Pass the tool in a list to the 'tools' parameter
            grounded_response = client.models.generate_content(
                model=MODEL_ID,
                contents=content_parts,
                config=config,  # This is the correct parameter name
            )

            gemini_summary = (
                grounded_response.text.strip()
                if hasattr(grounded_response, "text")
                else ""
            )
            citations = []
            if (
                grounded_response.candidates
                and grounded_response.candidates[0].grounding_metadata.grounding_chunks
            ):
                for chunk in grounded_response.candidates[
                    0
                ].grounding_metadata.grounding_chunks:
                    if chunk.web:
                        citations.append(
                            {
                                "title": chunk.web.title or chunk.web.uri,
                                "url": chunk.web.uri,
                            }
                        )
            print("RESEARCH: Tier 1 Succeeded.")

        except Exception as e:
            print(f"RESEARCH: Tier 1 Failed with error: {e}")

        # --- Synthesize all findings with Gemini into canonical schema ---
        print("RESEARCH: Synthesizing all findings into canonical schema")

        synthesis_prompt = (
            f"You are a business research assistant. Synthesize the following research into a structured summary for an artisan:\n"
            f"ScrapeGraph data: {json.dumps(scraped_data, ensure_ascii=False)}\n"
            f"Gemini summary: {gemini_summary}\n"
            f"Reference URLs: {json.dumps(reference_urls + [c['url'] for c in citations], ensure_ascii=False)}\n"
            f"Products DB: {json.dumps(products_db, ensure_ascii=False)}\n"
            "Return a structured response with insights, recommendations, charts, and sources. "
            "If possible, include a chart of key trends. Use the schema provided. if needed make them up"
        )
        synthesis_gen = generate_structured_content(
            synthesis_prompt, schema, prev_ai_response
        )
        # Prefer all sources (ScrapeGraph + Gemini citations)
        all_sources = [{"title": url, "url": url} for url in reference_urls]
        all_sources += [c for c in citations if c not in all_sources]
        synthesis_gen["sources"] = all_sources if all_sources else None

        return dict_to_assistant_response(synthesis_gen, tool_name=self.name)


class GeneralConversationTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="general_conversation",
            description="Use for greetings, farewells, or when the user's intent is unclear.",
        )

    def execute(
        self, current_user_turn, prev_ai_response, image_data, image_url
    ) -> AssistantResponse:
        user_message = current_user_turn.get("message", "")
        # only user message as rest dont matter
        prompt = f"""
        You are a helpful and friendly AI assistant for a local artisan.
        The user has just said: "{user_message}".
        this is the entire context you have: {prev_ai_response}
        Your task is to provide a natural, conversational response.
        If the user is asking a follow-up question about a previous turn, answer it based on the history.
        If it's a simple greeting, respond warmly. if its a request, guide them that you can help with posts, ads, products, market research, or chats.
        Place your final response in the 'reply_text' field.
        """
        schema = {"assistant_message": "string"}

        response_gen = generate_structured_content(
            prompt, schema, prev_ai_response, image_data
        )

        return dict_to_assistant_response(response_gen, tool_name=self.name)


# --- Tool Registry ---
class ToolRegistry:
    def __init__(self):
        self.tools = {
            "handle_post_creation": PostCreationTool(),
            "handle_ad_creation": AdCreationTool(),
            "handle_chat_interaction": ChatInteractionTool(),
            "handle_product_helper": ProductHelperTool(),
            "handle_market_research": MarketResearchTool(),
            "general_conversation": GeneralConversationTool(),
        }

        self.tool_definitions = [
            {"name": tool.name, "description": tool.description}
            for tool in self.tools.values()
        ]

    def get_tool(self, name: str) -> BaseTool:
        return self.tools.get(name, self.tools["general_conversation"])

    def get_definitions(self) -> List[Dict]:
        return self.tool_definitions


# Updated ai_task_router with AI-controlled state decisions


def ai_task_router(
    current_user_turn: Dict,
    prev_ai_response: Dict,
    image_data: Optional[Dict] = None,
    image_url: Optional[str] = None,
) -> Dict:
    """
    Enhanced agentic router with AI-controlled state management
    Accepts frontend input keys: selections (dict), user_message (str), edits (str), image_data, image_path, history (dict or list)
    """
    registry = ToolRegistry()

    # AI decides tool and handles state transitions
    routing_prompt = f"""
    Analyze the user's intent and current context:

    User message: "{current_user_turn.get("message", "")}"
    Current selections: {json.dumps(current_user_turn.get("selections"), indent=2)}
    User uploaded image: {"Yes" if image_data else "No"}
    Previous assistant response: {json.dumps(prev_ai_response.get("assistant_message", ""), indent=2) if prev_ai_response else "None"}
    Current tool: {prev_ai_response.get("tool_name", "None") if prev_ai_response else "None"}
    Available tools: {json.dumps(registry.get_definitions(), indent=2)}

    Determine: Which tool to use (consider context switching)

    Rules:
    - If user says "publish", "launch", "go ahead" etc., they want to confirm current task
    - If asking about different topic, switch tools
    - If continuing conversation, use same tool
    """

    routing_schema = {"tool_name": "string", "reasoning": "string"}

    routing_decision = generate_structured_content(
        routing_prompt, routing_schema, prev_ai_response
    )
    chosen_tool_name = routing_decision.get("tool_name", "general_conversation")

    print(
        f"AGENT: Chose tool '{chosen_tool_name}' - {routing_decision.get('reasoning', '')}"
    )

    # Execute tool
    tool = registry.get_tool(chosen_tool_name)
    assistant_response = tool.execute(
        current_user_turn, prev_ai_response, image_data, image_url
    )

    # Convert to dict format using AssistantResponse's to_dict method
    response_dict = _serialize_obj(assistant_response)
    return response_dict


class UserTurnSummarizer:
    """Generates human-readable summaries of user actions"""

    @staticmethod
    def create_summary(
        user_turn_for_ai, prev_ai_response, image_filename
    ) -> Optional[str]:
        """
        Creates a human-readable summary of the user's turn for chat prev_ai_response.
        selections: List[Dict] like:
            [
                {
                    "prompt_id": "string",
                    "selected_option_ids": ["string"],
                    "selection_type": "single"|"multi"|"none"
                },
                ...
            ]
        prev_ai_response: dict, may have a 'selections' field (list of SelectionPrompt)
        """
        parts = []
        message = user_turn_for_ai.get("message", "") or "" if user_turn_for_ai else ""
        selections = (
            user_turn_for_ai.get("selections", []) or [] if user_turn_for_ai else []
        )
        # Add message if present
        if message:
            parts.append(message)

        # Handle selections (array of dicts)
        if selections:
            # Get assistant's selection prompts (list of SelectionPrompt dicts)
            assistant_selections = (
                prev_ai_response.get("selections", []) if prev_ai_response else []
            )
            for sel in selections:
                prompt_id = sel.get("prompt_id")
                selected_option_ids = sel.get("selected_option_ids", [])
                selection_type = sel.get("selection_type", "none")

                if not prompt_id or not selected_option_ids:
                    continue

                # Find the SelectionPrompt with this prompt_id
                prompt_label = prompt_id
                selected_labels = []

                prompt_obj = next(
                    (
                        sp
                        for sp in assistant_selections
                        if sp.get("prompt_id") == prompt_id
                    ),
                    None,
                )
                if prompt_obj:
                    prompt_label = prompt_obj.get("prompt", prompt_id)
                    options = prompt_obj.get("options", [])
                    # Map selected_option_ids to labels
                    for soid in selected_option_ids:
                        label = next(
                            (
                                opt.get("label")
                                for opt in options
                                if opt.get("id") == soid
                            ),
                            soid,
                        )
                        selected_labels.append(label)
                else:
                    selected_labels = selected_option_ids

                if selection_type == "multi":
                    parts.append(
                        f"Answered: '{prompt_label}' with options: {', '.join(selected_labels)}"
                    )
                else:
                    parts.append(
                        f"Answered: '{prompt_label}' with: {selected_labels[0] if selected_labels else ''}"
                    )
        prev_drafts = prev_ai_response.get("drafts", []) if prev_ai_response else []
        user_drafts = user_turn_for_ai.get("drafts", []) if user_turn_for_ai else []
        if prev_drafts and user_drafts:
            prev_map = {d.get("draft_id"): d for d in prev_drafts}
            user_map = {d.get("draft_id"): d for d in user_drafts}
            for draft_id in user_map:
                if user_map[draft_id] != prev_map.get(draft_id):
                    parts.append("edited draft")
                    break  # Only need to note once

        if len(parts) == 1 and parts[0] == message:
            return message
        elif parts:
            actions = [p for p in parts if p != message]
            summary = ""
            if message:
                summary += f"{message}\n\n"
            if actions:
                summary += "**Actions:**\n" + "\n".join(f"- {a}" for a in actions)
            return summary
        else:
            return None
