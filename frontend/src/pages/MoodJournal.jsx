import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Smile, Frown, Meh, Heart } from 'lucide-react'
import Navbar from '../components/Navbar'

const MoodJournal = () => {
  const navigate = useNavigate()
  const [selectedMood, setSelectedMood] = useState('')
  const [journalEntry, setJournalEntry] = useState('')
  const [savedEntries, setSavedEntries] = useState([])

  const moods = [
    { name: 'Happy', icon: <Smile className="w-8 h-8" />, color: 'bg-yellow-400', emoji: '😊' },
    { name: 'Sad', icon: <Frown className="w-8 h-8" />, color: 'bg-blue-400', emoji: '😢' },
    { name: 'Stressed', icon: <Meh className="w-8 h-8" />, color: 'bg-red-400', emoji: '😰' },
    { name: 'Calm', icon: <Heart className="w-8 h-8" />, color: 'bg-green-400', emoji: '😌' },
  ]

  const handleSave = () => {
    if (selectedMood && journalEntry) {
      const newEntry = {
        id: Date.now(),
        mood: selectedMood,
        entry: journalEntry,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
      }
      setSavedEntries([newEntry, ...savedEntries])
      setSelectedMood('')
      setJournalEntry('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            Mood Journal
          </h1>
          <p className="text-gray-600">
            Track your daily emotions and write journal entries
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Journal Entry Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How are you feeling today?
            </h2>

            {/* Mood Selector */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {moods.map((mood) => (
                <motion.button
                  key={mood.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedMood(mood.name)}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    selectedMood === mood.name
                      ? `${mood.color} border-transparent text-white shadow-lg`
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="text-4xl mb-2">{mood.emoji}</div>
                  <div className="font-semibold">{mood.name}</div>
                </motion.button>
              ))}
            </div>

            {/* Journal Text Area */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Write your thoughts...
              </label>
              <textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="What's on your mind today?"
                rows="8"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Save Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={!selectedMood || !journalEntry}
              className="w-full py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
            >
              <Save className="w-5 h-5" />
              Save Entry
            </motion.button>
          </motion.div>

          {/* Saved Entries Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Your Journal Entries
            </h2>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {savedEntries.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p>No entries yet. Start journaling!</p>
                </div>
              ) : (
                savedEntries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-primary-600">
                        {entry.mood}
                      </span>
                      <span className="text-sm text-gray-500">
                        {entry.date} at {entry.time}
                      </span>
                    </div>
                    <p className="text-gray-700">{entry.entry}</p>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default MoodJournal
