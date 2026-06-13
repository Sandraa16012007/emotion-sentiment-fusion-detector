from fastapi import FastAPI
import tensorflow as tf
import joblib

app = FastAPI()

# Load models on startup

emotion_model = tf.keras.models.load_model(
    "models/best_emotion_model.keras"
)

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
    
    
@app.get("/debug_sentiment")
def debug_sentiment(text: str):

    vector = vectorizer.transform([text])

    pred = sentiment_model.predict(vector)[0]

    probs = sentiment_model.predict_proba(vector)[0]

    return {
        "prediction": int(pred),
        "probabilities": probs.tolist(),
        "nonzero_features": int(vector.nnz)
    }

