#basic code for testing websocket

"""from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse

app = FastAPI()

# WebSocket route
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            print(f"Message received: {data}")
            await websocket.send_text(f"Message received: {data}")
    except WebSocketDisconnect:
        print("Client disconnected")

# HTTP route
@app.get("/")
async def read_root():
    return JSONResponse({"Hello": "World"})"""

#basec cod end here

#websoket cde with chat functinality
"""from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import List, Dict, Any

app = FastAPI()

clients: List[WebSocket] = []

@app.websocket("/meetws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)
    try:
        while True:
            try:
                # Receive the message from the WebSocket
                data = await websocket.receive_json()

                # Handle different message types (e.g., signaling, chat)
                if "type" in data:
                    message_type = data["type"]

                    # WebRTC signaling data (offer, answer, candidate)
                    if message_type in ["offer", "answer", "candidate"]:
                        for client in clients:
                            if client != websocket:
                                await client.send_json(data)

                    # Chat message
                    elif message_type == "chat":
                        chat_message = data.get("text", "")
                        for client in clients:
                            if client != websocket:
                                await client.send_json({"type": "chat", "text": chat_message})

            except Exception as e:
                print(f"Error during WebSocket communication: {e}")
                break
    except WebSocketDisconnect:
        print(f"Client disconnected: {websocket.client}")
    finally:
        if websocket in clients:
            clients.remove(websocket)
        print("WebSocket connection closed")

@app.get("/")
async def read_root():
    return {"Hello": "World"}"""
#chat fun ende here

#main code with audio transilation
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import List
#import numpy as np

import io
import time
import pygame
from gtts import gTTS
from fastapi import FastAPI, UploadFile, File
import speech_recognition as sr
from googletrans import LANGUAGES, Translator
  # Replace with your ML framework

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import List

app = FastAPI()

clients: List[WebSocket] = []

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

@app.websocket("/process_audio")
async def process_audio_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            audio_data = await websocket.receive_bytes()
            # processed_audio = process_audio_with_ml(audio_data)
            # await websocket.send_bytes(processed_audio)
            await websocket.send_bytes(audio_data)
    except WebSocketDisconnect:
        print("Audio processing client disconnected")
    finally:
        try:
            await websocket.close()
        except Exception as e:
            print(f"Error closing WebSocket: {e}")
        print("Audio WebSocket connection closed")








#The imports for the voice translation
translator = Translator()
language_mapping = {name: code for code, name in LANGUAGES.items()}
pygame.mixer.init()
def process_audio_with_ml(audio_data: bytes) -> bytes:

    # Convert byte data to a NumPy array or another format your ML model expects
    #audio_array = np.frombuffer(audio_data, dtype=np.float32)
    
    # Process with your ML model
    #processed_audio_array = some_ml_framework.process(audio_array)
    
    translator = Translator()
    pygame.mixer.init()
    
    
def get_language_code(language_name):
    return language_mapping.get(language_name, language_name)

def translator_function(spoken_text, from_language, to_language):
    return translator.translate(spoken_text, src=from_language, dest=to_language)

def text_to_voice(text_data, to_language):
    myobj = gTTS(text=text_data, lang=to_language, slow=False)

def text_to_voice(text_data, to_language):
    myobj = gTTS(text=text_data, lang=to_language, slow=False)
    
    # Save to a BytesIO object
    audio_data = io.BytesIO()
    myobj.write_to_fp(audio_data)
    audio_data.seek(0)
    pygame.mixer.music.load(audio_data, 'mp3')
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy():
        time.sleep(0.1)
@app.get("/")
async def read_root():
    return {"Hello": "World"}


