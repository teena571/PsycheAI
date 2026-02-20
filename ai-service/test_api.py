"""
Test script for PsycheAI Emotional Analysis API
Run this after starting the service to verify it's working correctly
"""

import requests
import json
from typing import Dict

# API base URL
BASE_URL = "http://localhost:8000"


def print_section(title: str):
    """Print a formatted section header"""
    print("\n" + "=" * 60)
    print(f"  {title}")
    print("=" * 60)


def test_health_check():
    """Test the health check endpoint"""
    print_section("Testing Health Check Endpoint")
    
    try:
        response = requests.get(f"{BASE_URL}/health")
        response.raise_for_status()
        
        data = response.json()
        print(f"✅ Status: {data['status']}")
        print(f"✅ Model Loaded: {data['model_loaded']}")
        print(f"✅ Service: {data['service']}")
        return True
        
    except Exception as e:
        print(f"❌ Health check failed: {str(e)}")
        return False


def test_analyze(text: str, description: str):
    """Test the analyze endpoint with given text"""
    print_section(f"Testing: {description}")
    print(f"Input: \"{text}\"")
    
    try:
        response = requests.post(
            f"{BASE_URL}/analyze",
            json={"text": text}
        )
        response.raise_for_status()
        
        data = response.json()
        
        print(f"\n📊 Analysis Results:")
        print(f"  Emotion: {data['emotion']} (confidence: {data['emotion_confidence']})")
        print(f"  Sentiment: {data['sentiment_label']} (score: {data['sentiment']})")
        print(f"  Stress Score: {data['stress_score']}")
        
        if data['behavioral_insights']['keywords']:
            print(f"  Keywords: {', '.join(data['behavioral_insights']['keywords'])}")
        
        if data['behavioral_insights']['themes']:
            print(f"  Themes: {', '.join(data['behavioral_insights']['themes'])}")
        
        if data['behavioral_insights']['risk_indicators']:
            print(f"  ⚠️  Risk Indicators: {', '.join(data['behavioral_insights']['risk_indicators'])}")
        
        print(f"\n💬 Suggested Response:")
        print(f"  {data['suggested_response']}")
        
        return True
        
    except Exception as e:
        print(f"❌ Analysis failed: {str(e)}")
        return False


def main():
    """Run all tests"""
    print("\n🚀 PsycheAI Emotional Analysis API - Test Suite")
    print("=" * 60)
    
    # Test health check
    if not test_health_check():
        print("\n❌ Service is not running. Please start the service first:")
        print("   python main.py")
        return
    
    # Test cases
    test_cases = [
        {
            "text": "I'm feeling really happy today! Everything is going great!",
            "description": "Positive/Happy Emotion"
        },
        {
            "text": "I'm so worried about my job interview tomorrow. I can't stop thinking about it.",
            "description": "Anxiety/Fear"
        },
        {
            "text": "I feel so alone and sad. Nobody understands what I'm going through.",
            "description": "Sadness/Depression"
        },
        {
            "text": "I'm so frustrated with my boss! He never listens to my ideas.",
            "description": "Anger/Frustration"
        },
        {
            "text": "Work has been really stressful lately. I can't sleep and feel exhausted all the time.",
            "description": "Work Stress with Sleep Issues"
        },
        {
            "text": "My relationship is falling apart and I don't know what to do.",
            "description": "Relationship Issues"
        },
        {
            "text": "Just had a normal day at work. Nothing special happened.",
            "description": "Neutral Emotion"
        }
    ]
    
    # Run tests
    passed = 0
    for test_case in test_cases:
        if test_analyze(test_case["text"], test_case["description"]):
            passed += 1
    
    # Summary
    print_section("Test Summary")
    print(f"✅ Passed: {passed}/{len(test_cases) + 1}")
    print(f"❌ Failed: {len(test_cases) + 1 - passed}/{len(test_cases) + 1}")
    
    if passed == len(test_cases) + 1:
        print("\n🎉 All tests passed! The API is working correctly.")
    else:
        print("\n⚠️  Some tests failed. Please check the errors above.")


if __name__ == "__main__":
    main()
