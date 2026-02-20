"""
Crisis Detection Safety Filter
Detects self-harm language, severe emotional distress, and triggers emergency support
"""

import re
from typing import Dict, List, Tuple
from datetime import datetime


class CrisisDetector:
    """Detects crisis situations and provides appropriate safety responses"""
    
    def __init__(self):
        """Initialize crisis detection patterns and resources"""
        
        # Critical self-harm and suicide keywords (highest priority)
        self.critical_keywords = [
            # Direct suicide mentions
            "suicide", "suicidal", "kill myself", "end my life", "take my life",
            "want to die", "wish i was dead", "better off dead", "no reason to live",
            "end it all", "can't go on", "don't want to live", "ready to die",
            
            # Self-harm mentions
            "hurt myself", "harm myself", "self harm", "self-harm", "cut myself",
            "cutting myself", "burn myself", "overdose", "pills to die",
            
            # Method-specific
            "jump off", "hang myself", "hanging myself", "shoot myself",
            "drown myself", "poison myself"
        ]
        
        # Severe distress indicators (high priority)
        self.severe_distress_keywords = [
            # Hopelessness
            "no hope", "hopeless", "nothing matters", "give up", "can't take it",
            "unbearable", "can't cope", "breaking point", "lost all hope",
            
            # Desperation
            "desperate", "can't handle", "too much pain", "suffering too much",
            "can't breathe", "drowning", "suffocating", "trapped",
            
            # Isolation
            "nobody cares", "all alone", "no one understands", "abandoned",
            "worthless", "burden to everyone", "everyone hates me",
            
            # Crisis state
            "emergency", "crisis", "help me", "save me", "losing control",
            "going crazy", "can't think straight", "falling apart"
        ]
        
        # Self-harm behavior patterns (medium-high priority)
        self.self_harm_patterns = [
            "cutting", "burning", "hitting myself", "punishing myself",
            "starving myself", "not eating", "purging", "binging",
            "scratching", "picking", "pulling hair", "head banging"
        ]
        
        # Substance abuse crisis (medium-high priority)
        self.substance_crisis_keywords = [
            "overdose", "too many pills", "drink to die", "drunk and want to",
            "high and want to", "using to escape", "addiction crisis"
        ]
        
        # Severe mental health crisis (medium priority)
        self.mental_health_crisis = [
            "psychotic", "hearing voices", "seeing things", "hallucinating",
            "paranoid", "delusions", "manic episode", "panic attack",
            "dissociating", "out of body", "not real"
        ]
        
        # Contextual phrases that increase severity
        self.severity_amplifiers = [
            "right now", "tonight", "today", "planning to", "going to",
            "about to", "ready to", "decided to", "final decision",
            "goodbye", "last time", "won't see me again"
        ]
        
        # Crisis resources
        self.crisis_resources = {
            "us": {
                "suicide_prevention": {
                    "name": "National Suicide Prevention Lifeline",
                    "phone": "988",
                    "alternate": "1-800-273-8255",
                    "text": "Text HOME to 741741",
                    "available": "24/7"
                },
                "crisis_text": {
                    "name": "Crisis Text Line",
                    "text": "Text HELLO to 741741",
                    "available": "24/7"
                },
                "emergency": {
                    "name": "Emergency Services",
                    "phone": "911",
                    "note": "For immediate danger"
                }
            }
        }
        
        print("✅ Crisis detector initialized")
    
    def detect_crisis(self, text: str) -> Dict:
        """
        Comprehensive crisis detection analysis
        
        Args:
            text: User message text
        
        Returns:
            Dict with crisis level, indicators, and recommended actions
        """
        text_lower = text.lower()
        
        # Initialize detection results
        crisis_indicators = {
            "critical_keywords": [],
            "severe_distress": [],
            "self_harm_patterns": [],
            "substance_crisis": [],
            "mental_health_crisis": [],
            "severity_amplifiers": []
        }
        
        # Detect critical keywords
        for keyword in self.critical_keywords:
            if keyword in text_lower:
                crisis_indicators["critical_keywords"].append(keyword)
        
        # Detect severe distress
        for keyword in self.severe_distress_keywords:
            if keyword in text_lower:
                crisis_indicators["severe_distress"].append(keyword)
        
        # Detect self-harm patterns
        for pattern in self.self_harm_patterns:
            if pattern in text_lower:
                crisis_indicators["self_harm_patterns"].append(pattern)
        
        # Detect substance crisis
        for keyword in self.substance_crisis_keywords:
            if keyword in text_lower:
                crisis_indicators["substance_crisis"].append(keyword)
        
        # Detect mental health crisis
        for keyword in self.mental_health_crisis:
            if keyword in text_lower:
                crisis_indicators["mental_health_crisis"].append(keyword)
        
        # Detect severity amplifiers
        for amplifier in self.severity_amplifiers:
            if amplifier in text_lower:
                crisis_indicators["severity_amplifiers"].append(amplifier)
        
        # Calculate crisis level
        crisis_level, severity_score = self._calculate_crisis_level(crisis_indicators)
        
        # Determine if immediate intervention needed
        requires_intervention = crisis_level in ["critical", "severe"]
        
        # Get appropriate response
        crisis_response = self._generate_crisis_response(
            crisis_level,
            crisis_indicators,
            requires_intervention
        )
        
        return {
            "is_crisis": crisis_level != "none",
            "crisis_level": crisis_level,
            "severity_score": severity_score,
            "requires_intervention": requires_intervention,
            "indicators": crisis_indicators,
            "response": crisis_response,
            "resources": self._get_crisis_resources(crisis_level),
            "conversation_flag": self._create_conversation_flag(crisis_level, crisis_indicators),
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def _calculate_crisis_level(self, indicators: Dict) -> Tuple[str, float]:
        """
        Calculate crisis severity level
        
        Returns:
            Tuple of (crisis_level, severity_score)
        """
        score = 0.0
        
        # Critical keywords = highest weight
        if indicators["critical_keywords"]:
            score += len(indicators["critical_keywords"]) * 10.0
        
        # Severe distress = high weight
        if indicators["severe_distress"]:
            score += len(indicators["severe_distress"]) * 5.0
        
        # Self-harm patterns = high weight
        if indicators["self_harm_patterns"]:
            score += len(indicators["self_harm_patterns"]) * 7.0
        
        # Substance crisis = high weight
        if indicators["substance_crisis"]:
            score += len(indicators["substance_crisis"]) * 8.0
        
        # Mental health crisis = medium weight
        if indicators["mental_health_crisis"]:
            score += len(indicators["mental_health_crisis"]) * 4.0
        
        # Severity amplifiers = multiplier
        if indicators["severity_amplifiers"]:
            score *= (1 + len(indicators["severity_amplifiers"]) * 0.2)
        
        # Normalize score to 0-1 range
        severity_score = min(score / 50.0, 1.0)
        
        # Determine crisis level
        if score >= 10.0 or indicators["critical_keywords"]:
            crisis_level = "critical"
        elif score >= 5.0 or indicators["substance_crisis"]:
            crisis_level = "severe"
        elif score >= 2.0:
            crisis_level = "moderate"
        elif score > 0:
            crisis_level = "mild"
        else:
            crisis_level = "none"
        
        return crisis_level, round(severity_score, 3)
    
    def _generate_crisis_response(
        self,
        crisis_level: str,
        indicators: Dict,
        requires_intervention: bool
    ) -> str:
        """Generate appropriate crisis response message"""
        
        if crisis_level == "critical":
            return self._get_critical_response(indicators)
        elif crisis_level == "severe":
            return self._get_severe_response(indicators)
        elif crisis_level == "moderate":
            return self._get_moderate_response(indicators)
        elif crisis_level == "mild":
            return self._get_mild_response(indicators)
        else:
            return ""
    
    def _get_critical_response(self, indicators: Dict) -> str:
        """Response for critical crisis situations"""
        response = (
            "🚨 I'm deeply concerned about your safety right now. "
            "What you're experiencing sounds extremely difficult, and I want you to know that help is available immediately.\n\n"
        )
        
        # Add specific concern based on indicators
        if indicators["critical_keywords"]:
            response += (
                "Your life matters, and there are people who want to help you through this. "
                "Please reach out to someone who can provide immediate support:\n\n"
            )
        
        # Add resources
        response += (
            "📞 **IMMEDIATE HELP:**\n"
            "• Call 988 (Suicide & Crisis Lifeline) - Available 24/7\n"
            "• Call 1-800-273-8255 (Alternative number)\n"
            "• Text HOME to 741741 (Crisis Text Line)\n"
            "• Call 911 if you're in immediate danger\n\n"
            "These services are free, confidential, and staffed by trained counselors who care. "
            "You don't have to face this alone. Please reach out right now."
        )
        
        return response
    
    def _get_severe_response(self, indicators: Dict) -> str:
        """Response for severe distress situations"""
        response = (
            "⚠️ I can sense you're going through an extremely difficult time right now. "
            "Your safety and wellbeing are the top priority.\n\n"
        )
        
        if indicators["substance_crisis"]:
            response += (
                "If you're experiencing a substance-related crisis, please seek immediate help:\n\n"
            )
        elif indicators["self_harm_patterns"]:
            response += (
                "If you're thinking about harming yourself, please reach out for support:\n\n"
            )
        
        response += (
            "📞 **CRISIS SUPPORT:**\n"
            "• 988 - Suicide & Crisis Lifeline (24/7)\n"
            "• Text HELLO to 741741 - Crisis Text Line\n"
            "• 911 - Emergency services\n\n"
            "You deserve support and care. These trained professionals can help you through this crisis."
        )
        
        return response
    
    def _get_moderate_response(self, indicators: Dict) -> str:
        """Response for moderate distress situations"""
        response = (
            "I hear that you're struggling, and I want you to know that support is available. "
            "What you're feeling is valid, and reaching out for help is a sign of strength.\n\n"
        )
        
        response += (
            "📞 **SUPPORT RESOURCES:**\n"
            "• 988 - Suicide & Crisis Lifeline\n"
            "• Text HOME to 741741 - Crisis Text Line\n"
            "• SAMHSA Helpline: 1-800-662-4357 (Mental health & substance use)\n\n"
            "Would you like to talk about what you're experiencing? I'm here to listen."
        )
        
        return response
    
    def _get_mild_response(self, indicators: Dict) -> str:
        """Response for mild distress situations"""
        response = (
            "I notice you might be going through a difficult time. "
            "It's important to know that support is available if you need it.\n\n"
            "If things feel overwhelming, consider reaching out to:\n"
            "• 988 - Suicide & Crisis Lifeline\n"
            "• Text HOME to 741741 - Crisis Text Line\n\n"
            "How can I support you right now?"
        )
        
        return response
    
    def _get_crisis_resources(self, crisis_level: str) -> Dict:
        """Get appropriate crisis resources based on level"""
        if crisis_level in ["critical", "severe"]:
            return self.crisis_resources["us"]
        elif crisis_level == "moderate":
            return {
                "suicide_prevention": self.crisis_resources["us"]["suicide_prevention"],
                "crisis_text": self.crisis_resources["us"]["crisis_text"]
            }
        else:
            return {}
    
    def _create_conversation_flag(self, crisis_level: str, indicators: Dict) -> Dict:
        """Create a flag for conversation monitoring"""
        return {
            "flagged": crisis_level in ["critical", "severe", "moderate"],
            "level": crisis_level,
            "reason": self._get_flag_reason(indicators),
            "requires_review": crisis_level in ["critical", "severe"],
            "requires_followup": crisis_level in ["critical", "severe", "moderate"],
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def _get_flag_reason(self, indicators: Dict) -> str:
        """Generate human-readable flag reason"""
        reasons = []
        
        if indicators["critical_keywords"]:
            reasons.append("suicide/self-harm language")
        if indicators["severe_distress"]:
            reasons.append("severe emotional distress")
        if indicators["self_harm_patterns"]:
            reasons.append("self-harm behavior")
        if indicators["substance_crisis"]:
            reasons.append("substance crisis")
        if indicators["mental_health_crisis"]:
            reasons.append("mental health crisis")
        
        return ", ".join(reasons) if reasons else "distress indicators"
    
    def check_conversation_safety(self, messages: List[str]) -> Dict:
        """
        Analyze multiple messages for escalating crisis patterns
        
        Args:
            messages: List of recent user messages
        
        Returns:
            Dict with conversation-level crisis assessment
        """
        crisis_scores = []
        all_indicators = []
        
        for message in messages:
            result = self.detect_crisis(message)
            if result["is_crisis"]:
                crisis_scores.append(result["severity_score"])
                all_indicators.append(result["indicators"])
        
        # Check for escalation
        is_escalating = False
        if len(crisis_scores) >= 2:
            is_escalating = crisis_scores[-1] > crisis_scores[0]
        
        # Calculate overall conversation risk
        avg_score = sum(crisis_scores) / len(crisis_scores) if crisis_scores else 0.0
        max_score = max(crisis_scores) if crisis_scores else 0.0
        
        return {
            "conversation_at_risk": max_score > 0.5,
            "is_escalating": is_escalating,
            "average_severity": round(avg_score, 3),
            "max_severity": round(max_score, 3),
            "crisis_message_count": len(crisis_scores),
            "requires_intervention": max_score > 0.7,
            "timestamp": datetime.utcnow().isoformat()
        }
