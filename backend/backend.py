import json
import os
import uuid
from typing import List, Dict, Any, Optional

from fastapi import (
    FastAPI,
    File,
    Form,
    UploadFile
)
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from time import time
from ai_new import ai_task_router, UserTurnSummarizer

app = FastAPI(title="AI Artisan Assistant API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Directory and File Setup ---
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
UPLOAD_DIR = os.path.join(DATA_DIR, "uploads")
CHAT_HISTORY_FILE = os.path.join(DATA_DIR, "chat_history.json")

os.makedirs(UPLOAD_DIR, exist_ok=True)

# --- Serve Uploaded Images Statically ---
app.mount("/static", StaticFiles(directory=DATA_DIR), name="static")

# --- Response Models ---
class APIResponse:
    """Standardized API response wrapper"""
    
    @staticmethod
    def success(data: Any, message: str = "Success") -> Dict:
        return {
            "success": True,
            "message": message,
            "data": data
        }
    
    @staticmethod
    def error(message: str, error_code: str = "INTERNAL_ERROR", details: Any = None) -> Dict:
        return {
            "success": False,
            "error_code": error_code,
            "message": message,
            "details": details
        }

# --- Chat History Management ---
class ChatHistoryManager:
    """Handles chat history persistence and retrieval"""
    
    @staticmethod
    def load() -> List[Dict]:
        if not os.path.exists(CHAT_HISTORY_FILE):
            return []
        try:
            with open(CHAT_HISTORY_FILE, "r", encoding="utf-8") as f:
                content = f.read()
                return json.loads(content) if content else []
        except (json.JSONDecodeError, IOError) as e:
            print(f"Error loading chat history: {e}")
            return []

    @staticmethod
    def save(history: List[Dict]) -> bool:
        try:
            with open(CHAT_HISTORY_FILE, "w", encoding="utf-8") as f:
                json.dump(history, f, indent=2)
            return True
        except IOError as e:
            print(f"Error saving chat history: {e}")
            return False
# --- File Upload Handler ---
class FileUploadHandler:
    """Handles file uploads and generates URLs"""
    
    @staticmethod
    async def process_upload(image: UploadFile) -> tuple[Dict, str, str]:
        """
        Process uploaded file and return (image_data, image_url, filename)
        """
        if not image or not image.filename:
            return None, None, None
            
        # Generate unique filename
        unique_filename = f"{uuid.uuid4()}{os.path.splitext(image.filename)[1]}"
        file_location = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Save file
        contents = await image.read()
        with open(file_location, "wb") as f:
            f.write(contents)
        
        # Return processed data
        image_data = {"mime_type": image.content_type, "data": contents}
        image_url = f"/static/uploads/{unique_filename}"
        
        return image_data, image_url, image.filename
# --- Dashboard Endpoints ---
class DashboardHandler:
    @staticmethod
    def return_json(word: str):
        """Unified dashboard data loader for all endpoints"""
        try:
            data = DashboardHandler.read_json_file(f"{word}.json")
            return APIResponse.success(data)
        except Exception as e:
            return JSONResponse(
                status_code=500,
                content=APIResponse.error(f"Failed to fetch {word}", details=str(e))
            )
        
    
    @staticmethod
    def read_json_file(filename: str) -> Dict:
        path = os.path.join(DATA_DIR, filename)
        if not os.path.exists(path):
            return {}
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError) as e:
            print(f"Error reading {filename}: {e}")
            return {}

@app.get("/dashboard/posts")
async def posts_dashboard():
    return DashboardHandler.return_json("posts")

@app.get("/dashboard/chats")
async def chats_dashboard():
    return DashboardHandler.return_json("chats")

@app.get("/dashboard/products")
async def products_dashboard():
    return DashboardHandler.return_json("products")

@app.get("/dashboard/ads")
async def ads_dashboard():
    return DashboardHandler.return_json("ads")

@app.get("/dashboard/research")
async def research_dashboard():
    return DashboardHandler.return_json("research")

# --- Additional Utility Endpoints ---

@app.get("/assistant/history")
async def get_chat_history():
    """Get the current chat history"""
    try:
        history = ChatHistoryManager.load()
        return APIResponse.success(history)
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content=APIResponse.error("Failed to fetch chat history", details=str(e))
        )

@app.delete("/assistant/history")
async def clear_chat_history():
    """Clear the chat history"""
    try:
        if ChatHistoryManager.save([]):
            return APIResponse.success({}, "Chat history cleared successfully")
        else:
            return JSONResponse(
                status_code=500,
                content=APIResponse.error("Failed to clear chat history")
            )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content=APIResponse.error("Failed to clear chat history", details=str(e))
        )

# --- Error Handlers ---
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content=APIResponse.error(
            "Endpoint not found",
            error_code="NOT_FOUND"
        )
    )

@app.exception_handler(405)
async def method_not_allowed_handler(request, exc):
    return JSONResponse(
        status_code=405,
        content=APIResponse.error(
            "Method not allowed",
            error_code="METHOD_NOT_ALLOWED"
        )
    )




@app.post("/assistant/chat")
async def assistant_chat(
    message: Optional[str] = Form(None),
    selections: str = Form("[{}]"),
    image: Optional[UploadFile] = File(None),
    drafts: Optional[str] = Form(None)
):
    """
    Main unified chat endpoint for AI assistant interaction.
    
    This endpoint handles all user interactions in a stateless manner.
    The frontend sends user data and receives a complete response structure.
    """
    try:
        # Load current chat prev_ai_response
        history = ChatHistoryManager.load()
        length_chat = len(history)
        prev_ai_response = history[-1] if length_chat > 1 else {}  #get last ai turn only
        print(prev_ai_response)
        parsed_selections =None
        # Parse user selections
        try:
            parsed_selections = json.loads(selections)
        except json.JSONDecodeError:
            return JSONResponse(
                status_code=400,
                content=APIResponse.error(
                    "Invalid selections JSON format",
                    error_code="INVALID_JSON"
                )
            )
        
        # Process file upload if present
        image_data, image_url, image_filename = await FileUploadHandler.process_upload(image)
        
        
        parsed_drafts = json.loads(drafts) if drafts else None
        
        
        # Combine selections from previous turn and current turn
        
        # Prepare context for AI router
        user_turn_for_ai = {
            "message": message,
            "selections": parsed_selections,
            "image_url": image_url,
            "drafts":parsed_drafts,
        }
        
        # Execute AI router
        #image data not in turn 
        print("prev_ai_response",prev_ai_response)
        assistant_turn = ai_task_router(current_user_turn=user_turn_for_ai,
                                        prev_ai_response=prev_ai_response, 
                                        image_data=image_data,
                                        image_url=  image_url
                                        )
        print("assistant response",assistant_turn)
        # Create user turn summary
        summary = UserTurnSummarizer.create_summary(user_turn_for_ai,prev_ai_response,image_filename)
        print("chat summary",summary)
        # If no meaningful input, return current prev_ai_response
        if not summary:
            return JSONResponse(content=prev_ai_response)
        # Build user turn object
        user_turn = {
            "role": "user",
            "content": summary,
            "turn_id": f"user_{length_chat}",
            "timestamp": int(time() * 1000),  # milliseconds
            "image_url": image_url ,
            "selections": parsed_selections ,
            "drafts": parsed_drafts
        }
        
        # Add user turn to prev_ai_response
        history.append(user_turn)

        # Ensure assistant turn has required fields
        assistant_turn["role"] = "assistant"
        assistant_turn["turn_id"] = f"assistant_{length_chat+1}"
        assistant_turn["timestamp"] = int(time() * 1000)  # milliseconds
        # Add assistant turn to history
        history.append(assistant_turn)

        # Save updated history
        if not ChatHistoryManager.save(history):
            print("Warning: Failed to save chat history")

        return JSONResponse(content=history)

    except ValueError as e:
        return JSONResponse(
            status_code=400,
            content=APIResponse.error(
                "Invalid request data",
                error_code="VALIDATION_ERROR",
                details=str(e)
            )
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content=APIResponse.error(
                "Internal server error occurred",
                error_code="INTERNAL_ERROR",
                details=str(e) if app.debug else None
            )
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        reload_dirs=["./"]
    )