import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import chatRoutes from './routes/chat.js'
import analyticsRoutes from './routes/analytics.js'
import { errorHandler } from './middleware/errorHandler.js'
import { rateLimiter } from './middleware/rateLimiter.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet())

// CORS configuration - allow all localhost origins in development
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(rateLimiter)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/analytics', analyticsRoutes)

// Error handling
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV}`)
})
