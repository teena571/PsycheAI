import express from 'express'
import axios from 'axios'
import { PrismaClient } from '@prisma/client'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()
const prisma = new PrismaClient()

router.use(authenticate)

router.post('/message', async (req, res) => {
  try {
    const { message } = req.body
    const userId = req.userId

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' })
    }

    // Get or create active session
    let session = await prisma.session.findFirst({
      where: { userId, endedAt: null },
      orderBy: { startedAt: 'desc' }
    })

    if (!session) {
      session = await prisma.session.create({
        data: { userId }
      })
    }

    // Save user message
    await prisma.message.create({
      data: {
        sessionId: session.id,
        userId,
        role: 'user',
        content: message
      }
    })

    // Call AI service for comprehensive emotional analysis
    let emotion = null
    let sentiment = null
    let stressScore = null
    let crisisDetection = null
    let aiResponse = 'I understand. How can I support you today?'

    try {
      const aiServiceResponse = await axios.post(
        `${process.env.AI_SERVICE_URL}/analyze`,
        { text: message },
        { timeout: 10000 }
      )
      
      const analysis = aiServiceResponse.data
      emotion = analysis.emotion
      sentiment = analysis.sentiment
      stressScore = analysis.stress_score
      crisisDetection = analysis.crisis_detection
      aiResponse = analysis.suggested_response || aiResponse
      
      // Log crisis detection if present
      if (crisisDetection && crisisDetection.is_crisis) {
        console.log(`⚠️  CRISIS DETECTED - Level: ${crisisDetection.crisis_level}, User: ${userId}`)
        console.log(`   Severity: ${crisisDetection.severity_score}, Intervention: ${crisisDetection.requires_intervention}`)
        
        // Flag session if crisis requires intervention
        if (crisisDetection.requires_intervention) {
          await prisma.session.update({
            where: { id: session.id },
            data: { 
              // Add crisis flag to session metadata (if you have a JSON field)
              // For now, we'll log it
            }
          })
        }
      }
      
    } catch (aiError) {
      console.error('AI service error:', aiError.message)
      // Fallback to default response if AI service fails
    }

    // Save AI response with emotion data
    await prisma.message.create({
      data: {
        sessionId: session.id,
        userId,
        role: 'assistant',
        content: aiResponse,
        emotion,
        sentiment
      }
    })

    // Log emotion with intensity (stress score) if detected
    if (emotion) {
      await prisma.emotionLog.create({
        data: {
          userId,
          emotion,
          intensity: stressScore || 0.5,
          context: message.substring(0, 200)
        }
      })
    }

    // Return response with crisis information
    res.json({ 
      response: aiResponse, 
      emotion,
      crisis: crisisDetection ? {
        is_crisis: crisisDetection.is_crisis,
        level: crisisDetection.crisis_level,
        requires_intervention: crisisDetection.requires_intervention
      } : null
    })
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ message: 'Failed to process message' })
  }
})

router.get('/history', async (req, res) => {
  try {
    const userId = req.userId
    const limit = parseInt(req.query.limit) || 50

    const messages = await prisma.message.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      take: limit,
      select: {
        id: true,
        role: true,
        content: true,
        emotion: true,
        createdAt: true
      }
    })

    res.json({ messages })
  } catch (error) {
    console.error('History error:', error)
    res.status(500).json({ message: 'Failed to load chat history' })
  }
})

router.delete('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params
    const userId = req.userId

    const session = await prisma.session.findFirst({
      where: { id: sessionId, userId }
    })

    if (!session) {
      return res.status(404).json({ message: 'Session not found' })
    }

    await prisma.session.update({
      where: { id: sessionId },
      data: { endedAt: new Date() }
    })

    res.json({ message: 'Session ended successfully' })
  } catch (error) {
    console.error('Delete session error:', error)
    res.status(500).json({ message: 'Failed to end session' })
  }
})

export default router
