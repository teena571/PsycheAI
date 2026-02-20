import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Navbar from '../components/Navbar'

const StressTracker = () => {
  const navigate = useNavigate()

  // Sample data for charts
  const weeklyData = [
    { day: 'Mon', stress: 65, mood: 70 },
    { day: 'Tue', stress: 75, mood: 60 },
    { day: 'Wed', stress: 55, mood: 75 },
    { day: 'Thu', stress: 80, mood: 55 },
    { day: 'Fri', stress: 45, mood: 85 },
    { day: 'Sat', stress: 30, mood: 90 },
    { day: 'Sun', stress: 35, mood: 88 },
  ]

  const emotionData = [
    { emotion: 'Happy', count: 45 },
    { emotion: 'Calm', count: 30 },
    { emotion: 'Stressed', count: 15 },
    { emotion: 'Sad', count: 10 },
  ]

  const currentStress = 45
  const weeklyAverage = 55
  const trend = currentStress < weeklyAverage ? 'down' : 'up'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-primary-600 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Stress Score Tracker
          </h1>
          <p className="text-gray-600">
            Monitor your stress levels and emotional patterns over time
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Current Stress</h3>
              <Activity className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-4xl font-bold text-blue-600 mb-2">{currentStress}%</div>
            <div className="flex items-center text-sm text-gray-600">
              {trend === 'down' ? (
                <>
                  <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500">Lower than average</span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-red-500">Higher than average</span>
                </>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Weekly Average</h3>
              <TrendingUp className="w-6 h-6 text-purple-500" />
            </div>
            <div className="text-4xl font-bold text-purple-600 mb-2">{weeklyAverage}%</div>
            <p className="text-sm text-gray-600">Based on 7 days</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Best Day</h3>
              <TrendingDown className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-4xl font-bold text-green-600 mb-2">Sat</div>
            <p className="text-sm text-gray-600">Lowest stress: 30%</p>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Weekly Trend Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Weekly Stress & Mood Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={2} name="Stress Level" />
                <Line type="monotone" dataKey="mood" stroke="#10b981" strokeWidth={2} name="Mood Score" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Emotion Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Emotion Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={emotionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="emotion" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8b5cf6" name="Occurrences" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Weekly Insights
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className="text-gray-700">
                Your stress levels have decreased by 15% compared to last week. Great progress!
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className="text-gray-700">
                Weekends show significantly lower stress. Consider incorporating weekend activities into weekdays.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <p className="text-gray-700">
                You've been feeling happy 45% of the time this week. Keep up the positive momentum!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default StressTracker
