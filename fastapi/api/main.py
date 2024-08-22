"""import time
import pygame
from gtts import gTTS
import streamlit as st
import speech_recognition as sr
from googletrans import LANGUAGES, Translator
import io
"""
"""from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.route import router
app =FastAPI()
import socketio

#Fast API application
app = FastAPI()
#Socket io (sio) create a Socket.IO server
sio=socketio.AsyncServer(cors_allowed_origins='*',async_mode='asgi')
#wrap with ASGI application
socket_app = socketio.ASGIApp(sio)
app.mount("/", socket_app)
#Print {"Hello":"World"} on localhost:7777
@app.get("/")
def read_root():
    return {"Hello World"}
@sio.on("connect")
async def connect(sid, env):
    print("New Client Connected to This id :"+" "+str(sid))
@sio.on("disconnect")
async def disconnect(sid):
    print("Client Disconnected: "+" "+str(sid))

app.add_middleware(
    CORSMiddleware=['http://localhost:3000'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)"""






from io import BytesIO
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse

app = FastAPI()

# WebSocket route
@app.websocket("/listen")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_bytes()
            print(data)
    except Exception as e:
        raise Exception(f'Could not process audio: {e}')
    finally:
        await websocket.close()

# HTTP route
@app.get("/")
async def read_root():
    return {"Hello": "World"}

