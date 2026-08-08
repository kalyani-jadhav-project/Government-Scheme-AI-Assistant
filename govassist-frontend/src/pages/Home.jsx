import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const features = [
  { icon: '🎯', title: 'Smart Eligibility Check', desc: 'Our rule engine checks 20+ government schemes instantly against your profile.' },
  { icon: '🤖', title: 'AI-Powered Explanations', desc: 'Gemini AI explains your eligibility in simple language and guides application.' },
  { icon: '📊', title: 'Eligibility Score', desc: 'See your match percentage for every scheme with detailed breakdown.' },
  { icon: '📄', title: 'Document Tracker', desc: 'Know exactly which documents you need and unlock more schemes.' },
  { icon: '💬', title: 'AI Chatbot', desc: 'Ask anything about government schemes in plain language, 24/7.' },
  { icon: '🔗', title: 'Direct Apply Links', desc: 'One-click access to official government portals to apply.' },
]

const stats = [
  { label: 'Schemes Covered', value: '20+' },
  { label: 'Categories', value: '8' },
  { label: 'AI-Powered', value: '100%' },
  { label: 'States Covered', value: 'All India' },
]

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          {/* Indian Flag Colors Strip */}
          <div className="flex justify-center mb-8">
            <div className="flex rounded-full overflow-hidden h-1.5 w-32">
              <div className="flex-1 bg-orange-500" />
              <div className="flex-1 bg-white" />
              <div className="flex-1 bg-green-600" />
            </div>
          </div>

          <div className="inline-flex items-center bg-blue-500/30 border border-blue-300/30 text-blue-100 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            🇮🇳 Government Scheme Recommendation System
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Discover Your <span className="text-yellow-300">Government Benefits</span>
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            GovAssist AI analyses your profile and instantly tells you which central and state government 
            schemes you qualify for — with AI explanations in simple language.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to="/dashboard" className="bg-yellow-400 text-gray-900 px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-colors">
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/register" className="bg-yellow-400 text-gray-900 px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-colors">
                  Get Started Free →
                </Link>
                <Link to="/login" className="border-2 border-white text-white px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-700 transition-colors">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-blue-600">{s.value}</div>
              <div className="text-gray-500 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">Everything You Need</h2>
        <p className="text-gray-500 text-center mb-12">Powered by Rule Engine + Gemini AI</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', label: 'Register', icon: '📝' },
              { step: '2', label: 'Fill Profile', icon: '👤' },
              { step: '3', label: 'Select Documents', icon: '📄' },
              { step: '4', label: 'Get Recommendations', icon: '🎯' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl mb-3 font-bold">
                  {item.icon}
                </div>
                <div className="font-semibold text-gray-700">{item.label}</div>
                <div className="text-blue-600 text-xs font-medium mt-1">Step {item.step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-20 text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Find Your Benefits?</h2>
            <p className="text-gray-500 mb-8">Join thousands of citizens discovering their government entitlements.</p>
            <Link to="/register" className="btn-primary text-lg px-8 py-3.5 rounded-xl inline-block">
              Create Free Account →
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center py-6 text-sm">
        <div className="flex justify-center mb-2 gap-1">
          <div className="w-4 h-1 bg-orange-500 rounded" />
          <div className="w-4 h-1 bg-white rounded" />
          <div className="w-4 h-1 bg-green-500 rounded" />
        </div>
        © 2024 GovAssist AI — B.Tech Final Year Project | Made with ❤️ for India
      </footer>
    </div>
  )
}
