# Emotion + Sentiment Fusion Detector

A multimodal machine learning project that combines:

- CNN-based facial emotion recognition
- NLP-based sentiment analysis
- Fusion logic to detect emotion-text mismatches

## Project Goals

- Build CNN from scratch using FER2013
- Build NLP sentiment classifier using IMDb reviews
- Compare TF-IDF and word embeddings
- Detect mismatches between facial emotion and text sentiment
- Deploy as a full-stack application

## Datasets

### FER2013
- Facial emotion recognition
- 7 emotion classes

### IMDb Reviews
- Binary sentiment classification
- 25,000 training reviews

## Progress

### Completed

- Dataset acquisition
- FER2013 exploration
- IMDb exploration
- CNN preprocessing pipeline
  - Image loading
  - Label encoding
  - Normalization
  - One-hot encoding
  - Train/Validation/Test split
  - Data augmentation
  - CNN implementation from scratch
  - Baseline CNN training
  - Emotion classification evaluation

## Baseline Results

- Train Accuracy: 71.25%
- Validation Accuracy: 56.04%
- Test Accuracy: 56.56%

Key Finding:
Model performs well on happy and surprise but struggles on minority classes such as disgust.
