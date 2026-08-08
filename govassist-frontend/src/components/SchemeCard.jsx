import { useState } from 'react'
import { aiAPI } from '../services/api'

export default function SchemeCard({ rec, profile }) {
  const [expanded, setExpanded] = useState(false)
  const [aiExplanation, setAiExplanation] = useState(rec.aiExplanation || '')
  const [alternatives, setAlternatives] = useState(rec.alternativeSchemes || [])
  const [loadingAI, setLoadingAI] = useState(false)
  const [loadingAlt, setLoadingAlt] = useState(false)
  const [showGuidance, setShowGuidance] = useState(false)
  const [guidance, setGuidance] = useState('')
  const [loadingGuidance, setLoadingGuidance] = useState(false)

  const scoreColor = (score) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 50) return 'bg-yellow-400'
    return 'bg-red-400'
  }

  const handleExplain = async () => {
    if (aiExplanation) return
    setLoadingAI(true)
    try {
      const res = await aiAPI.explainEligibility(rec)
      setAiExplanation(res.data.explanation)
    } catch {
      setAiExplanation('AI explanation unavailable. Please check your API key.')
    } finally {
      setLoadingAI(false)
    }
  }

  const handleAlternatives = async () => {
    if (alternatives.length > 0) return
    setLoadingAlt(true)
    try {
      const res = await aiAPI.getAlternatives(rec.schemeName, rec.ineligibilityReasons)
      setAlternatives(res.data.alternatives || [])
    } catch {
      setAlternatives(['Unable to fetch alternatives'])
    } finally {
      setLoadingAlt(false)
    }
  }

  const handleGuidance = async () => {
    setShowGuidance(true)
    if (guidance) return
    setLoadingGuidance(true)
    try {
      const res = await aiAPI.getGuidance(rec.schemeName)
      setGuidance(res.data.reply)
    } catch {
      setGuidance('Unable to load guidance. Please try again.')
    } finally {
      setLoadingGuidance(false)
    }
  }

  return (
    <div className={`card fade-in border-l-4 ${rec.isEligible ? 'border-l-green-500' : 'border-l-red-400'}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-3">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rec.isEligible ? 'badge-eligible' : 'badge-ineligible'}`}>
              {rec.isEligible ? '✅ Eligible' : '❌ Not Eligible'}
            </span>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{rec.category}</span>
          </div>
          <h3 className="font-semibold text-gray-800 text-sm leading-snug">{rec.schemeName}</h3>
          <p className="text-gray-400 text-xs mt-0.5">{rec.ministry}</p>
        </div>

        {/* Score */}
        <div className="text-center flex-shrink-0">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${scoreColor(rec.eligibilityScore)}`}>
            {rec.eligibilityScore}%
          </div>
          <div className="text-xs text-gray-400 mt-0.5">Match</div>
        </div>
      </div>

      {/* Score Bar */}
      <div className="score-bar mb-3">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${scoreColor(rec.eligibilityScore)}`}
          style={{ width: `${rec.eligibilityScore}%` }}
        />
      </div>

      {/* Benefits */}
      <div className="bg-blue-50 rounded-lg p-2.5 mb-3">
        <span className="text-xs font-medium text-blue-700">💰 Benefits: </span>
        <span className="text-xs text-blue-600">{rec.benefits}</span>
      </div>

      {/* Ineligibility Reasons */}
      {!rec.isEligible && rec.ineligibilityReasons?.length > 0 && (
        <div className="bg-red-50 rounded-lg p-2.5 mb-3">
          <div className="text-xs font-medium text-red-700 mb-1">Why not eligible:</div>
          {rec.ineligibilityReasons.slice(0, 2).map((r, i) => (
            <div key={i} className="text-xs text-red-600">• {r}</div>
          ))}
        </div>
      )}

      {/* Missing Documents */}
      {rec.missingDocuments?.length > 0 && (
        <div className="bg-orange-50 rounded-lg p-2.5 mb-3">
          <div className="text-xs font-medium text-orange-700 mb-1">📄 Missing Documents:</div>
          <div className="flex flex-wrap gap-1">
            {rec.missingDocuments.map((doc, i) => (
              <span key={i} className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{doc}</span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mt-3">
        <button onClick={() => { setExpanded(!expanded); if (!expanded) handleExplain(); }}
          className="text-xs btn-outline py-1.5 px-3">
          🤖 AI Explain
        </button>
        {!rec.isEligible && (
          <button onClick={handleAlternatives}
            className="text-xs bg-purple-50 text-purple-600 border border-purple-200 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors">
            💡 Alternatives
          </button>
        )}
        {rec.isEligible && (
          <button onClick={handleGuidance}
            className="text-xs bg-green-50 text-green-600 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors">
            📋 How to Apply
          </button>
        )}
        <a href={rec.officialLink} target="_blank" rel="noopener noreferrer"
          className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors ml-auto">
          Apply →
        </a>
      </div>

      {/* Expanded: AI Explanation */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs font-medium text-gray-600 mb-2">🤖 AI Explanation:</div>
          {loadingAI ? (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              Thinking...
            </div>
          ) : (
            <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-3">{aiExplanation}</p>
          )}
        </div>
      )}

      {/* Alternatives */}
      {alternatives.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs font-medium text-gray-600 mb-2">💡 Alternative Schemes:</div>
          {loadingAlt ? (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
              Loading...
            </div>
          ) : (
            <div className="flex flex-wrap gap-1">
              {alternatives.map((alt, i) => (
                <span key={i} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full border border-purple-200">{alt}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Application Guidance */}
      {showGuidance && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs font-medium text-gray-600 mb-2">📋 Application Guide:</div>
          {loadingGuidance ? (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-3 h-3 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
              Loading guide...
            </div>
          ) : (
            <div className="text-xs text-gray-600 bg-green-50 rounded-lg p-3 leading-relaxed whitespace-pre-wrap">{guidance}</div>
          )}
        </div>
      )}
    </div>
  )
}
