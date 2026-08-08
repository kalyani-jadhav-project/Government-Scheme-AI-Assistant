import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { schemeAPI } from '../services/api'

export default function Admin() {
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    name: '', description: '', category: '', ministry: '', schemeType: 'CENTRAL',
    minAge: 0, maxAge: 150, gender: 'ALL', maxIncome: '', eligibleOccupations: '',
    eligibleCategories: 'GEN,OBC,SC,ST', requiredDocuments: '', benefits: '', officialLink: '',
  })
  const [msg, setMsg] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    schemeAPI.getAllSchemes()
      .then(res => setSchemes(res.data))
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await schemeAPI.addScheme ? schemeAPI.addScheme(form) : null
      setMsg('Scheme added successfully!')
      setTimeout(() => setMsg(''), 3000)
    } catch {
      setMsg('Failed to add scheme')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-gray-500 text-sm">Manage government schemes database</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Add Scheme Form */}
          <div className="card">
            <h2 className="font-semibold text-gray-700 mb-4 border-b pb-3">Add New Scheme</h2>
            <form onSubmit={handleAdd} className="space-y-3">
              <input type="text" placeholder="Scheme Name *" className="input-field"
                value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              <textarea placeholder="Description" className="input-field h-20 resize-none"
                value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Category" className="input-field"
                  value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
                <input type="text" placeholder="Ministry" className="input-field"
                  value={form.ministry} onChange={e => setForm({...form, ministry: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select className="select-field" value={form.schemeType} onChange={e => setForm({...form, schemeType: e.target.value})}>
                  <option value="CENTRAL">Central</option>
                  <option value="STATE">State</option>
                </select>
                <select className="select-field" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                  <option value="ALL">All Genders</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <input type="number" placeholder="Min Age" className="input-field"
                  value={form.minAge} onChange={e => setForm({...form, minAge: e.target.value})} />
                <input type="number" placeholder="Max Age" className="input-field"
                  value={form.maxAge} onChange={e => setForm({...form, maxAge: e.target.value})} />
                <input type="number" placeholder="Max Income ₹" className="input-field"
                  value={form.maxIncome} onChange={e => setForm({...form, maxIncome: e.target.value})} />
              </div>
              <input type="text" placeholder="Eligible Categories (GEN,OBC,SC,ST)" className="input-field"
                value={form.eligibleCategories} onChange={e => setForm({...form, eligibleCategories: e.target.value})} />
              <input type="text" placeholder="Required Docs (AADHAAR,PAN,...)" className="input-field"
                value={form.requiredDocuments} onChange={e => setForm({...form, requiredDocuments: e.target.value})} />
              <textarea placeholder="Benefits" className="input-field h-16 resize-none"
                value={form.benefits} onChange={e => setForm({...form, benefits: e.target.value})} />
              <input type="url" placeholder="Official Link" className="input-field"
                value={form.officialLink} onChange={e => setForm({...form, officialLink: e.target.value})} />
              {msg && <div className={`p-3 rounded-lg text-sm ${msg.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{msg}</div>}
              <button type="submit" disabled={saving} className="btn-primary w-full py-2.5 rounded-xl">
                {saving ? 'Adding...' : '+ Add Scheme'}
              </button>
            </form>
          </div>

          {/* Schemes Table */}
          <div className="card">
            <h2 className="font-semibold text-gray-700 mb-4 border-b pb-3">
              All Schemes <span className="text-gray-400 font-normal">({schemes.length})</span>
            </h2>
            {loading ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {schemes.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">{s.name}</div>
                      <div className="text-xs text-gray-400">{s.category} · {s.schemeType}</div>
                    </div>
                    <span className={`ml-3 text-xs px-2 py-1 rounded-full ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {s.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
