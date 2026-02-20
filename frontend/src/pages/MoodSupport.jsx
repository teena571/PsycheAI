import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, Apple, Coffee, Salad, Pizza } from 'lucide-react'
import Navbar from '../components/Navbar'

const MoodSupport = () => {
  const navigate = useNavigate()
  const [selectedMood, setSelectedMood] = useState('')

  const moods = [
    { name: 'Happy', emoji: '😊', color: 'from-yellow-400 to-orange-400' },
    { name: 'Sad', emoji: '😢', color: 'from-blue-400 to-indigo-400' },
    { name: 'Stressed', emoji: '😰', color: 'from-red-400 to-pink-400' },
    { name: 'Calm', emoji: '😌', color: 'from-green-400 to-emerald-400' },
  ]

  const moodContent = {
    Happy: {
      motivation: [
        "You're radiating positive energy today! Keep spreading that joy!",
        "Your happiness is contagious. Share it with the world!",
        "This is your moment to shine. Embrace the good vibes!",
      ],
      foods: [
        { name: 'Dark Chocolate', icon: <Coffee className="w-6 h-6" />, benefit: 'Boosts endorphins and mood' },
        { name: 'Berries', icon: <Apple className="w-6 h-6" />, benefit: 'Rich in antioxidants' },
        { name: 'Nuts', icon: <Salad className="w-6 h-6" />, benefit: 'Healthy fats for brain health' },
      ],
    },
    Sad: {
      motivation: [
        "It's okay to feel sad. This too shall pass. You're stronger than you think.",
        "Every storm runs out of rain. Brighter days are ahead.",
        "Be gentle with yourself. Healing takes time, and that's perfectly okay.",
      ],
      foods: [
        { name: 'Salmon', icon: <Pizza className="w-6 h-6" />, benefit: 'Omega-3 for mood regulation' },
        { name: 'Bananas', icon: <Apple className="w-6 h-6" />, benefit: 'Natural mood lifter' },
        { name: 'Oatmeal', icon: <Coffee className="w-6 h-6" />, benefit: 'Stabilizes blood sugar' },
      ],
    },
    Stressed: {
      motivation: [
        "Take a deep breath. You've got this! One step at a time.",
        "Stress is temporary, but your strength is permanent.",
        "Remember: You've overcome 100% of your worst days so far.",
      ],
      foods: [
        { name: 'Green Tea', icon: <Coffee className="w-6 h-6" />, benefit: 'L-theanine reduces stress' },
        { name: 'Avocado', icon: <Salad className="w-6 h-6" />, benefit: 'B vitamins for stress relief' },
        { name: 'Yogurt', icon: <Apple className="w-6 h-6" />, benefit: 'Probiotics for gut-brain health' },
      ],
    },
    Calm: {
      motivation: [
        "Your inner peace is beautiful. Maintain this tranquility.",
        "You've found your center. This is where growth happens.",
        "Calmness is a superpower. You're mastering it beautifully.",
      ],
      foods: [
        { name: 'Chamomile Tea', icon: <Coffee className="w-6 h-6" />, benefit: 'Promotes relaxation' },
        { name: 'Almonds', icon: <Salad className="w-6 h-6" />, benefit: 'Magnesium for calmness' },
        { name: 'Spinach', icon: <Apple className="w-6 h-6" />, benefit: 'Nutrients for mental clarity' },
      ],
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            Mood Support & Diet
          </h1>
          <p className="text-gray-600">
            Get personalized motivation and food suggestions based on your mood
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary-600" />
            How are you feeling right now?
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {moods.map((mood) => (
              <motion.button
                key={mood.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMood(mood.name)}
                className={`p-6 rounded-xl border-2 transition-all ${
                  selectedMood === mood.name
                    ? `bg-gradient-to-br ${mood.color} border-transparent text-white shadow-lg`
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="text-5xl mb-2">{mood.emoji}</div>
                <div className="font-semibold text-lg">{mood.name}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {selectedMood && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Motivation for You
              </h3>
              <div className="space-y-4">
                {moodContent[selectedMood].motivation.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl"
                  >
                    <Sparkles className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-700 text-lg">{message}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Apple className="w-6 h-6 text-green-600" />
                Recommended Foods
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {moodContent[selectedMood].foods.map((food, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-lg transition-all"
                  >
                    <div className="text-primary-600 mb-3">
                      {food.icon}
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2 text-lg">
                      {food.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {food.benefit}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Quick Tips
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                  <p className="text-gray-700">Stay hydrated - drink at least 8 glasses of water daily</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                  <p className="text-gray-700">Eat regular meals to maintain stable energy levels</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                  <p className="text-gray-700">Combine good nutrition with regular exercise for best results</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {!selectedMood && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-400">
              Select your mood to get personalized support
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default MoodSupport
