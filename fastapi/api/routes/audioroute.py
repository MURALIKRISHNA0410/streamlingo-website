"""import socketio
import uvicorn
from fastapi import APIRouter
from fastapi.middleware.cors import CORSMiddleware
# Create a Socket.IO server

sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins="*",  # Allow all origins; restrict as needed
)


router=APIRouter()

router.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


router.mount('/socket.io', socketio.ASGIApp(sio, other_asgi_app=router))
@sio.event
async def connect(sid, environ):
    print('Connected:', sid)

@sio.event
async def audio_data(sid, data):
    # Process the incoming audio data
    # Send the processed audio back to the client
    print("connected and In audio Route")
    processed_data="StreamLingo VoiceSync transforms your online meetings with advanced features like real-time language translations, interactive AI-powered tools."
    await sio.emit('processed-audio', processed_data, to=sid)

@sio.event
async def disconnect(sid):
    print('Disconnected:', sid)

# Attach the Socket.IO server to the FastAPI app
router= socketio.ASGIApp(sio, router)"""

"""import socketio
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware to the FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a Socket.IO server
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins="*",  # Allow all origins; restrict as needed
)

# Mount the Socket.IO app to the FastAPI app at the desired path
socket_app = socketio.ASGIApp(sio, other_asgi_app=app)
app.mount('/socket.io', socket_app)

@sio.event
async def connect(sid, environ):
    print('Connected:', sid)
    return True

@sio.event
async def audio_data(sid, data):
    # Process the incoming audio data
    print("Connected and In audio Route")
    processed_data = "StreamLingo VoiceSync transforms your online meetings with advanced features like real-time language translations, interactive AI-powered tools."
    await sio.emit('processed-audio', processed_data, to=sid)

@sio.event
async def disconnect(sid):
    print('Disconnected:', sid)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)"""


import socketio
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware to the FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a Socket.IO server
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins="*",  # Allow all origins; restrict as needed
)

# Mount the Socket.IO app to the FastAPI app at the desired path
socket_app = socketio.ASGIApp(sio, other_asgi_app=app)
app.mount('/socket.io', socket_app)

@sio.event
async def connect(sid, environ):
    print('Connected:', sid)
    return True

@sio.event
async def audio_data(sid, data):
    # Process the incoming audio data
    print("Connected and In audio Route")
    processed_data = "StreamLingo VoiceSync transforms your online meetings with advanced features like real-time language translations, interactive AI-powered tools."
    await sio.emit('processed-audio', processed_data, to=sid)

@sio.event
async def disconnect(sid):
    print('Disconnected:', sid)


