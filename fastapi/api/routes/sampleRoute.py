import io
import time
import pygame
from gtts import gTTS
from fastapi import FastAPI, UploadFile, File
import speech_recognition as sr
from googletrans import LANGUAGES, Translator

# Initialize FastAPI
app = FastAPI()

# Initialize translator
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

@app.post("/translate/")
async def translate_audio(file: UploadFile = File("WhatsApp Audio 2024-08-19 at 2.48.41 PM.mpeg.wav"), from_language_name: str = "english", to_language_name: str = "french"):
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