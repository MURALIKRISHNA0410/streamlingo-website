"""import time
import pygame
from gtts import gTTS
import streamlit as st
import speech_recognition as sr
from googletrans import LANGUAGES, Translator
import io
"""
from fastapi import FastAPI
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

"""app.add_middleware(
    CORSMiddleware=['http://localhost:3000'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)"""





"""@app.get("/")
def health_check():
    return 'Health check complete'


@app.post("/recordedAudio")
def audio_record():"""

"""isTranslateOn = False
translator = Translator()

# Initialize pygame.mixer
pygame.mixer.init()

# Create a mapping between language names and language codes
language_mapping = {name: code for code, name in LANGUAGES.items()}

def get_language_code(language_name):
    return language_mapping.get(language_name, language_name)

def translator_function(spoken_text, from_language, to_language):
    return translator.translate(spoken_text, src=from_language, dest=to_language)

def text_to_voice(text_data, to_language):
    myobj = gTTS(text=text_data, lang=to_language, slow=False)
    
    # Save to a BytesIO object
    audio_data = io.BytesIO()
    myobj.write_to_fp(audio_data)
    audio_data.seek(0)

    # Load and play the audio using pygame.mixer
    pygame.mixer.music.load(audio_data, 'mp3')
    pygame.mixer.music.play()

    # Wait until the sound is finished playing
    while pygame.mixer.music.get_busy():
        time.sleep(0.1)

def main_process(output_placeholder, from_language, to_language):
    global isTranslateOn

    while isTranslateOn:
        rec = sr.Recognizer()
        with sr.Microphone() as source:
            output_placeholder.text("Listening...")
            rec.pause_threshold = 1
            audio = rec.listen(source, phrase_time_limit=10)

        try:
            output_placeholder.text("Processing...")
            spoken_text = rec.recognize_google(audio, language=from_language)

            output_placeholder.text("Translating...")
            translated_text = translator_function(spoken_text, from_language, to_language)

            output_placeholder.text("Text to Speech...")
            text_to_voice(translated_text.text, to_language)

        except sr.UnknownValueError:
            output_placeholder.text("Google Speech Recognition could not understand audio")
        except sr.RequestError as e:
            output_placeholder.text(f"Could not request results from Google Speech Recognition service; {e}")
        except Exception as e:
            print(e)
            output_placeholder.text(f"Error: {e}")

# UI layout
st.title("Language Translator")

# Dropdowns for selecting languages
from_language_name = st.selectbox("Select Source Language:", list(LANGUAGES.values()))
to_language_name = st.selectbox("Select Target Language:", list(LANGUAGES.values()))

# Convert language names to language codes
from_language = get_language_code(from_language_name)
to_language = get_language_code(to_language_name)

# Button to trigger translation
start_button = st.button("Start")
stop_button = st.button("Stop")

# Check if "Start" button is clicked
if start_button:
    if not isTranslateOn:
        isTranslateOn = True
        output_placeholder = st.empty()
        main_process(output_placeholder, from_language, to_language)

# Check if "Stop" button is clicked
if stop_button:
    isTranslateOn = False
    #return "your Audio has been saved to the db"

@app.post("/VoiceCloning")
def cloned_voice():
    return "The cloned voice of the user has been saved to the db"
    """

    