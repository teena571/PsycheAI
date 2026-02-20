import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Heart, 
  Smile, 
  Frown, 
  Meh,
  MessageCircle,
  Calendar,
  Brain,
  Activity,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Target,
  Award,
  Zap
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'
import api from '../lib/api'
import { useAuthStore } from '../store/authStore'

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')
  const { user } = useAuthStore()

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/analytics/dashboard?range=${timeRange}`)
      setAnalytics(response.data)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  const emotionColors = {
    happy: '#10b981',
    sad: '#3b82f6',
    anxious: '#f59e0b',
    angry: '#ef4444',
    neutral: '#6b7280',
    fearful: '#8b5cf6'
  }

  const copingSuggestions = [
    {
      emotion: 'anxious',
      icon: <Activity className="w-6 h-6" />,
      title: 'Deep Breathing',
      description: 'Try the 4-7-8 breathing technique: inhale for 4, hold for 7, exhale for 8',
      color: 'orange'
    },
    {
      emotion: 'sad',
      icon: <Heart className="w-6 h-6" />,
      title: 'Connect with Others',
      description: 'Reach out to a friend or loved one. Social connection can lift your mood',
      color: 'blue'
    },
    {
      emotion: 'stressed',
      icon: <Zap className="w-6 h-6" />,
      title: 'Physical Activity',
      description: 'A 10-minute walk or light exercise can reduce stress hormones',
      color: 'purple'
    },
    {
      emotion: 'overwhelmed',
      icon: <Target className="w-6 h-6" />,
      title: 'Break It Down',
      description: 'Divide large tasks into smaller, manageable steps',
      color: 'green'
    }
  ]

  const behavioralInsights = [
    {
      title: 'Peak Activity Time',
      value: analytics?.peakActivityTime || 'Evening',
      icon: <Calendar className="w-5 h-5" />,
      description: 'You tend to engage most during this time',
      trend: 'stable'
    },
    {
      title: 'Average Session Length',
      value: `${analytics?.avgSessionLength || 15} min`,
      icon: <MessageCircle className="w-5 h-5" />,
      description: 'Your typical conversation duration',
      trend: 'up'
    },
    {
      title: 'Emotional Awareness',
      value: `${analytics?.emotionalAwareness || 75}%`,
      icon: <Brain className="w-5 h-5" />,
      description: 'Your ability to identify emotions',
      trend: 'up'
    },
    {
      title: 'Consistency Score',
      value: `${analytics?.consistencyScore || 85}%`,
      icon: <Award className="w-5 h-5" />,
      description: 'Regular engagement with wellness',
      trend: 'up'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋
              </h1>
              <p className="text-gray-600">Here's your emotional wellness overview</p>
            </div>
            
            {/* Time Range Selector */}
            <div className="mt-4 sm:mt-0 flex space-x-2">
              {['7d', '30d', '90d'].map((range) => (
                <motion.button
                  key={range}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    timeRange === range
                      ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: 'Total Sessions',
              value: analytics?.totalSessions || 0,
              icon: <MessageCircle className="w-8 h-8" />,
              color: 'from-blue-500 to-cyan-500',
              change: '+12%'
            },
            {
              label: 'Messages Sent',
              value: analytics?.totalMessages || 0,
              icon: <Heart className="w-8 h-8" />,
              color: 'from-pink-500 to-rose-500',
              change: '+8%'
            },
            {
              label: 'Current Streak',
              value: `${analytics?.streak || 0} days`,
              icon: <TrendingUp className="w-8 h-8" />,
              color: 'from-green-500 to-emerald-500',
              change: 'Active'
            },
            {
              label: 'Dominant Emotion',
              value: analytics?.dominantEmotion || 'Neutral',
              icon: <Smile className="w-8 h-8" />,
              color: 'from-purple-500 to-indigo-500',
              change: 'This week'
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl`} />
              <div className="relative">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white mb-4`}>
                  {stat.icon}
                </div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2 capitalize">{stat.value}</p>
                <span className="text-xs text-green-600 font-medium">{stat.change}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Emotion Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Emotional Trend</h2>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-gray-600">Positive</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="text-gray-600">Negative</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full" />
                  <span className="text-gray-600">Neutral</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics?.emotionTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Line type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="neutral" stroke="#6b7280" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Emotion Distribution Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Emotion Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={analytics?.emotionDistribution || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="percentage"
                >
                  {(analytics?.emotionDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={emotionColors[entry.name] || '#6b7280'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {(analytics?.emotionDistribution || []).slice(0, 3).map((emotion, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: emotionColors[emotion.name] }}
                    />
                    <span className="text-gray-700 capitalize">{emotion.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{emotion.percentage}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Behavioral Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Brain className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">Behavioral Insights</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {behavioralInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="relative p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
                    {insight.icon}
                  </div>
                  {insight.trend === 'up' && (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{insight.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mb-2">{insight.value}</p>
                <p className="text-xs text-gray-500">{insight.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Coping Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-6 shadow-lg border border-primary-100"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Lightbulb className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">Personalized Coping Strategies</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {copingSuggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                className="bg-white rounded-xl p-5 border border-gray-200 cursor-pointer"
              >
                <div className={`inline-flex p-3 rounded-lg bg-${suggestion.color}-100 text-${suggestion.color}-600 mb-3`}>
                  {suggestion.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{suggestion.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{suggestion.description}</p>
                <button className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center space-x-1">
                  <span>Try this</span>
                  <CheckCircle className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Wellness Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center space-x-2 mb-4">
            <AlertCircle className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Daily Wellness Tip</h2>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
            <p className="text-gray-700 leading-relaxed mb-4">
              "Remember, it's okay to not be okay. Your emotions are valid, and seeking support is a sign of strength, not weakness. 
              Take things one day at a time, and celebrate small victories along the way."
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">💙 From your PsycheAI team</span>
              <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
                Share this tip
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
