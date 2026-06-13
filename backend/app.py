from fastapi import FastAPI
import tensorflow as tf
import joblib
import cv2
import numpy as np

from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile, File
from fastapi import Form


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models on startup

emotion_model = tf.keras.models.load_model(
    "models/best_emotion_model.keras"
)

emotion_labels = [
    "angry",
    "disgust",
    "fear",
    "happy",
    "neutral",
    "sad",
    "surprise"
]

sentiment_model = joblib.load(
    "models/best_sentiment_model.pkl"
)

vectorizer = joblib.load(
    "models/tfidf_vectorizer.pkl"
)

SENTIMENT_MAP = {
    1: "positive",
    0: "negative"
}


@app.get("/")
def home():

    return {
        "message": "Models loaded successfully"
    }
    
    
# Sentiment prediction
    
from fastapi import Query

@app.get("/predict_sentiment")
def predict_sentiment(text: str):

    vector = vectorizer.transform([text])

    pred = sentiment_model.predict(vector)[0]

    sentiment = SENTIMENT_MAP[int(pred)]

    sentiment = (
        "positive"
        if pred == 1
        else "negative"
    )

    return {
        "text": text,
        "sentiment": sentiment
    }
    
    
# Emotion prediction
    
def preprocess_image(image_bytes):

    nparr = np.frombuffer(
        image_bytes,
        np.uint8
    )

    img = cv2.imdecode(
        nparr,
        cv2.IMREAD_GRAYSCALE
    )
    
    img = cv2.equalizeHist(img)

    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades +
        "haarcascade_frontalface_default.xml"
    )

    faces = face_cascade.detectMultiScale(
        img,
        scaleFactor=1.1,
        minNeighbors=5
    )

    if len(faces) > 0:

        x, y, w, h = faces[0]

        img = img[
            y:y+h,
            x:x+w
        ]

    img = cv2.resize(
        img,
        (48,48)
    )

    img = img.astype("float32") / 255.0

    img = np.expand_dims(
        img,
        axis=-1
    )

    img = np.expand_dims(
        img,
        axis=0
    )

    return img


@app.post("/predict_emotion")
async def predict_emotion(
    file: UploadFile = File(...)
):

    image_bytes = await file.read()

    img = preprocess_image(
        image_bytes
    )

    probs = emotion_model.predict(
        img,
        verbose=0
    )[0]

    pred_idx = np.argmax(probs)

    emotion = emotion_labels[pred_idx]

    confidence = float(probs[pred_idx])

    is_uncertain = confidence < 0.50

    return {
        "emotion": emotion,
        "confidence": confidence,
        "is_uncertain": is_uncertain,
        "all_probs": {
            emotion_labels[i]: float(probs[i])
            for i in range(len(emotion_labels))
        }
    }


# Multimodal prediction

def emotion_to_sentiment(emotion):

    positive = [
        "happy"
    ]

    negative = [
        "angry",
        "fear",
        "sad",
        "disgust"
    ]

    if emotion in positive:
        return "positive"

    if emotion in negative:
        return "negative"

    return "neutral"


@app.post("/predict_multimodal")
async def predict_multimodal(

    file: UploadFile = File(...),

    text: str = Form(...)

):

    # Emotion

    image_bytes = await file.read()

    img = preprocess_image(
        image_bytes
    )

    emotion_probs = emotion_model.predict(
        img,
        verbose=0
    )[0]

    emotion_idx = np.argmax(
        emotion_probs
    )

    emotion = emotion_labels[emotion_idx]

    emotion_conf = float(
        emotion_probs[emotion_idx]
    )

    is_uncertain = emotion_conf < 0.50

    # Sentiment

    vector = vectorizer.transform(
        [text]
    )

    sentiment_pred = sentiment_model.predict(
        vector
    )[0]

    sentiment = (
        "positive"
        if sentiment_pred == 1
        else "negative"
    )

    # Fusion Logic

    emotion_sentiment = emotion_to_sentiment(
        emotion
    )

    mismatch = (
        emotion_sentiment
        != sentiment
    )

    fusion_confidence = round(
        (emotion_conf + 1.0) / 2,
        2
    )

    return {

        "emotion": emotion,

        "emotion_confidence": round(
            emotion_conf,
            3
        ),

        "emotion_uncertain": is_uncertain,

        "sentiment": sentiment,

        "mismatch": mismatch,

        "fusion_confidence": fusion_confidence

    }