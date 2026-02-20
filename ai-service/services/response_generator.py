"""
Response Generator Service
Generates empathetic and contextually appropriate counseling responses
"""

import random
from typing import List


class ResponseGenerator:
    """Generates empathetic responses based on emotional analysis"""
    
    def __init__(self):
        """Initialize response templates"""
        
        # Response templates organized by emotion
        self.response_templates = {
            "anger": [
                "I can sense you're feeling angry right now. It's completely valid to feel this way. Would you like to talk about what's triggering these feelings?",
                "Your anger is understandable. Sometimes expressing these feelings is the first step. What's been bothering you?",
                "I hear the frustration in your words. Anger often comes from feeling hurt or misunderstood. Can you tell me more about what's happening?",
                "It sounds like something has really upset you. I'm here to listen without judgment. What would help you feel better right now?"
            ],
            
            "fear": [
                "I sense you're feeling anxious or fearful. These feelings can be overwhelming, but you're not alone. What's weighing on your mind?",
                "Fear is a natural response, and it's okay to feel this way. Let's take this one step at a time. What are you most worried about?",
                "I can tell you're going through something difficult. Anxiety can be exhausting. Would you like to talk about what's causing these feelings?",
                "Your concerns are valid. Sometimes just talking about our fears can help. I'm here to support you. What's troubling you most?"
            ],
            
            "sadness": [
                "I hear that you're feeling down. It's okay to feel sad, and your emotions are valid. Would you like to share what's troubling you?",
                "I'm sorry you're going through this. Sadness is a natural part of being human. How can I support you right now?",
                "It sounds like you're carrying a heavy burden. I'm here to listen. What's been making you feel this way?",
                "Your feelings matter, and it's brave of you to express them. Let's talk about what's been weighing on your heart."
            ],
            
            "joy": [
                "It's wonderful to hear the positivity in your message! I'm glad you're feeling good. What's been bringing you joy?",
                "Your happiness is contagious! It's great to see you in such a positive space. Tell me more about what's going well.",
                "I love hearing about the good things happening in your life. Celebrating these moments is important. What else has been making you smile?",
                "That's fantastic! It's important to acknowledge and appreciate these positive feelings. What's contributing to your happiness?"
            ],
            
            "surprise": [
                "It sounds like something unexpected has happened. How are you processing this?",
                "Surprises can be overwhelming, whether good or challenging. How are you feeling about this situation?",
                "That must have caught you off guard. Would you like to talk about how you're handling this?",
                "Unexpected events can stir up many emotions. I'm here to help you work through them. What happened?"
            ],
            
            "disgust": [
                "I can sense your strong reaction to this situation. It's okay to feel uncomfortable. What's bothering you?",
                "Sometimes we encounter things that deeply disturb us. Your feelings are valid. Would you like to talk about it?",
                "I hear your discomfort. These feelings often signal that something doesn't align with our values. What's on your mind?",
                "Your reaction is understandable. Let's explore what's causing these feelings. Can you tell me more?"
            ],
            
            "neutral": [
                "I'm here to listen. What's on your mind today?",
                "Thank you for sharing. How are you feeling about everything?",
                "I'm here to support you. What would you like to talk about?",
                "Tell me more about what's going on. I'm listening.",
                "How can I help you today? I'm here for you."
            ]
        }
        
        # Stress-specific responses
        self.high_stress_additions = [
            " I notice you might be under significant stress. Remember to take deep breaths.",
            " It seems like you're dealing with a lot right now. Let's focus on one thing at a time.",
            " I can sense the pressure you're under. It's important to be gentle with yourself.",
            " You're handling a lot. Remember, it's okay to take breaks and ask for help."
        ]
        
        # Crisis response (if risk indicators detected)
        self.crisis_response = (
            "I'm deeply concerned about what you've shared. Your safety is the most important thing. "
            "Please reach out to a crisis helpline immediately: National Suicide Prevention Lifeline "
            "at 988 or 1-800-273-8255. They have trained counselors available 24/7. "
            "You don't have to face this alone."
        )
        
        print("✅ Response generator initialized")
    
    def generate_response(
        self,
        emotion: str,
        sentiment: str,
        stress_score: float,
        keywords: List[str]
    ) -> str:
        """
        Generate contextually appropriate empathetic response
        
        Args:
            emotion: Primary detected emotion
            sentiment: Sentiment label (positive/negative)
            stress_score: Calculated stress level (0-1)
            keywords: Behavioral keywords detected
        
        Returns:
            Empathetic response string
        """
        # Check for crisis keywords
        crisis_keywords = ["suicide", "kill myself", "hurt myself", "self harm", "end it"]
        if any(keyword in keywords for keyword in crisis_keywords):
            return self.crisis_response
        
        # Get base response for emotion
        emotion_lower = emotion.lower()
        templates = self.response_templates.get(
            emotion_lower,
            self.response_templates["neutral"]
        )
        
        # Select random template to avoid repetition
        base_response = random.choice(templates)
        
        # Add stress-specific addition if stress is high
        if stress_score > 0.7:
            stress_addition = random.choice(self.high_stress_additions)
            base_response += stress_addition
        
        # Add context-specific additions based on keywords
        if keywords:
            context_addition = self._get_context_addition(keywords)
            if context_addition:
                base_response += f" {context_addition}"
        
        return base_response
    
    def _get_context_addition(self, keywords: List[str]) -> str:
        """
        Generate context-specific additions based on keywords
        
        Args:
            keywords: List of detected behavioral keywords
        
        Returns:
            Additional context-aware text
        """
        context_additions = {
            "work": "Work-related stress can be particularly challenging.",
            "relationship": "Relationship issues can affect us deeply.",
            "family": "Family dynamics can be complex and emotional.",
            "sleep": "Sleep problems can impact our overall wellbeing.",
            "health": "Health concerns are always valid and important.",
            "lonely": "Feeling isolated is difficult, but reaching out is a brave step.",
            "anxious": "Anxiety is manageable with the right support and strategies.",
            "depressed": "Depression is real, and seeking help is a sign of strength."
        }
        
        # Find matching context
        for keyword in keywords:
            for key, addition in context_additions.items():
                if key in keyword:
                    return addition
        
        return ""
    
    def generate_followup_questions(self, emotion: str, themes: List[str]) -> List[str]:
        """
        Generate follow-up questions based on emotion and themes
        
        Args:
            emotion: Primary detected emotion
            themes: Behavioral themes detected
        
        Returns:
            List of follow-up questions
        """
        questions = []
        
        # Emotion-based questions
        emotion_questions = {
            "anger": "What do you think would help you feel calmer?",
            "fear": "What would make you feel safer or more secure?",
            "sadness": "Is there something specific that triggered these feelings?",
            "joy": "What else has been contributing to your positive mood?",
        }
        
        if emotion.lower() in emotion_questions:
            questions.append(emotion_questions[emotion.lower()])
        
        # Theme-based questions
        theme_questions = {
            "work_stress": "How is your work-life balance?",
            "relationship": "How are you communicating with your partner?",
            "sleep": "How many hours of sleep are you getting?",
            "anxiety": "Have you tried any relaxation techniques?"
        }
        
        for theme in themes:
            if theme in theme_questions:
                questions.append(theme_questions[theme])
        
        return questions[:2]  # Return max 2 questions
