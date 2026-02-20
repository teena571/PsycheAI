import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Brain, 
  Shield, 
  TrendingUp, 
  Heart, 
  Sparkles, 
  Lock,
  BookOpen,
  Activity,
  Wind,
  Apple
} from 'lucide-react'

const FeaturesSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const navigate = useNavigate()

  const features = [
    {
      icon: <Brain className="w-12 h-12" />,
      title: 'AI-Powered Analysis',
      description: 'Advanced emotional intelligence to understand and support your mental wellness journey with personalized insights.',
      color: 'from-blue-500 to-cyan-500',
      delay: 0.1,
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: 'Privacy First',
      description: 'Your conversations are encrypted and secure. We never share your personal data with third parties.',
      color: 'from-green-500 to-emerald-500',
      delay: 0.2,
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: 'Track Progress',
      description: 'Visualize your emotional patterns and growth over time with insightful analytics and trend reports.',
      color: 'from-purple-500 to-pink-500',
      delay: 0.3,
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: '24/7 Support',
      description: 'Always available when you need someone to talk to, day or night. No appointments necessary.',
      color: 'from-red-500 to-orange-500',
      delay: 0.4,
    },
    {
      icon: <Sparkles className="w-12 h-12" />,
      title: 'Personalized Care',
      description: 'Tailored responses based on your unique emotional needs and conversation history.',
      color: 'from-yellow-500 to-amber-500',
      delay: 0.5,
    },
    {
      icon: <Lock className="w-12 h-12" />,
      title: 'Confidential',
      description: 'Complete anonymity and confidentiality in every conversation. Your privacy is our priority.',
      color: 'from-indigo-500 to-blue-500',
      delay: 0.6,
    },
  ]

  const additionalFeatures = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Mood Journal',
      description: 'Track your daily emotions and write journal entries',
      route: '/mood-journal',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: 'Stress Score Tracker',
      description: 'Display stress score dashboard with weekly analytics',
      route: '/stress-tracker',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Wind className="w-8 h-8" />,
      title: 'Guided Breathing Tool',
      description: 'Interactive breathing animation with timer',
      route: '/breathing-tool',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: <Apple className="w-8 h-8" />,
      title: 'Mood Support & Diet',
      description: 'Personalized motivation and food suggestions',
      route: '/mood-support',
      color: 'from-orange-500 to-red-500',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section id="features" ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-semibold">
              Why Choose psycheAI
            </span>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Cutting-Edge Technology Meets{' '}
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Compassionate Care
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of emotional wellness with our AI-powered platform
            designed to support your mental health journey.
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ 
                y: -10, 
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                transition: { duration: 0.3 }
              }}
              className="group relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:border-transparent transition-all duration-300 overflow-hidden"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              {/* Icon */}
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-6 shadow-lg`}
              >
                {feature.icon}
              </motion.div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Decorative Element */}
              <div className={`absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500 transform translate-x-16 translate-y-16`} />
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-3xl p-8 sm:p-12"
        >
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-10">
            And Much More...
          </h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => navigate(feature.route)}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className={`text-primary-600 mb-3 group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                  {feature.icon}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors relative z-10">
                  {feature.title}
                </h4>
                <p className="text-sm text-gray-600 relative z-10">
                  {feature.description}
                </p>
                
                {/* Arrow indicator */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Explore All Features
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturesSection
