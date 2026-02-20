"""
Emotion Analyzer Service
Handles emotion detection, sentiment analysis, stress scoring, and behavioral insights
"""

from transformers import pipeline
import re
from typing import Dict, List


class EmotionAnalyzer:
    """Analyzes text for emotions, sentiment, and behavioral patterns"""
    
    def __init__(self):
        """Initialize emotion detection and sentiment analysis models"""
        print("📥 Loading emotion detection model...")
        
        # Load emotion detection model
        self.emotion_classifier = pipeline(
            "text-classification",
            model="j-hartmann/emotion-english-distilroberta-base",
            top_k=None,
            device=-1  # Use CPU (-1), change to 0 for GPU
        )
        
        # Load sentiment analysis model
        self.sentiment_analyzer = pipeline(
            "sentiment-analysis",
            model="distilbert-base-uncased-finetuned-sst-2-english",
            device=-1
        )
        
        # Behavioral keywords for pattern detection
        self.behavioral_patterns = {
            "anxiety": ["worried", "anxious", "nervous", "scared", "panic", "fear", "stress", "overwhelmed"],
            "depression": ["sad", "depressed", "hopeless", "empty", "worthless", "tired", "exhausted", "alone"],
            "anger": ["angry", "mad", "furious", "frustrated", "irritated", "annoyed", "hate"],
            "self_harm": ["hurt myself", "end it", "suicide", "kill myself", "self harm", "cut myself"],
            "substance": ["drink", "alcohol", "drugs", "high", "drunk", "substance"],
            "relationship": ["relationship", "partner", "spouse", "boyfriend", "girlfriend", "marriage", "divorce"],
            "work_stress": ["work", "job", "boss", "career", "deadline", "pressure", "burnout"],
            "family": ["family", "parents", "mother", "father", "sibling", "children", "kids"],
            "health": ["sick", "pain", "illness", "disease", "doctor", "hospital", "health"],
            "sleep": ["sleep", "insomnia", "tired", "exhausted", "rest", "nightmare"],
            "eating": ["eat", "food", "appetite", "weight", "hungry", "diet"],
            "social": ["friends", "lonely", "isolated", "social", "people", "alone"]
        }
        
        # Risk indicators for crisis detection
        self.risk_keywords = [
            "suicide", "kill myself", "end it all", "hurt myself", "self harm",
            "no reason to live", "better off dead", "can't go on"
        ]
        
        print("✅ Emotion analyzer initialized")
    
    def detect_emotion(self, text: str) -> Dict:
        """
        Detect emotions in text using transformer model
        
        Returns:
            Dict with primary emotion, confidence, and all emotion scores
        """
        try:
            # Get emotion predictions
            results = self.emotion_classifier(text)[0]
            
            # Sort by score
            results = sorted(results, key=lambda x: x["score"], reverse=True)
            
            # Get primary emotion
            primary_emotion = results[0]
            
            return {
                "emotion": primary_emotion["label"],
                "confidence": round(primary_emotion["score"], 3),
                "all_emotions": [
                    {"label": r["label"], "score": round(r["score"], 3)}
                    for r in results
                ]
            }
            
        except Exception as e:
            print(f"❌ Emotion detection error: {str(e)}")
            # Fallback to neutral
            return {
                "emotion": "neutral",
                "confidence": 0.5,
                "all_emotions": [{"label": "neutral", "score": 0.5}]
            }
    
    def analyze_sentiment(self, text: str) -> Dict:
        """
        Analyze sentiment (positive/negative) of text
        
        Returns:
            Dict with sentiment label and score (-1 to 1)
        """
        try:
            result = self.sentiment_analyzer(text)[0]
            
            # Convert to -1 to 1 scale
            if result["label"] == "POSITIVE":
                score = result["score"]
            else:
                score = -result["score"]
            
            return {
                "label": result["label"].lower(),
                "score": round(score, 3)
            }
            
        except Exception as e:
            print(f"❌ Sentiment analysis error: {str(e)}")
            return {
                "label": "neutral",
                "score": 0.0
            }
    
    def calculate_stress_score(self, emotion: str, sentiment: float) -> float:
        """
        Calculate stress score based on emotion and sentiment
        
        Returns:
            Float between 0 (low stress) and 1 (high stress)
        """
        # Emotion stress weights
        emotion_weights = {
            "anger": 0.8,
            "fear": 0.9,
            "sadness": 0.7,
            "disgust": 0.6,
            "surprise": 0.3,
            "joy": 0.1,
            "neutral": 0.2
        }
        
        # Get base stress from emotion
        base_stress = emotion_weights.get(emotion.lower(), 0.5)
        
        # Adjust based on sentiment (negative sentiment increases stress)
        sentiment_factor = (1 - sentiment) / 2  # Convert -1 to 1 range to 0 to 1
        
        # Combine emotion and sentiment
        stress_score = (base_stress * 0.7) + (sentiment_factor * 0.3)
        
        return round(min(max(stress_score, 0.0), 1.0), 3)
    
    def extract_behavioral_insights(self, text: str) -> Dict:
        """
        Extract behavioral keywords, themes, and risk indicators
        
        Returns:
            Dict with keywords, themes, and risk indicators
        """
        text_lower = text.lower()
        
        # Extract matching keywords
        found_keywords = []
        found_themes = []
        
        for theme, keywords in self.behavioral_patterns.items():
            matches = [kw for kw in keywords if kw in text_lower]
            if matches:
                found_keywords.extend(matches)
                found_themes.append(theme)
        
        # Remove duplicates
        found_keywords = list(set(found_keywords))
        found_themes = list(set(found_themes))
        
        # Check for risk indicators
        risk_indicators = [
            risk for risk in self.risk_keywords
            if risk in text_lower
        ]
        
        return {
            "keywords": found_keywords[:10],  # Limit to top 10
            "themes": found_themes,
            "risk_indicators": risk_indicators
        }
    
    def extract_key_phrases(self, text: str) -> List[str]:
        """
        Extract key phrases from text (simple implementation)
        
        Returns:
            List of key phrases
        """
        # Split into sentences
        sentences = re.split(r'[.!?]+', text)
        
        # Get sentences with emotional content
        key_phrases = []
        emotional_words = ["feel", "feeling", "felt", "think", "thought", "believe"]
        
        for sentence in sentences:
            sentence = sentence.strip()
            if any(word in sentence.lower() for word in emotional_words):
                if len(sentence) > 10 and len(sentence) < 100:
                    key_phrases.append(sentence)
        
        return key_phrases[:3]  # Return top 3
