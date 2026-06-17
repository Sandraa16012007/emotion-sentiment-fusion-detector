# Emotion Sentiment Fusion Detector

An AI-powered multimodal emotion analysis system that combines **Computer Vision** and **Natural Language Processing** to detect emotional consistency between facial expressions and textual sentiment.

The system analyzes a user's uploaded facial image and written text, predicts the underlying emotion and sentiment, and identifies whether both modalities align or contradict each other.

---

## Live Demo

### Frontend

https://emotion-sentiment-fusion-detector.vercel.app/

### Backend API Docs

https://emotion-sentiment-fusion-detector-backend.onrender.com/docs

---

# Project Overview

Human emotions are often communicated through multiple channels simultaneously. A person may express happiness through text while displaying sadness through facial expressions, or vice versa.

This project explores **multimodal emotion understanding** by combining:

* Facial Emotion Recognition (Computer Vision)
* Text Sentiment Analysis (Natural Language Processing)
* Fusion Logic Layer

The final system determines:

* Detected facial emotion
* Detected textual sentiment
* Confidence scores
* Emotion-sentiment consistency
* Potential emotional mismatch

---

# Features

## Facial Emotion Recognition

Predicts one of seven emotions:

* Angry
* Disgust
* Fear
* Happy
* Neutral
* Sad
* Surprise

### Techniques Used

* CNN-based deep learning model
* Face detection using Haar Cascades
* Histogram equalization
* Image normalization
* Confidence estimation

---

## Text Sentiment Analysis

Predicts:

* Positive
* Negative

### Techniques Used

* TF-IDF Vectorization
* Logistic Regression Classifier
* Custom preprocessing pipeline

---

## Multimodal Fusion Layer

Combines predictions from both models and identifies:

### Match

Example:

Emotion: Happy

Sentiment: Positive

Result:

Consistent emotional state

---

### Mismatch

Example:

Emotion: Sad

Sentiment: Positive

Result:

Potential emotional inconsistency

---

# Development Journey

This project was built incrementally through multiple experimentation stages.

---

## Phase 1: Dataset Exploration

Started by exploring:

### FER2013

Used for facial emotion recognition.

Contains grayscale facial images labeled with seven emotion classes.

### IMDB Movie Reviews Dataset

Used for sentiment analysis.

Contains 50,000 movie reviews labeled as positive or negative.

---

## Phase 2: Computer Vision Pipeline

Several CNN architectures were tested.

Experiments included:

* Baseline CNN
* Batch Normalization
* Data Augmentation
* Improved CNN Architectures

The final model achieved significantly better generalization compared to the baseline.

### Final Emotion Model

* Input Size: 48×48 grayscale images
* Classes: 7 emotions
* Framework: TensorFlow / Keras

---

## Phase 3: NLP Pipeline

Multiple approaches were explored:

### Naive Bayes Baseline

Established an initial benchmark.

### TF-IDF + Logistic Regression

Produced the strongest results.

### GloVe Embeddings

Experimented with dense word embeddings for comparison.

---

### Final Sentiment Model

Dataset Size:

50,000 reviews

Feature Extraction:

TF-IDF Vectorization

Classifier:

Logistic Regression

Performance:

* Accuracy: 80%
* Precision: 82.5%
* Recall: 75.5%
* F1 Score: 78.9%

---

## Phase 4: Fusion Logic

A custom fusion layer was implemented to:

* Map emotions to sentiment categories
* Detect mismatches
* Generate fusion confidence scores

---

## Phase 5: Backend Development

Built using FastAPI.

Responsibilities:

* Model loading
* Image preprocessing
* Sentiment prediction
* Emotion prediction
* Fusion logic execution

---

## Phase 6: Frontend Development

Built using Next.js and React.

Features:

* Image upload
* Text input
* Real-time predictions
* Confidence visualization
* Responsive UI

---

## Phase 7: Deployment

### Backend

Deployed on Render

Includes:

* TensorFlow model serving
* Scikit-learn inference
* FastAPI endpoints

### Frontend

Deployed on Vercel

Connected securely to Render backend using CORS configuration.

---

# System Architecture

Image
↓
CNN Emotion Model
↓
Emotion Prediction

Text
↓
TF-IDF Vectorizer
↓
Logistic Regression
↓
Sentiment Prediction

Emotion + Sentiment
↓
Fusion Logic
↓
Final Analysis Result

---

# Project Structure

```text
emotion-sentiment-fusion-detector/

├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── runtime.txt
│   └── models/
│
├── frontend/
│   ├── app/
│   ├── public/
│   └── src/
│
├── notebooks/
│
├── models/
│
└── README.md
│
└── .gitignore
```

# API Endpoints

## Health Check

```http
GET /
```

Response:

```json
{
  "message": "Models loaded successfully"
}
```

---

## Sentiment Prediction

```http
GET /predict_sentiment
```

---

## Emotion Prediction

```http
POST /predict_emotion
```

Upload:

* Image File

---

## Multimodal Prediction

```http
POST /predict_multimodal
```

Upload:

* Image File
* Text

Response:

```json
{
  "emotion": "happy",
  "sentiment": "positive",
  "mismatch": false,
  "fusion_confidence": 0.97
}
```

---

# Screenshots

## Home Page

<img width="1478" height="822" alt="image" src="https://github.com/user-attachments/assets/c4e40677-1333-4af9-9a34-e3cbbe08e066" />

---

## Prediction Results

<img width="677" height="817" alt="image" src="https://github.com/user-attachments/assets/ed8726c2-339b-42ee-8ab0-155a8e45fbd6" />

---

## API Documentation

<img width="1868" height="850" alt="image" src="https://github.com/user-attachments/assets/5320a7d4-6e64-444a-a603-3636c3a23b14" />

---

# Running Locally

## Clone Repository

```bash
git clone https://github.com/Sandraa16012007/emotion-sentiment-fusion-detector.git

cd emotion-sentiment-fusion-detector
```

---

# Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run FastAPI:

```bash
uvicorn app:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Docs:

```text
http://127.0.0.1:8000/docs
```

---

# Frontend Setup

```bash
cd frontend

npm install
```

Create:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Run:

```bash
npm run dev
```

Frontend:

```text
http://localhost:3000
```

---

# Technologies Used

## Machine Learning

* TensorFlow
* Keras
* Scikit-Learn
* NumPy
* Pandas

## Computer Vision

* OpenCV

## Backend

* FastAPI
* Uvicorn

## Frontend

* Next.js
* React
* Axios
* Tailwind CSS

## Deployment

* Render
* Vercel

---

# Future Improvements

* Transformer-based sentiment analysis
* Improved facial emotion model
* Emotion intensity prediction
* Emotion timeline tracking
* Real-time webcam analysis
* Speech emotion recognition
* Advanced multimodal fusion strategies

---

