emotion_to_group = {
    "happy":"positive",
    "angry":"negative",
    "sad":"negative",
    "fear":"negative",
    "disgust":"negative",
    "neutral":"neutral",
    "surprise":"neutral"
}

def detect_mismatch(emotion_label,
                    sentiment_label):

    emotion_group = emotion_to_group[
        emotion_label
    ]

    if emotion_group == sentiment_label:
        return False

    if emotion_group == "neutral":
        return False

    return True
