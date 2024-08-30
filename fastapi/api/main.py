"""from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
import speech_recognition as sr
import os
import io
import pygame
from gtts import gTTS
from googletrans import Translator
from fastapi.middleware.cors import CORSMiddleware
from pydub import AudioSegment
import tempfile

app = FastAPI()

# Define the path where the processed audio will be saved
PROCESSED_AUDIO_PATH = 'processed_audio.wav'

class TranslationRequest(BaseModel):
    from_language_name: str = "english"
    to_language_name: str = "french"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from your frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

@app.post("/upload")
async def translate_audio(
    file: UploadFile = File(...),
    from_language_name: str = "english",
    to_language_name: str = "french"
):
    from_language = "en"
    to_language = "fr"
    
    # Convert uploaded file to WAV format
    wav_file_path = convert_to_wav(file)
    
    rec = sr.Recognizer()
    
    try:
        with sr.AudioFile(wav_file_path) as source:
            audio = rec.record(source)
        
        spoken_text = rec.recognize_google(audio, language=from_language)
        translated_text = translator_function(spoken_text, from_language, to_language)
        
        # Convert the translated text to speech and save it as WAV
        text_to_voice(translated_text.text, to_language)
        
        return {"original_text": spoken_text, "translated_text": translated_text.text}
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

def convert_to_wav(file: UploadFile):
    # Save the uploaded file to a temporary file
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        temp_file.write(file.file.read())
        temp_file_path = temp_file.name

    # Convert the temporary file to WAV format using pydub
    audio = AudioSegment.from_file(temp_file_path)
    wav_temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
    wav_temp_file_path = wav_temp_file.name
    audio.export(wav_temp_file_path, format='wav')
    
    # Clean up the temporary file
    os.remove(temp_file_path)
    
    return wav_temp_file_path

def translator_function(spoken_text, from_language, to_language):
    translator = Translator()
    return translator.translate(spoken_text, src=from_language, dest=to_language)

def text_to_voice(text_data, to_language):
    # Convert text to speech and save as WAV
    tts = gTTS(text=text_data, lang=to_language, slow=False)
    audio_data = io.BytesIO()
    tts.write_to_fp(audio_data)
    audio_data.seek(0)

    # Save the audio data as a WAV file
    with open(PROCESSED_AUDIO_PATH, 'wb') as out_file:
        out_file.write(audio_data.read())

@app.get("/processed-audio")
async def get_processed_audio():
    if not os.path.exists(PROCESSED_AUDIO_PATH):
        raise HTTPException(status_code=404, detail="Processed audio not found.")
    
    return FileResponse(PROCESSED_AUDIO_PATH)"""


import io
import wave
import time
import pygame
from fastapi import FastAPI, WebSocket,APIRouter, WebSocketDisconnect, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
import speech_recognition as sr
from googletrans import LANGUAGES, Translator 
from pymongo import MongoClient
from bson import ObjectId
from gtts import gTTS
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
router=APIRouter()
app.include_router(router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to restrict which origins can access your API
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, PUT, etc.)
    allow_headers=["*"],  # Allows all headers
)


# Initialize translator and pygame
translator = Translator()
pygame.mixer.init()



# Language mapping
language_mapping = {name: code for code, name in LANGUAGES.items()}

def get_language_code(language_name):
    return language_mapping.get(language_name, language_name)

def translator_function(spoken_text, from_language, to_language):
    return translator.translate(spoken_text, src=from_language, dest=to_language)

def text_to_voice(text_data, to_language):
    myobj = gTTS(text=text_data, lang=to_language, slow=False)
    audio_data = io.BytesIO()
    myobj.write_to_fp(audio_data)
    audio_data.seek(0)
    pygame.mixer.music.load(audio_data, 'mp3')
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy():
        time.sleep(0.1)

# WebSocket endpoint for chat functionality
@app.websocket("/meetws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients = []
    clients.append(websocket)
    try:
        while True:
            try:
                data = await websocket.receive_text()
                for client in clients:
                    if client != websocket:
                        await client.send_text(data)
            except Exception as e:
                print(f"Error during WebSocket communication: {e}")
                break
    except WebSocketDisconnect:
        print(f"Client disconnected: {websocket.client}")
    finally:
        if websocket in clients:
            clients.remove(websocket)
        try:
            await websocket.close()
        except Exception as e:
            print(f"Error closing WebSocket: {e}")
        print("WebSocket connection closed")

# WebSocket endpoint for audio processing and translation
@app.websocket("/process_audio")
async def process_audio_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            audio_data = await websocket.receive_bytes()
            rec = sr.Recognizer()
            audio = sr.AudioData(audio_data, sample_rate=16000, sample_width=2)
            try:
                spoken_text = rec.recognize_google(audio, language="en")
                translated_text = translator_function(spoken_text, "en", "fr")
                audio_stream = text_to_voice(translated_text.text, "fr")
                await websocket.send_bytes(audio_stream.getvalue())
            except sr.UnknownValueError:
                await websocket.send_text("Error: Could not understand the audio.")
            except sr.RequestError as e:
                await websocket.send_text(f"Error: {e}")
    except WebSocketDisconnect:
        print("Audio processing client disconnected")
    finally:
        try:
            await websocket.close()
        except Exception as e:
            print(f"Error closing WebSocket: {e}")
        print("Audio WebSocket connection closed")

# HTTP endpoint to translate audio
"""@app.post("/translate/")
async def translate_audio(file: UploadFile = File(...), from_language_name: str = "english", to_language_name: str = "french"):
    from_language = get_language_code(from_language_name)
    to_language = get_language_code(to_language_name)
    rec = sr.Recognizer()
    with sr.AudioFile(file.file) as source:
        audio = rec.record(source)
    try:
        spoken_text = rec.recognize_google(audio, language=from_language)
        translated_text = translator_function(spoken_text, from_language, to_language)
        text_to_voice(translated_text.text, to_language)
        return {"original_text": spoken_text, "translated_text": translated_text.text}
    except Exception as e:
        return {"error": str(e)}

# Basic HTTP route
@app.get("/")
async def read_root():
    return {"Hello": "World"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)"""



"""import wave
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import List
import speech_recognition as sr
from googletrans import LANGUAGES, Translator
from gtts import gTTS
import io
import pygame
from fastapi.responses import StreamingResponse

app = FastAPI()

clients: List[WebSocket] = []
translator = Translator()
language_mapping = {name: code for code, name in LANGUAGES.items()}
pygame.mixer.init()

# WebSocket endpoint for chat functionality
@app.websocket("/meetws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)
    try:
        while True:
            try:
                data = await websocket.receive_text()
                for client in clients:
                    if client != websocket:
                        await client.send_text(data)
            except Exception as e:
                print(f"Error during WebSocket communication: {e}")
                break
    except WebSocketDisconnect:
        print(f"Client disconnected: {websocket.client}")
    finally:
        if websocket in clients:
            clients.remove(websocket)
        try:
            await websocket.close()
        except Exception as e:
            print(f"Error closing WebSocket: {e}")
        print("WebSocket connection closed")

# WebSocket endpoint for audio processing and translation
@app.websocket("/process_audio")
async def process_audio_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            audio_data = await websocket.receive_bytes()

            # Save the received audio data for debugging (optional)
            #save_audio_file(audio_data)

            # Recognize speech from the audio data
            rec = sr.Recognizer()
            audio = sr.AudioData(audio_data, sample_rate=16000, sample_width=2)
            try:
                print("hi")
                spoken_text = rec.recognize_google(audio, language="en")
                print(f"Recognized text: {spoken_text}")

                # Translate the recognized text
                translated_text = translator_function(spoken_text, "en", "fr")
                print(f"Translated text: {translated_text.text}")

                # Convert translated text to speech
                audio_stream = text_to_voice(translated_text.text, "fr")

                # Send the audio stream back to the client
                await websocket.send_bytes(audio_stream.getvalue())

            except sr.UnknownValueError:
                print("Google Speech Recognition could not understand the audio.")
                await websocket.send_text("Error: Could not understand the audio.")
            except sr.RequestError as e:
                print(f"Could not request results from Google Speech Recognition service; {e}")
                await websocket.send_text(f"Error: {e}")
    except WebSocketDisconnect:
        print("Audio processing client disconnected")
    finally:
        try:
            await websocket.close()
        except Exception as e:
            print(f"Error closing WebSocket: {e}")
        print("Audio WebSocket connection closed")

# Translator function
def translator_function(spoken_text, src_lang, dest_lang):
    return translator.translate(spoken_text, src=src_lang, dest=dest_lang)

# Text-to-voice conversion function
def text_to_voice(text_data, lang):
    myobj = gTTS(text=text_data, lang=lang, slow=False)
    audio_stream = io.BytesIO()
    myobj.write_to_fp(audio_stream)
    audio_stream.seek(0)  # Rewind the stream to the beginning
    return audio_stream

# Save received audio for debugging
def save_audio_file(audio_data, filename="received_audio.wav"):
    with wave.open(filename, 'wb') as wf:
        wf.setnchannels(1)  # Mono channel
        wf.setsampwidth(2)  # Sample width in bytes
        wf.setframerate(16000)  # Frame rate (samples per second)
        wf.writeframes(audio_data)

# Basic HTTP route
@app.get("/")
async def read_root():
    return {"Hello": "World"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
"""

