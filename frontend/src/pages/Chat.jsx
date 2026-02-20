import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Loader2, 
  Brain, 
  User, 
  Trash2, 
  Download,
  Smile,
  Frown,
  Meh,
  Heart,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../lib/api'
import { useAuthStore } from '../store/authStore'

const Chat = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(true)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const { user } = useAuthStore()

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory()
  }, [])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const loadChatHistory = async () => {
    setHistoryLoading(true)
    try {
      const response = await api.get('/chat/history')
      setMessages(response.data.messages || [])
    } catch (error) {
      console.error('Failed to load chat history:', error)
      toast.error('Failed to load chat history')
    } finally {
      setHistoryLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = { 
      role: 'user', 
      content: input.trim(), 
      timestamp: new Date().toISOString(),
      id: Date.now()
    }
    
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setIsTyping(true)

    try {
      const response = await api.post('/chat/message', { message: userMessage.content })
      
      // Simulate typing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const aiMessage = {
        role: 'assistant',
        content: response.data.response,
        emotion: response.data.emotion,
        timestamp: new Date().toISOString(),
        id: Date.now() + 1
      }
      
      setIsTyping(false)
      setMessages((prev) => [...prev, aiMessage])
      
    } catch (error) {
      setIsTyping(false)
      toast.error('Failed to send message. Please try again.')
      console.error(error)
      
      // Remove the user message if API call failed
      setMessages((prev) => prev.filter(msg => msg.id !== userMessage.id))
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear all messages?')) {
      setMessages([])
      toast.success('Chat cleared')
    }
  }

  const exportChat = () => {
    const chatText = messages.map(msg => 
      `[${new Date(msg.timestamp).toLocaleString()}] ${msg.role === 'user' ? 'You' : 'PsycheAI'}: ${msg.content}`
    ).join('\n\n')
    
    const blob = new Blob([chatText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `psycheai-chat-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Chat exported')
  }

  const getEmotionIcon = (emotion) => {
    const icons = {
      happy: <Smile className="w-4 h-4 text-green-500" />,
      sad: <Frown className="w-4 h-4 text-blue-500" />,
      neutral: <Meh className="w-4 h-4 text-gray-500" />,
      anxious: <AlertCircle className="w-4 h-4 text-orange-500" />,
      angry: <AlertCircle className="w-4 h-4 text-red-500" />,
      fearful: <AlertCircle className="w-4 h-4 text-purple-500" />
    }
    return icons[emotion?.toLowerCase()] || <Heart className="w-4 h-4 text-pink-500" />
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b shadow-sm"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center"
              >
                <Brain className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Chat with PsycheAI</h1>
                <p className="text-sm text-gray-600">Your safe space for emotional support</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportChat}
                disabled={messages.length === 0}
                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Export chat"
              >
                <Download className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearChat}
                disabled={messages.length === 0}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Clear chat"
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {historyLoading ? (
            <div className="flex items-center justify-center h-full">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="w-8 h-8 text-primary-600" />
              </motion.div>
            </div>
          ) : messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center px-4"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mb-6">
                <Brain className="w-10 h-10 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Your Conversation</h2>
              <p className="text-gray-600 max-w-md mb-6">
                Share what's on your mind. I'm here to listen and support you through your emotional journey.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {[
                  "I'm feeling overwhelmed today",
                  "I need someone to talk to",
                  "Help me understand my emotions",
                  "I'm struggling with anxiety"
                ].map((suggestion, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setInput(suggestion)}
                    className="px-4 py-3 bg-white border-2 border-gray-200 hover:border-primary-300 rounded-lg text-sm text-gray-700 hover:text-primary-600 transition-all"
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id || index}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-3 max-w-[85%] sm:max-w-[75%] ${
                      message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      {/* Avatar */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-primary-500 to-primary-600'
                            : 'bg-gradient-to-br from-secondary-500 to-secondary-600'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <User className="w-5 h-5 text-white" />
                        ) : (
                          <Brain className="w-5 h-5 text-white" />
                        )}
                      </motion.div>

                      {/* Message Bubble */}
                      <div className="flex-1">
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            message.role === 'user'
                              ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white'
                              : 'bg-white text-gray-900 shadow-md border border-gray-100'
                          }`}
                        >
                          <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                          
                          {/* Emotion Badge */}
                          {message.emotion && message.role === 'assistant' && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              className="mt-3 pt-3 border-t border-gray-200 flex items-center space-x-2"
                            >
                              {getEmotionIcon(message.emotion)}
                              <span className="text-xs text-gray-600">
                                Detected emotion: <span className="font-semibold capitalize">{message.emotion}</span>
                              </span>
                            </motion.div>
                          )}
                        </div>
                        
                        {/* Timestamp */}
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className={`text-xs text-gray-500 mt-1 ${
                            message.role === 'user' ? 'text-right' : 'text-left'
                          }`}
                        >
                          {formatTimestamp(message.timestamp)}
                        </motion.p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-3 max-w-[75%]">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-white rounded-2xl px-6 py-4 shadow-md border border-gray-100">
                      <div className="flex space-x-2">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{
                              y: [0, -10, 0],
                            }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-t shadow-lg"
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
                placeholder="Share what's on your mind... (Press Enter to send, Shift+Enter for new line)"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none bg-gray-50 focus:bg-white"
                rows="1"
                style={{ minHeight: '48px', maxHeight: '120px' }}
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1 px-1">
                {input.length}/2000 characters
              </p>
            </div>
            
            <motion.button
              type="submit"
              disabled={loading || !input.trim() || input.length > 2000}
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all ${
                loading || !input.trim() || input.length > 2000
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:shadow-lg'
              }`}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader2 className="w-5 h-5" />
                  </motion.div>
                  <span className="hidden sm:inline">Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span className="hidden sm:inline">Send</span>
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default Chat
