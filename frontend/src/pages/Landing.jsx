import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import FeaturesSection from '../components/FeaturesSection'
import { Link } from 'react-router-dom'
import { Brain, Mail, Github, Twitter, Linkedin } from 'lucide-react'

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to Begin Your Wellness Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join thousands who have found support and growth with psycheAI.
              Start your free session today and experience the difference.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/register"
                className="inline-block px-10 py-4 bg-white text-primary-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl"
              >
                Get Started Free
              </Link>
            </motion.div>

            <p className="mt-6 text-white/80 text-sm">
              No credit card required • Free forever • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              About psycheAI
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to make mental wellness support accessible to everyone.
              Our AI-powered platform combines cutting-edge technology with compassionate
              care to provide you with the emotional support you deserve.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Our Mission',
                description: 'To democratize access to emotional wellness support through innovative AI technology.',
              },
              {
                title: 'Our Vision',
                description: 'A world where everyone has access to compassionate mental health support, anytime, anywhere.',
              },
              {
                title: 'Our Values',
                description: 'Privacy, empathy, innovation, and accessibility guide everything we do.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-8 h-8 text-primary-400" />
                <span className="text-2xl font-bold">psycheAI</span>
              </div>
              <p className="text-gray-400 mb-4 leading-relaxed">
                AI-powered emotional counseling for a healthier, happier you.
                Available 24/7 to support your mental wellness journey.
              </p>
              <div className="flex space-x-4">
                <motion.a
                  whileHover={{ scale: 1.2, color: '#3b82f6' }}
                  href="#"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.2, color: '#3b82f6' }}
                  href="#"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.2, color: '#3b82f6' }}
                  href="#"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.2, color: '#3b82f6' }}
                  href="#"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </motion.a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {['Home', 'Features', 'About', 'Chat', 'Dashboard'].map((link) => (
                  <li key={link}>
                    <Link
                      to={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Disclaimer'].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; 2024 psycheAI. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm">
              Made with <span className="text-red-500">❤</span> for mental wellness
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
