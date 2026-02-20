# PsycheAI - Emotional Analysis Service

AI-powered emotional analysis service built with FastAPI for the PsycheAI platform. Provides sentiment analysis, emotion detection, stress scoring, and behavioral insights.

## Features

- **Emotion Detection**: Identifies 7 primary emotions (anger, fear, sadness, joy, surprise, disgust, neutral)
- **Sentiment Analysis**: Analyzes positive/negative sentiment with confidence scores
- **Stress Scoring**: Calculates stress levels based on emotional state
- **Behavioral Insights**: Detects keywords, themes, and risk indicators
- **Crisis Detection**: Identifies potential crisis situations and provides appropriate resources
- **Empathetic Responses**: Generates contextually appropriate counseling responses

## Tech Stack

- **FastAPI**: Modern Python web framework
- **Transformers**: Hugging Face transformer models
- **PyTorch**: Deep learning framework
- **Pydantic**: Data validation

## Models Used

1. **Emotion Detection**: `j-hartmann/emotion-english-distilroberta-base`
   - 7 emotion categories
   - High accuracy on emotional text
   - Optimized for speed

2. **Sentiment Analysis**: `distilbert-base-uncased-finetuned-sst-2-english`
   - Binary sentiment classification
   - Fast inference time
   - Reliable results

## Project Structure

```
ai-service/
├── main.py                      # FastAPI application entry point
├── services/
│   ├── __init__.py
│   ├── emotion_analyzer.py      # Emotion detection & analysis
│   └── response_generator.py    # Response generation logic
├── requirements.txt             # Python dependencies
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

## Setup Instructions

### Prerequisites

- Python 3.9 or higher
- pip (Python package manager)
- 2GB+ RAM (for model loading)
- Internet connection (first run to download models)

### Installation

1. **Navigate to the ai-service directory**
   ```bash
   cd ai-service
   ```

2. **Create a virtual environment**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create environment file**
   ```bash
   # Windows
   copy .env.example .env

   # macOS/Linux
   cp .env.example .env
   ```

5. **Run the service**
   ```bash
   python main.py
   ```

   Or with uvicorn directly:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### First Run

On the first run, the service will download the required models (~500MB). This may take a few minutes depending on your internet connection. Subsequent runs will use cached models.

## API Endpoints

### 1. Root Endpoint
```
GET /
```
Returns API information and available endpoints.

**Response:**
```json
{
  "service": "PsycheAI Emotional Analysis API",
  "version": "1.0.0",
  "status": "running",
  "endpoints": {
    "analyze": "/analyze",
    "health": "/health",
    "docs": "/docs"
  }
}
```

### 2. Health Check
```
GET /health
```
Check service health and model status.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "PsycheAI Emotional Analysis"
}
```

### 3. Analyze Text
```
POST /analyze
```
Analyze text for emotions, sentiment, stress, and behavioral patterns.

**Request Body:**
```json
{
  "text": "I'm feeling really overwhelmed with work lately and can't sleep",
  "context": "Previous conversation context (optional)"
}
```

**Response:**
```json
{
  "emotion": "fear",
  "emotion_confidence": 0.876,
  "all_emotions": [
    {"emotion": "fear", "confidence": 0.876},
    {"emotion": "sadness", "confidence": 0.654},
    {"emotion": "anger", "confidence": 0.234}
  ],
  "sentiment": -0.723,
  "sentiment_label": "negative",
  "stress_score": 0.812,
  "behavioral_insights": {
    "keywords": ["overwhelmed", "work", "sleep"],
    "themes": ["work_stress", "sleep"],
    "risk_indicators": []
  },
  "suggested_response": "I sense you're feeling anxious about work. It's completely normal to feel overwhelmed sometimes. Would you like to talk about what's contributing to these feelings? It seems like you're dealing with a lot right now. Let's focus on one thing at a time. Work-related stress can be particularly challenging.",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## API Documentation

Once the service is running, visit:
- **Interactive Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

## Testing the API

### Using cURL

```bash
# Health check
curl http://localhost:8000/health

# Analyze text
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "I am feeling really happy today!"}'
```

### Using Python

```python
import requests

# Analyze text
response = requests.post(
    "http://localhost:8000/analyze",
    json={"text": "I'm feeling anxious about my presentation tomorrow"}
)

result = response.json()
print(f"Emotion: {result['emotion']}")
print(f"Stress Score: {result['stress_score']}")
print(f"Response: {result['suggested_response']}")
```

### Using JavaScript/Fetch

```javascript
const response = await fetch('http://localhost:8000/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: "I'm feeling really stressed about work"
  })
});

const result = await response.json();
console.log('Emotion:', result.emotion);
console.log('Suggested Response:', result.suggested_response);
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `HOST` | Server host | `0.0.0.0` |
| `PORT` | Server port | `8000` |
| `EMOTION_MODEL` | Emotion detection model | `j-hartmann/emotion-english-distilroberta-base` |
| `SENTIMENT_MODEL` | Sentiment analysis model | `distilbert-base-uncased-finetuned-sst-2-english` |
| `DEVICE` | Compute device (cpu/cuda) | `cpu` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `*` |
| `LOG_LEVEL` | Logging level | `info` |

## Deployment

### Railway Deployment

1. **Create Railway project**
   - Connect your GitHub repository
   - Select the `ai-service` directory

2. **Configure environment variables**
   - Add all variables from `.env.example`
   - Set `PORT` to `$PORT` (Railway provides this)

3. **Deploy**
   - Railway will automatically detect `requirements.txt`
   - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Render Deployment

1. **Create new Web Service**
   - Connect repository
   - Root directory: `ai-service`

2. **Build settings**
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

3. **Environment variables**
   - Add all variables from `.env.example`

## Performance

- **Model Loading**: ~10-30 seconds (first time)
- **Inference Time**: 1-3 seconds per request
- **Memory Usage**: ~1.5GB RAM
- **Concurrent Requests**: Supports multiple concurrent requests

## Troubleshooting

### Models not downloading
- Check internet connection
- Ensure sufficient disk space (~1GB)
- Try manually downloading models from Hugging Face

### Out of memory errors
- Reduce batch size
- Use CPU instead of GPU
- Increase system RAM

### Slow inference
- First request is slower (model loading)
- Consider using GPU for faster inference
- Implement caching for common phrases

### Port already in use
- Change PORT in `.env` file
- Kill process using the port: `lsof -ti:8000 | xargs kill` (macOS/Linux)

## Development

### Running in development mode
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Running tests (future)
```bash
pytest tests/
```

### Code formatting
```bash
black .
flake8 .
```

## Security Considerations

- Input validation with Pydantic
- Rate limiting (implement in production)
- CORS configuration for production
- No sensitive data logging
- Crisis detection and appropriate responses

## Future Enhancements

- [ ] Conversation context awareness
- [ ] Multi-language support
- [ ] Advanced NLP features
- [ ] Caching layer for common phrases
- [ ] WebSocket support for real-time analysis
- [ ] Model fine-tuning on counseling data
- [ ] Batch processing endpoint
- [ ] Analytics and monitoring

## License

Part of the PsycheAI platform.

## Support

For issues or questions, please refer to the main PsycheAI repository.
