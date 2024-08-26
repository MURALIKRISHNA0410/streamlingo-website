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
from fastapi.responses import StreamingResponse
import pygame
from gtts import gTTS
from fastapi import FastAPI, UploadFile, File
import speech_recognition as sr
from googletrans import LANGUAGES, Translator
  # Replace with your ML framework

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import List
isTranslateOn=False
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
                if(data=="isTranslateOn_true"):
                    isTranslateOn=True
                elif(data=="isTranslateOn_false"):
                    isTranslateOn=False


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
        print("hii")
        while True:

            audio_data = await websocket.receive_bytes()
            print("hii")
            print(type(audio_data))
            
            #processed_audio = main_process(audio_data)
            rec = sr.Recognizer()
            audio = sr.AudioData(audio_data, sample_rate=16000, sample_width=2) 
            spoken_text = rec.recognize_google(audio, language="en")
            translated_text = translator_function(spoken_text,"fr", "en")
            myobj = gTTS(text=translated_text.text, lang="en", slow=False)
            audio_stream = io.BytesIO()
            myobj.write_to_fp(audio_stream)
            audio_stream.seek(0)
            pygame.mixer.music.load(audio_data, 'mp3')
            pygame.mixer.music.play()

    # Wait until the sound is finished playing
            while pygame.mixer.music.get_busy():
                time.sleep(0.1)
            # await websocket.send_bytes(processed_audio)
            print(type(audio_stream))
            #if not isinstance(processed_audio, bytes):
                #processed_audio = processed_audio.encode('utf-8')  # Or other relevant encoding
            await websocket.send_bytes(audio_stream)
            
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

def translator_function(spoken_text, tel, eng):
    return translator.translate(spoken_text, src="fr", dest="en")

def text_to_voice(text_data, eng):
    myobj = gTTS(text=text_data, lang="en", slow=False)
    audio_stream = io.BytesIO()
    myobj.write_to_fp(audio_stream)
    audio_stream.seek(0)  # Rewind the stream to the beginning
    print("In text to speech")
    return StreamingResponse(audio_stream, media_type="audio/wav")


def main_process(audio_data: bytes)-> bytes:
   

    while isTranslateOn:
        rec = sr.Recognizer()
        

        try:
            print("Processing...")
            spoken_text = rec.recognize_google(audio_data, language="en")

            print("Translating...")
            translated_text = translator_function(spoken_text,"fr", "en")

            print("Text to Speech...")
            text_to_voice(translated_text.text, "fr")



        except sr.UnknownValueError:
            print("Google Speech Recognition could not understand audio")
        except sr.RequestError as e:
            print(f"Could not request results from Google Speech Recognition service; {e}")
        except Exception as e:
            print(e)
            print(f"Error: {e}")


def process_audio_with_ml(audio_data: bytes) -> bytes:

    # Convert byte data to a NumPy array or another format your ML model expects
    #audio_array = np.frombuffer(audio_data, dtype=np.float32)
    
    # Process with your ML model
    #processed_audio_array = some_ml_framework.process(audio_array)
    return 
    

@app.get("/")
async def read_root():
    return {"Hello": "World"}


