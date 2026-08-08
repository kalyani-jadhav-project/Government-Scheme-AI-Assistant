import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { schemeAPI, userAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import SchemeCard from '../components/SchemeCard'
import ChatBot from '../components/ChatBot'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [recommendations, setRecommendations] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [filter, setFilter] = useState('all') // all | eligible | ineligible
  const [search, setSearch] = useState('')
  const [showChat, setShowChat] = useState(false)
  const [tab, setTab] = useState('eligible') // eligible | ineligible | missing-docs

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recRes, profileRes] = await Promise.all([
          schemeAPI.getRecommendations(),
          userAPI.getProfile(),
        ])
        setRecommendations(recRes.data)
        setProfile(profileRes.data)
      } catch {
        // If no recommendations yet, that's fine
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await schemeAPI.generateRecommendations()
      setRecommendations(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setGenerating(false)
    }
  }

  const eligible = recommendations.filter(r => r.isEligible)
  const ineligible = recommendations.filter(r => !r.isEligible)

  // All unique missing docs across ineligible schemes
  const missingDocsSchemes = ineligible.filter(r => r.missingDocuments?.length > 0)
  const allMissingDocs = [...new Set(missingDocsSchemes.flatMap(r => r.missingDocuments))]

  // Schemes that become available if user gets missing docs
  const schemesUnlockable = missingDocsSchemes.filter(r =>
    r.ineligibilityReasons?.every(reason => reason.toLowerCase().includes('missing'))
  )

  const avgScore = recommendations.length
    ? Math.round(recommendations.reduce((s, r) => s + (r.eligibilityScore || 0), 0) / recommendations.length)
    : 0

  const filteredRecs = recommendations.filter(r => {
    const matchSearch = r.schemeName.toLowerCase().includes(search.toLowerCase())
    if (filter === 'eligible') return r.isEligible && matchSearch
    if (filter === 'ineligible') return !r.isEligible && matchSearch
    return matchSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">Your personalized government scheme dashboard</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowChat(!showChat)}
              className="btn-outline flex items-center gap-2">
              💬 AI Chat
            </button>
            {!user?.profileCompleted ? (
              <Link to="/profile" className="btn-primary flex items-center gap-2">
                📝 Complete Profile
              </Link>
            ) : (
              <button onClick={handleGenerate} disabled={generating} className="btn-primary flex items-center gap-2">
                {generating ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analysing...</>
                ) : '🔄 Refresh Schemes'}
              </button>
            )}
          </div>
        </div>

        {/* Profile incomplete warning */}
        {!user?.profileCompleted && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div>
              <div className="font-medium text-yellow-800">Profile Incomplete</div>
              <div className="text-yellow-600 text-sm">Complete your profile to get personalized recommendations</div>
            </div>
            <Link to="/profile" className="btn-primary text-sm">Complete Now →</Link>
          </div>
        )}

        {/* Stats Cards */}
        {recommendations.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card text-center">
              <div className="text-3xl font-bold text-blue-600">{recommendations.length}</div>
              <div className="text-gray-500 text-sm mt-1">Total Schemes</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-green-600">{eligible.length}</div>
              <div className="text-gray-500 text-sm mt-1">Eligible</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-red-500">{ineligible.length}</div>
              <div className="text-gray-500 text-sm mt-1">Not Eligible</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-purple-600">{avgScore}%</div>
              <div className="text-gray-500 text-sm mt-1">Avg. Score</div>
            </div>
          </div>
        )}

        {/* Missing Docs Alert */}
        {allMissingDocs.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
            <div className="font-semibold text-orange-800 mb-2">
              🔓 Get These Documents to Unlock {missingDocsSchemes.length} More Schemes:
            </div>
            <div className="flex flex-wrap gap-2">
              {allMissingDocs.map(doc => (
                <span key={doc} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                  📄 {doc}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        {recommendations.length > 0 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            <button onClick={() => setTab('eligible')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'eligible' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              ✅ Eligible ({eligible.length})
            </button>
            <button onClick={() => setTab('ineligible')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'ineligible' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              ❌ Not Eligible ({ineligible.length})
            </button>
            <button onClick={() => setTab('unlockable')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'unlockable' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              🔓 Unlockable ({schemesUnlockable.length})
            </button>

            {/* Search */}
            <div className="ml-auto">
              <input
                type="text"
                placeholder="Search schemes..."
                className="input-field py-2 text-sm w-48"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Scheme Cards */}
        {recommendations.length === 0 ? (
          <div className="card text-center py-16">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Recommendations Yet</h3>
            <p className="text-gray-400 mb-6">Complete your profile to get personalized government scheme recommendations</p>
            <Link to="/profile" className="btn-primary inline-block px-8 py-3 rounded-xl">
              Complete Profile →
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {(tab === 'eligible' ? eligible : tab === 'ineligible' ? ineligible : schemesUnlockable)
              .filter(r => r.schemeName.toLowerCase().includes(search.toLowerCase()))
              .map(rec => (
                <SchemeCard key={rec.schemeId} rec={rec} profile={profile} />
              ))
            }
          </div>
        )}
      </div>

      {/* ChatBot */}
      {showChat && <ChatBot onClose={() => setShowChat(false)} />}
    </div>
  )
}
