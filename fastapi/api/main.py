import wave
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
            save_audio_file(audio_data)

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
