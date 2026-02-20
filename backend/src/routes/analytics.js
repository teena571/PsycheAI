import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()
const prisma = new PrismaClient()

router.use(authenticate)

router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.userId

    // Total sessions
    const totalSessions = await prisma.session.count({ where: { userId } })

    // Total messages
    const totalMessages = await prisma.message.count({ 
      where: { userId, role: 'user' } 
    })

    // Get emotion logs from last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const emotionLogs = await prisma.emotionLog.findMany({
      where: {
        userId,
        createdAt: { gte: sevenDaysAgo }
      },
      orderBy: { createdAt: 'asc' }
    })

    // Calculate emotion distribution
    const emotionCounts = {}
    emotionLogs.forEach(log => {
      emotionCounts[log.emotion] = (emotionCounts[log.emotion] || 0) + 1
    })

    const totalEmotions = emotionLogs.length
    const emotionDistribution = Object.entries(emotionCounts).map(([name, count]) => ({
      name,
      count,
      percentage: totalEmotions > 0 ? Math.round((count / totalEmotions) * 100) : 0
    }))

    // Dominant emotion
    const dominantEmotion = emotionDistribution.length > 0
      ? emotionDistribution.reduce((a, b) => a.count > b.count ? a : b).name
      : null

    // Emotion trend (simplified)
    const emotionTrend = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayLogs = emotionLogs.filter(log => 
        log.createdAt.toISOString().split('T')[0] === dateStr
      )
      
      emotionTrend.push({
        date: dateStr,
        positive: dayLogs.filter(l => ['happy', 'joy', 'excited'].includes(l.emotion)).length,
        negative: dayLogs.filter(l => ['sad', 'angry', 'anxious'].includes(l.emotion)).length,
        neutral: dayLogs.filter(l => ['neutral', 'calm'].includes(l.emotion)).length
      })
    }

    // Calculate streak (simplified - days with activity)
    const recentSessions = await prisma.session.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
      take: 30
    })

    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - i)
      
      const hasActivity = recentSessions.some(session => {
        const sessionDate = new Date(session.startedAt)
        sessionDate.setHours(0, 0, 0, 0)
        return sessionDate.getTime() === checkDate.getTime()
      })
      
      if (hasActivity) {
        streak++
      } else if (i > 0) {
        break
      }
    }

    res.json({
      totalSessions,
      totalMessages,
      streak,
      dominantEmotion,
      emotionDistribution,
      emotionTrend
    })
  } catch (error) {
    console.error('Analytics error:', error)
    res.status(500).json({ message: 'Failed to load analytics' })
  }
})

export default router
