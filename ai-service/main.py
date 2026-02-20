"""
PsycheAI - Emotional Analysis Service
FastAPI service for sentiment analysis, emotion detection, and behavioral insights
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
import uvicorn
from datetime import datetime

from services.emotion_analyzer import EmotionAnalyzer
from services.response_generator import ResponseGenerator
from services.crisis_detector import CrisisDetector

# Initialize FastAPI app
app = FastAPI(
    title="PsycheAI Emotional Analysis API",
    description="AI-powered emotional analysis and counseling response generation",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
emotion_analyzer = None
response_generator = None
crisis_detector = None


# Request/Response Models
class AnalysisRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000, description="User message text")
    context: Optional[str] = Field(None, description="Optional conversation context")


class EmotionScore(BaseModel):
    emotion: str
    confidence: float


class BehavioralInsights(BaseModel):
    keywords: List[str]
    themes: List[str]
    risk_indicators: List[str]


class CrisisInfo(BaseModel):
    is_crisis: bool
    crisis_level: str
    severity_score: float
    requires_intervention: bool
    response: str
    conversation_flag: Dict


class AnalysisResponse(BaseModel):
    emotion: str
    emotion_confidence: float
    all_emotions: List[EmotionScore]
    sentiment: float
    sentiment_label: str
    stress_score: float
    behavioral_insights: BehavioralInsights
    crisis_detection: CrisisInfo
    suggested_response: str
    timestamp: str


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    timestamp: str
    service: str


# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize models on startup"""
    global emotion_analyzer, response_generator, crisis_detector
    
    print("🚀 Starting PsycheAI Emotional Analysis Service...")
    print("📦 Loading emotion detection model...")
    
    emotion_analyzer = EmotionAnalyzer()
    response_generator = ResponseGenerator()
    crisis_detector = CrisisDetector()
    
    print("✅ Models loaded successfully!")
    print("🎯 Service ready to analyze emotions")


# API Endpoints
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with API information"""
    return {
        "service": "PsycheAI Emotional Analysis API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "analyze": "/analyze",
            "health": "/health",
            "docs": "/docs"
        }
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy" if emotion_analyzer and response_generator else "initializing",
        model_loaded=emotion_analyzer is not None,
        timestamp=datetime.utcnow().isoformat(),
        service="PsycheAI Emotional Analysis"
    )


@app.post("/analyze", response_model=AnalysisResponse, tags=["Analysis"])
async def analyze_text(request: AnalysisRequest):
    """
    Analyze text for emotions, sentiment, stress levels, and behavioral patterns
    
    Returns comprehensive emotional analysis with suggested response
    """
    if not emotion_analyzer or not response_generator or not crisis_detector:
        raise HTTPException(
            status_code=503,
            detail="Service is still initializing. Please try again in a moment."
        )
    
    try:
        # PRIORITY 1: Crisis Detection (must run first)
        crisis_result = crisis_detector.detect_crisis(request.text)
        
        # If critical crisis detected, return crisis response immediately
        if crisis_result["crisis_level"] == "critical":
            print(f"🚨 CRITICAL CRISIS DETECTED: {crisis_result['indicators']}")
            
            # Still perform basic analysis for logging
            emotion_result = emotion_analyzer.detect_emotion(request.text)
            sentiment_result = emotion_analyzer.analyze_sentiment(request.text)
            stress_score = 1.0  # Maximum stress for critical crisis
            behavioral_insights = emotion_analyzer.extract_behavioral_insights(request.text)
            
            # Use crisis response instead of generated response
            suggested_response = crisis_result["response"]
        else:
            # Perform emotion analysis
            emotion_result = emotion_analyzer.detect_emotion(request.text)
            
            # Perform sentiment analysis
            sentiment_result = emotion_analyzer.analyze_sentiment(request.text)
            
            # Calculate stress score
            stress_score = emotion_analyzer.calculate_stress_score(
                emotion_result["emotion"],
                sentiment_result["score"]
            )
            
            # Extract behavioral insights
            behavioral_insights = emotion_analyzer.extract_behavioral_insights(request.text)
            
            # Generate appropriate response
            # If crisis detected (but not critical), use crisis response
            if crisis_result["is_crisis"]:
                suggested_response = crisis_result["response"]
            else:
                suggested_response = response_generator.generate_response(
                    emotion=emotion_result["emotion"],
                    sentiment=sentiment_result["label"],
                    stress_score=stress_score,
                    keywords=behavioral_insights["keywords"]
                )
        
        # Build response
        return AnalysisResponse(
            emotion=emotion_result["emotion"],
            emotion_confidence=emotion_result["confidence"],
            all_emotions=[
                EmotionScore(emotion=e["label"], confidence=e["score"])
                for e in emotion_result["all_emotions"]
            ],
            sentiment=sentiment_result["score"],
            sentiment_label=sentiment_result["label"],
            stress_score=stress_score,
            behavioral_insights=BehavioralInsights(
                keywords=behavioral_insights["keywords"],
                themes=behavioral_insights["themes"],
                risk_indicators=behavioral_insights["risk_indicators"]
            ),
            crisis_detection=CrisisInfo(
                is_crisis=crisis_result["is_crisis"],
                crisis_level=crisis_result["crisis_level"],
                severity_score=crisis_result["severity_score"],
                requires_intervention=crisis_result["requires_intervention"],
                response=crisis_result["response"],
                conversation_flag=crisis_result["conversation_flag"]
            ),
            suggested_response=suggested_response,
            timestamp=datetime.utcnow().isoformat()
        )
        
    except Exception as e:
        print(f"❌ Error during analysis: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )


# Run server
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
