import io
from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from models.samples import Sample,AudioMetadata
from config.database import collection_name,collection_name2
from schema.schemas import list_serial
from bson import ObjectId

router=APIRouter()


@router.get("/")
async def get_sample():
    samples=list_serial(collection_name.find())
    return samples

@router.post('/')
async def post_sample(sample:Sample):
    collection_name.insert_one(dict(sample))

@router.put("/{id}")
async def put_todo(id:str,sample:Sample):
    collection_name.find_one_and_update({"_id":ObjectId(id)},{"$set":dict(sample)})

@router.post("/Audio")
async def upload_audio(files: list[UploadFile] = File(...)):
    try:
        file_data = []
        for file in files:
            content = await file.read()
            file_data.append({
                "filename": file.filename,
                "content": content
            })

        # Create a single document with all the files
        document = {
            "files": file_data
        }

        # Insert the document into the collection
        result = collection_name2.insert_one(document)

        return {"message": "Files uploaded successfully", "document_id": str(result.inserted_id)}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail="File upload failed") from e


@router.get("/get-audio/{file_id}/{file_index}")
async def get_audio(file_id: str, file_index: int):
    try:
        # Convert file_id to ObjectId
        file_id = ObjectId(file_id)

        # Retrieve the document from the MongoDB collection
        file_doc = collection_name2.find_one({"_id": file_id})
        
        if file_doc is None:
            raise HTTPException(status_code=404, detail="File not found")

        # Ensure the file_index is valid
        if file_index < 0 or file_index >= len(file_doc["files"]):
            raise HTTPException(status_code=400, detail="Invalid file index")

        # Retrieve the specific file from the array
        file_data = file_doc["files"][file_index]
        content_type = file_data.get("content_type", "audio/mpeg")  # Default to "audio/mpeg" if not specified
        filename = file_data.get("filename", "audio.mp3")  # Default filename

        # Stream the file content
        return StreamingResponse(
            io.BytesIO(file_data["content"]),
            media_type=content_type,
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
