import { useState, useRef, useEffect } from 'react'
import { aiAPI } from '../services/api'

const QUICK_QUESTIONS = [
  'What is PM Kisan?',
  'How to apply for Ayushman Bharat?',
  'Which schemes are for farmers?',
  'What is the income limit for PMAY?',
  'Schemes for SC/ST students?',
]

export default function ChatBot({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "👋 Hello! I'm GovAssist AI. I can help you with information about government schemes, eligibility criteria, and application processes. What would you like to know?",
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    const userMsg = text || input.trim()
    if (!userMsg) return

    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setInput('')
    setLoading(true)

    try {
      const res = await aiAPI.chat(userMsg)
      setMessages(prev => [...prev, { role: 'assistant', text: res.data.reply }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: 'Sorry, I encountered an error. Please check your Gemini API key configuration and try again.'
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="fixed bottom-6 right-6 w-[380px] max-h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            🤖
          </div>
          <div>
            <div className="font-semibold text-sm">GovAssist AI</div>
            <div className="text-blue-200 text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Online
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-white/70 hover:text-white text-lg">✕</button>
      </div>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="px-3 pt-3 pb-1">
          <div className="text-xs text-gray-400 mb-2">Quick questions:</div>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_QUESTIONS.map(q => (
              <button key={q} onClick={() => sendMessage(q)}
                className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-full hover:bg-blue-100 transition-colors">
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-sm mr-2 mt-1 flex-shrink-0">
                🤖
              </div>
            )}
            <div className={`max-w-[85%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'bg-gray-100 text-gray-800 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-sm mr-2 mt-1">🤖</div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask about any scheme..."
            className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
