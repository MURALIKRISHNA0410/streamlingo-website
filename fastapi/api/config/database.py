from pymongo import MongoClient
client =MongoClient("mongodb+srv://muralikrishnamurakonda04:StreamLingo123@streamlingo.akr5d.mongodb.net/?retryWrites=true&w=majority&appName=StreamLingo"
)

db=client.sample_db

collection_name=db["sample_db"]

collection_name2=db["audio_files"]