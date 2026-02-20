import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react'
import Navbar from '../components/Navbar'

const BreathingTool = () => {
  const navigate = useNavigate()
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState('inhale') // inhale, hold, exhale
  const [timer, setTimer] = useState(0)
  const [totalTime, setTotalTime] = useState(0)

  const phases = {
    inhale: { duration: 4, text: 'Breathe In', color: 'from-blue-400 to-cyan-400' },
    hold: { duration: 4, text: 'Hold', color: 'from-purple-400 to-pink-400' },
    exhale: { duration: 4, text: 'Breathe Out', color: 'from-green-400 to-emerald-400' },
  }

  useEffect(() => {
    let interval
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev >= phases[phase].duration) {
            // Move to next phase
            if (phase === 'inhale') setPhase('hold')
            else if (phase === 'hold') setPhase('exhale')
            else setPhase('inhale')
            return 0
          }
          return prev + 1
        })
        setTotalTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isActive, phase, timer])

  const handleStart = () => {
    setIsActive(true)
  }

  const handlePause = () => {
    setIsActive(false)
  }

  const handleReset = () => {
    setIsActive(false)
    setPhase('inhale')
    setTimer(0)
    setTotalTime(0)
  }

  const circleScale = {
    inhale: 1.5,
    hold: 1.5,
    exhale: 0.8,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            Guided Breathing Tool
          </h1>
          <p className="text-gray-600">
            Follow the breathing animation to reduce stress and anxiety
          </p>
        </motion.div>

        {/* Breathing Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl p-12 mb-8"
        >
          <div className="flex flex-col items-center justify-center">
            {/* Animated Circle */}
            <div className="relative w-80 h-80 flex items-center justify-center mb-8">
              <motion.div
                animate={{
                  scale: isActive ? circleScale[phase] : 1,
                }}
                transition={{
                  duration: phases[phase].duration,
                  ease: 'easeInOut',
                }}
                className={`absolute w-64 h-64 rounded-full bg-gradient-to-br ${phases[phase].color} opacity-30 blur-xl`}
              />
              
              <motion.div
                animate={{
                  scale: isActive ? circleScale[phase] : 1,
                }}
                transition={{
                  duration: phases[phase].duration,
                  ease: 'easeInOut',
                }}
                className={`absolute w-48 h-48 rounded-full bg-gradient-to-br ${phases[phase].color} shadow-2xl`}
              />

              {/* Phase Text */}
              <div className="absolute text-center">
                <motion.p
                  key={phase}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold text-white mb-2"
                >
                  {phases[phase].text}
                </motion.p>
                <motion.p
                  className="text-6xl font-bold text-white"
                >
                  {phases[phase].duration - timer}
                </motion.p>
              </div>
            </div>

            {/* Instructions */}
            <AnimatePresence mode="wait">
              <motion.div
                key={phase}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center mb-8"
              >
                <p className="text-xl text-gray-600">
                  {phase === 'inhale' && 'Slowly breathe in through your nose...'}
                  {phase === 'hold' && 'Hold your breath gently...'}
                  {phase === 'exhale' && 'Slowly breathe out through your mouth...'}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="flex gap-4">
              {!isActive ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStart}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <Play className="w-5 h-5" />
                  Start
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePause}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <Pause className="w-5 h-5" />
                  Pause
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="px-8 py-4 bg-gray-200 text-gray-700 rounded-full font-semibold flex items-center gap-2 hover:bg-gray-300 transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </motion.button>
            </div>

            {/* Timer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 mb-1">Total Time</p>
              <p className="text-2xl font-bold text-gray-700">
                {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Benefits of Breathing Exercises
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className="text-gray-700">Reduces stress and anxiety</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className="text-gray-700">Improves focus and concentration</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <p className="text-gray-700">Lowers blood pressure</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
              <p className="text-gray-700">Promotes better sleep</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default BreathingTool
