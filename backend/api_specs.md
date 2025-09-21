Here is a reference doc for your frontend integration with the chat API:

---

# AI Assistant Chat API: Frontend Reference

## What the Frontend Should Send

When sending a chat request, the frontend must send the following fields (as form-data):

| Field         | Type           | Description                                                                 |
|---------------|----------------|-----------------------------------------------------------------------------|
| message       | string         | The user's message or query. can be empty string if user sent nothing.                                               |
| selections    | JSON string    | User's selections in response to options (see schema below). or they can be general questions aimed at the user (eg: whats the budget? what platform to post on?(insta,facebook) )               |
| image         | file (optional)| Image file uploaded by the user (optional).                                 |
| drafts        | JSON string    | Draft objects if user is editing or submitting a draft (optional).          |

### `selections` Schema (as JSON string)
```json
{
  "prompt_id": "string",                // (optional) ID of the prompt being answered
  "selected_option_ids": ["string"],    // (optional) Array of selected option IDs (single or multi)
  "selection_type": "single"            // (optional) "single", "multi", or "none"
}
```
- All fields are optional; send only those relevant to the current UI step.
- NOTE: dont send back ones of selection_type "none"
- NOTE: UI suggestion: if there are any selection_type that arent "none", enable the send button so user can send that without typing anything. 
---

## What the Frontend Will Receive

The backend will return a **list** representing the full chat history, with each turn as a dict. The most recent turn is the last item.

## What a user Turn Looks Like

| Field        | Type           | Description                                                                 |
|--------------|----------------|-----------------------------------------------------------------------------|
| role         | "user"         | Always "user"                                                               |
| turn_id      | string         | Unique turn ID                                                              |
| timestamp    | int            | Timestamp in milliseconds                                                   |
| message      | string         | User's message (can be empty string)                                        |
| selections   | object         | (optional) User's selection response (see selections schema above)          |
| image_url    | string         | (optional) If user uploaded an image                                        |
| drafts       | list of Draft  | (optional) If user is editing/submitting a draft/s                            |

_All fields not present will be `""`, `[]`, `{}`, or `None`._

---

## Each Assistant Turn looks like:

| Field               | Type                       | Description                                                                 |
|---------------------|---------------------------|-----------------------------------------------------------------------------|
| role                | "assistant"               | Always "assistant"                                                          |
| turn_id             | string                    | Unique turn ID                                                              |
| timestamp           | int                       | Timestamp in milliseconds                                                   |
| tool_name           | string                    | Name of the tool used for this response                                     |
| assistant_message   | string                    | Main message to display                                                     |
| stats               | list of list of Metric     | (optional) Stats for each draft (see below)                                 |
| insights            | list of Insight           | List of insights (see below)                                                |
| charts              | list of Graph             | List of charts (see below)                                                  |
| sources             | list of dict              | List of sources/citations (see below)                                       |
| editing_enabled     | bool                      | If true, user can continue editing/responding                               |
| selections          | list of SelectionPrompt   | List of selection prompts for the user (see below)                          |
| drafts              | list of Draft             | List of draft objects (see below)                                           |
| product_id          | string                    | Product ID this ad/post/chat affects                                                      |

**Any field not present will be `[]`, `{}`, `""`, or `None`.**

### Drafts in AssistantResponse

- Each `Draft` (e.g., `PostDraft`, `AdDraft`, `ProductDraft`, `ChatDraft`) will have the **same fields as the corresponding object in the dashboard JSON** (see your `/data/*.json`), except:
    - The following fields will always be missing or empty: `stats`, `insights`, `recommendations`, `graphs`, `status`, `created_at`
    - Drafts will have one extra field: `replacement_of` (can be ignored, or used to display the original post/ad/product being replaced)

_All fields not present will be `[]`, `{}`, `""`, or `None`._

---

### Data Structures

#### Option
```json
{
  "label": "string",
  "id": "string"
}
```

#### SelectionPrompt
```json
{
  "prompt_id": "string",
  "prompt": "string",
  "options": [Option],                // List of options (can be empty or omitted)
  "selection_type": "single"          // "single", "multi", or "none"
}
```

#### Insight
```json
{
  "text": "string", //insight gained
  "metric": {  //based on what
    "name": "string",
    "value": float, 
    "unit": "string"
  } // (optional,i.e text there but not metric possible)
  //displayed as: 
    //text
    // name+ " " +value + " "+unit
}
```

#### Graph
```json
{
  "title": "string",
  "type": "string",                   // e.g., "bar", "line", "pie"
  "x_type": "string",                 // e.g., "string", "datetime", "int","float"
  "data": [
    {
      "x": "string",
      "y": float,
      "series": "string"              // (optional) Label for multiple Y metrics (e.g., "likes", "comments")
    }
  ]
}
```

#### Source
```json
{
  "title": "string",
  "url": "string"
}
```

#### Draft (PostDraft, AdDraft, ProductDraft, ChatDraft)
- These are structured objects for posts, ads, products, or chat drafts.
- Fields depend on the type, but all are JSON objects.

---

## Rendering Order (Recommended)

1. **Assistant Message** (`assistant_message`)
2. **Insights** (`insights`)
3. **Charts** (`charts`)
4. **Sources** (`sources`)
5. **Drafts** (`drafts`) — if present, show draft editor or summary
6. **Selections/Prompts** (`selections`, `selections_text`) — render as options/buttons/forms for user input

**Note:**  
- All keys except for the ones specially mentioned to be not present will be `[]`, `{}`, `""`, or `None`.
- The dashboard ones will have their own rendering logic for chats and research, so take note of that. 

- for research, it uses same schema as response, so no changes there.
- for chat, itll have: message: str, translation: str (optional), language: str, 