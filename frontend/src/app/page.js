"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function Home() {

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const resultsRef = useRef(null);

  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [result]);

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleSubmit = async () => {

    if (!image || !text) {
      alert("Please provide both image and text");
      return;
    }

    setLoading(true);

    try {

      const formData = new FormData();

      formData.append("file", image);
      formData.append("text", text);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/predict_multimodal`,
        formData
      );

      setResult(response.data);

    } catch (error) {

      console.error(error);

      alert("Prediction failed");

    }

    setLoading(false);
  };

  const sentimentStyles = (sentiment) => {
    const s = (sentiment || "").toLowerCase();
    if (s.includes("pos")) {
      return "bg-green-50 border-green-200 text-green-700";
    }
    if (s.includes("neg")) {
      return "bg-red-50 border-red-200 text-red-700";
    }
    return "bg-gray-50 border-gray-200 text-gray-700";
  };

  // Maps each facial emotion to the sentiment we'd "expect" alongside it
  const expectedSentiment = {
    happy: "positive",
    angry: "negative",
    sad: "negative",
    fear: "negative",
    disgust: "negative",
    neutral: "neutral",
    surprise: "neutral",
  };

  // Generates a plain-language explanation of what an emotion/sentiment
  // combination might mean, including possible sarcasm or masking
  const getInsight = (emotion, sentiment) => {
    const e = (emotion || "").toLowerCase();
    const s = (sentiment || "").toLowerCase();
    const expected = expectedSentiment[e];

    if (!expected) {
      return "Not enough information to interpret this combination.";
    }

    if (expected === s) {
      return "The facial expression and the tone of the text point in the same direction, suggesting the emotion being expressed is genuine.";
    }

    if (expected === "neutral" && s === "positive") {
      return "A neutral or calm expression paired with positive text often just means understated positivity. But if the wording feels exaggerated or over-the-top, it could also be sarcasm.";
    }

    if (expected === "neutral" && s === "negative") {
      return "A neutral or calm expression paired with negative text can mean the person is downplaying frustration, or that the negative wording is actually a joke or sarcastic remark rather than a real complaint.";
    }

    if (expected === "positive" && s === "neutral") {
      return "A happy expression paired with neutral-sounding text suggests the excitement isn't fully coming through in words, perhaps due to politeness or understatement.";
    }

    if (expected === "positive" && s === "negative") {
      return "A happy expression paired with negative text is a strong contrast. This combination often points to sarcasm, irony, or a forced smile covering up how the person actually feels.";
    }

    if (expected === "negative" && s === "neutral") {
      return "A negative expression (e.g. sadness or anger) paired with neutral text may suggest the person is suppressing or downplaying how they truly feel in writing.";
    }

    if (expected === "negative" && s === "positive") {
      return "A negative expression paired with positive text is a notable contrast. This can indicate sarcasm, forced positivity, or someone putting on a brave face despite negative emotions.";
    }

    return "The emotion and sentiment signals don't fully line up. Consider the surrounding context for a clearer picture.";
  };

  return (
  <div className="min-h-screen bg-linear-to-b from-cyan-50 to-blue-100"> 
    <main className="min-h-screen p-8 max-w-5xl mx-auto">

      <h1 className="text-4xl font-bold mb-3">
        Emotion Sentiment Fusion Detector
      </h1>

      <p className="text-gray-600 mb-10">
        Upload a facial image and enter text.
        The system predicts emotion, sentiment,
        and detects mismatches between them.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">

      {/* Image Upload */}

        <div className="border rounded-2xl p-6 bg-white">

          <h2 className="text-xl font-semibold mb-4">
            Upload Image
          </h2>

          <div className="flex items-center gap-3 flex-wrap">

            <label
              htmlFor="image-upload"
              className="
                inline-block
                cursor-pointer
                border
                rounded-lg
                px-4
                py-2
                hover:bg-gray-50
                transition
              "
            >
              Choose Image
            </label>

            <span
              className="
                text-sm
                text-gray-600
                border
                rounded-lg
                px-4
                py-2.5
                inline-block
                truncate
                max-w-55
                bg-gray-50
              "
            >
              {image
                ? image.name
                : "No file selected"}
            </span>

          </div>

          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              handleFile(e.target.files?.[0]);
            }}
          />

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              mt-4
              border-2
              border-dashed
              rounded-xl
              overflow-hidden
              h-64
              flex
              items-center
              justify-center
              transition
              ${isDragging
                ? "border-gray-400 bg-gray-100"
                : "border-gray-300 bg-gray-50"}
            `}
          >

            {preview ? (

              <img
                src={preview}
                alt="preview"
                className="
                  max-h-full
                  max-w-full
                  object-contain
                "
              />

            ) : (

              <span className="text-sm text-gray-400 px-4 text-center">
                Drag and drop an image here, or use Choose Image
              </span>

            )}

          </div>

        </div>

        {/* Text Input */}

        <div className="border rounded-2xl p-6 bg-white">

          <h2 className="text-xl font-semibold mb-4">Enter Text</h2>

          <textarea className="w-full border rounded-lg p-3 bg-gray-50"
            rows={12}
            value={text}
            onChange={(e) =>
              setText(e.target.value)
            }
            placeholder="Enter text here..."
          />

        </div>


      </div>

      {/* Button */}

      <div className="mt-8">

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="
            bg-black
            text-white
            px-8
            py-3
            rounded-xl
            hover:opacity-90
            disabled:opacity-50
            inline-flex
            items-center
            gap-2
          "
        >
          {loading && (
            <span
              className="
                h-4
                w-4
                rounded-full
                border-2
                border-white
                border-t-transparent
                animate-spin
              "
            />
          )}
          {loading
            ? "Analyzing..."
            : "Analyze"}
        </button>

      </div>

      {/* Loading state */}

      {loading && (

        <div
          className="
            mt-10
            border
            rounded-2xl
            p-10
            flex
            flex-col
            items-center
            justify-center
            gap-3
            text-gray-500
            bg-white
          "
        >
          <span
            className="
              h-8
              w-8
              rounded-full
              border-2
              border-gray-300
              border-t-gray-700
              animate-spin
            "
          />
          <p>Analyzing image and text...</p>
        </div>

      )}

      {/* Results */}

      {result && (

        <div ref={resultsRef} className="mt-10 scroll-mt-8">

          <div className="rounded-2xl border p-6 shadow-sm bg-white">

            <h2 className="text-2xl font-bold mb-6">
              Analysis Results
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">

              {/* Emotion */}
              <div className="border rounded-xl p-4 bg-gray-50">
                <p className="text-sm text-gray-500 mb-1">
                  Detected Emotion
                </p>
                <p className="text-xl font-semibold capitalize mb-3">
                  {result.emotion}
                </p>

                <p className="text-sm text-gray-500 mb-1">
                  Confidence
                </p>
                <div className="w-full h-2 rounded-full bg-gray-300 overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full"
                    style={{
                      width: `${(result.emotion_confidence * 100).toFixed(0)}%`,
                    }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {(result.emotion_confidence * 100).toFixed(1)}%
                </p>
              </div>

              {/* Sentiment */}
              <div className="border rounded-xl p-4 bg-gray-50">
                <p className="text-sm text-gray-500 mb-1">
                  Text Sentiment
                </p>
                <span
                  className={`
                    inline-block
                    border
                    rounded-full
                    px-3
                    py-1
                    text-sm
                    font-medium
                    capitalize
                    ${sentimentStyles(result.sentiment)}
                  `}
                >
                  {result.sentiment}
                </span>
              </div>

            </div>

            {/* Mismatch */}
            <div className="mt-6 border rounded-xl p-4 flex items-center justify-between flex-wrap gap-3 bg-gray-50">
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Emotion / Sentiment Match
                </p>
                <p className="text-base">
                  {result.mismatch
                    ? "The facial emotion and the text sentiment don't seem to align."
                    : "The facial emotion and the text sentiment appear consistent."}
                </p>
              </div>
              <span
                className={`
                  px-3
                  py-1
                  rounded-full
                  text-sm
                  font-medium
                  border
                  ${result.mismatch
                    ? "bg-amber-50 border-amber-200 text-amber-700"
                    : "bg-green-50 border-green-200 text-green-700"}
                `}
              >
                {result.mismatch ? "Mismatch detected" : "Consistent"}
              </span>
            </div>

            {/* Insight */}
            <div className="mt-6 border rounded-xl p-4 bg-gray-50">
              <p className="text-sm text-gray-500 mb-1">
                What This Might Mean
              </p>
              <p className="text-base text-gray-700">
                {getInsight(result.emotion, result.sentiment)}
              </p>
            </div>

            {/* Fusion confidence */}
            <div className="mt-6 border rounded-xl p-4 bg-gray-50">
              <p className="text-sm text-gray-500 mb-1">
                Overall Confidence
              </p>
              <div className="w-full h-2 rounded-full bg-gray-300 overflow-hidden">
                <div
                  className="h-full bg-black rounded-full"
                  style={{
                    width: `${(result.fusion_confidence * 100).toFixed(0)}%`,
                  }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {(result.fusion_confidence * 100).toFixed(0)}% confident in this combined result
              </p>
            </div>

            {result.emotion_uncertain && (

              <div
                className="
                  mt-5
                  border
                  border-amber-200
                  bg-amber-50
                  text-amber-700
                  rounded-lg
                  p-3
                  text-sm
                "
              >
                Low-confidence emotion prediction.
                Interpret with caution.
              </div>

            )}

          </div>

        </div>

      )}

      <footer className="mt-16 text-sm text-gray-500">

        FER2013 Emotion Model Accuracy: 56.8%
        <br />
        IMDB Sentiment Model F1: 0.89

      </footer>

    </main>
  </div>
  
  );
}