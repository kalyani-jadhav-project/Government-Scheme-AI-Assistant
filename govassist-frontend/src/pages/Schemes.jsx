import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { schemeAPI } from '../services/api'

const CATEGORIES = ['All', 'Agriculture', 'Housing', 'Health', 'Education', 'Business', 'Insurance', 'Pension', 'Employment', 'Skill Development', 'Energy']

export default function Schemes() {
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    schemeAPI.getAllSchemes()
      .then(res => setSchemes(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = schemes.filter(s => {
    const matchCat = filter === 'All' || s.category === filter
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const categoryColors = {
    Agriculture: 'bg-green-100 text-green-700',
    Housing: 'bg-blue-100 text-blue-700',
    Health: 'bg-red-100 text-red-700',
    Education: 'bg-yellow-100 text-yellow-700',
    Business: 'bg-purple-100 text-purple-700',
    Insurance: 'bg-teal-100 text-teal-700',
    Pension: 'bg-indigo-100 text-indigo-700',
    Employment: 'bg-orange-100 text-orange-700',
    'Skill Development': 'bg-pink-100 text-pink-700',
    Energy: 'bg-amber-100 text-amber-700',
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">All Government Schemes</h1>
          <p className="text-gray-500 text-sm mt-1">{schemes.length} schemes across all categories</p>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {cat}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search schemes by name or description..."
            className="input-field"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="text-sm text-gray-500 mb-4">{filtered.length} schemes found</div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(scheme => (
            <div key={scheme.id}
              className="card hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelected(scheme)}>
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[scheme.category] || 'bg-gray-100 text-gray-600'}`}>
                  {scheme.category}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${scheme.schemeType === 'CENTRAL' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                  {scheme.schemeType}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 text-sm leading-snug">{scheme.name}</h3>
              <p className="text-gray-400 text-xs line-clamp-2 mb-3">{scheme.description}</p>
              <div className="text-xs text-gray-500 mb-3">
                🏛️ {scheme.ministry}
              </div>
              <div className="bg-green-50 rounded-lg p-2 text-xs text-green-700">
                <strong>Benefits:</strong> {scheme.benefits?.substring(0, 80)}...
              </div>
              <a href={scheme.officialLink} target="_blank" rel="noopener noreferrer"
                className="mt-3 text-blue-600 text-xs font-medium hover:underline block"
                onClick={e => e.stopPropagation()}>
                Apply on Official Portal →
              </a>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="card text-center py-16">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-400">No schemes found for this filter</p>
          </div>
        )}
      </div>

      {/* Scheme Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`text-xs px-2.5 py-1 rounded-full ${categoryColors[selected.category] || 'bg-gray-100 text-gray-600'}`}>
                  {selected.category}
                </span>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">{selected.name}</h2>
            <p className="text-gray-500 text-sm mb-4">{selected.description}</p>

            <div className="space-y-3 text-sm">
              <div className="flex gap-2"><span className="font-medium text-gray-600 w-28">Ministry:</span><span>{selected.ministry}</span></div>
              <div className="flex gap-2"><span className="font-medium text-gray-600 w-28">Type:</span><span>{selected.schemeType}</span></div>
              <div className="flex gap-2"><span className="font-medium text-gray-600 w-28">Age Range:</span><span>{selected.minAge} – {selected.maxAge} years</span></div>
              <div className="flex gap-2"><span className="font-medium text-gray-600 w-28">Gender:</span><span>{selected.gender}</span></div>
              {selected.maxIncome && <div className="flex gap-2"><span className="font-medium text-gray-600 w-28">Max Income:</span><span>₹{selected.maxIncome?.toLocaleString('en-IN')}</span></div>}
              <div className="flex gap-2"><span className="font-medium text-gray-600 w-28">Category:</span><span>{selected.eligibleCategories}</span></div>
            </div>

            <div className="bg-green-50 rounded-xl p-4 mt-4">
              <div className="font-semibold text-green-800 text-sm mb-1">Benefits</div>
              <div className="text-green-700 text-sm">{selected.benefits}</div>
            </div>

            <a href={selected.officialLink} target="_blank" rel="noopener noreferrer"
              className="btn-primary mt-4 w-full text-center block py-3 rounded-xl">
              Apply on Official Portal →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
