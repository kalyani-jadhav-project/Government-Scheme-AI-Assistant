import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { userAPI, schemeAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Chandigarh','Puducherry']
const OCCUPATIONS = ['Farmer','Labourer','Government Employee','Private Employee','Self-Employed','Entrepreneur','Student','Unemployed','Artisan','Homemaker','Other']
const EDUCATIONS = ['No Formal Education','Primary (1-5)','Middle School (6-8)','High School (9-10)','Senior Secondary (11-12)','Diploma','Graduation','Post Graduation','PhD']
const CATEGORIES = ['GEN','OBC','SC','ST']
const GENDERS = ['MALE','FEMALE','OTHER']

const DOCS = [
  { key: 'hasAadhaar', label: 'Aadhaar Card', desc: 'UIDAI issued 12-digit ID' },
  { key: 'hasPan', label: 'PAN Card', desc: 'Income Tax Permanent Account Number' },
  { key: 'hasIncomeCertificate', label: 'Income Certificate', desc: 'Annual income proof' },
  { key: 'hasCasteCertificate', label: 'Caste Certificate', desc: 'SC/ST/OBC certificate' },
  { key: 'hasDomicile', label: 'Domicile Certificate', desc: 'State residence proof' },
  { key: 'hasRationCard', label: 'Ration Card', desc: 'BPL/APL ration card' },
  { key: 'hasBankPassbook', label: 'Bank Passbook', desc: 'Active bank account' },
]

export default function Profile() {
  const navigate = useNavigate()
  const { updateUser } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [profile, setProfile] = useState({
    age: '', gender: '', state: '', district: '', occupation: '', education: '',
    annualIncome: '', category: '',
    hasAadhaar: false, hasPan: false, hasIncomeCertificate: false,
    hasCasteCertificate: false, hasDomicile: false, hasRationCard: false, hasBankPassbook: false,
  })

  useEffect(() => {
    userAPI.getProfile().then(res => {
      const d = res.data
      setProfile(p => ({ ...p, ...d, age: d.age || '', annualIncome: d.annualIncome || '' }))
    }).catch(() => {})
  }, [])

  const handleChange = (key, value) => setProfile(p => ({ ...p, [key]: value }))

  const handleSave = async (generate = false) => {
    setSaving(true)
    setMsg('')
    try {
      const res = await userAPI.updateProfile({
        ...profile,
        age: profile.age ? parseInt(profile.age) : null,
        annualIncome: profile.annualIncome ? parseFloat(profile.annualIncome) : null,
      })
      updateUser({ profileCompleted: res.data.profileCompleted })
      if (generate) {
        setLoading(true)
        setMsg('Analysing your profile...')
        await schemeAPI.generateRecommendations()
        navigate('/dashboard')
      } else {
        setMsg('Profile saved successfully!')
        setTimeout(() => setMsg(''), 3000)
      }
    } catch (err) {
      setMsg('Failed to save. Please try again.')
    } finally {
      setSaving(false)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Complete Your Profile</h1>
          <p className="text-gray-500 text-sm mt-1">Fill your details to get personalized scheme recommendations</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2].map(s => (
            <button key={s} onClick={() => setStep(s)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${step === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === s ? 'bg-white text-blue-600' : 'bg-gray-300 text-gray-500'}`}>{s}</span>
              {s === 1 ? 'Personal Info' : 'Documents'}
            </button>
          ))}
        </div>

        {step === 1 && (
          <div className="card fade-in space-y-4">
            <h2 className="font-semibold text-gray-700 text-lg border-b pb-3">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                <input type="number" className="input-field" placeholder="e.g. 25" min="1" max="120"
                  value={profile.age} onChange={e => handleChange('age', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                <select className="select-field" value={profile.gender} onChange={e => handleChange('gender', e.target.value)}>
                  <option value="">Select</option>
                  {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <select className="select-field" value={profile.state} onChange={e => handleChange('state', e.target.value)}>
                  <option value="">Select State</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <input type="text" className="input-field" placeholder="e.g. Pune"
                  value={profile.district} onChange={e => handleChange('district', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation *</label>
                <select className="select-field" value={profile.occupation} onChange={e => handleChange('occupation', e.target.value)}>
                  <option value="">Select</option>
                  {OCCUPATIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                <select className="select-field" value={profile.education} onChange={e => handleChange('education', e.target.value)}>
                  <option value="">Select</option>
                  {EDUCATIONS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income (₹) *</label>
                <input type="number" className="input-field" placeholder="e.g. 150000"
                  value={profile.annualIncome} onChange={e => handleChange('annualIncome', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select className="select-field" value={profile.category} onChange={e => handleChange('category', e.target.value)}>
                  <option value="">Select</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <button onClick={() => setStep(2)} className="btn-primary w-full py-3 rounded-xl mt-2">
              Next: Select Documents →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="card fade-in">
            <h2 className="font-semibold text-gray-700 text-lg border-b pb-3 mb-4">
              Available Documents
              <span className="text-sm font-normal text-gray-400 ml-2">— tick what you have</span>
            </h2>
            <div className="space-y-3">
              {DOCS.map(doc => (
                <label key={doc.key} className={`flex items-center gap-4 p-3 rounded-xl border-2 cursor-pointer transition-all ${profile[doc.key] ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-blue-600 cursor-pointer"
                    checked={!!profile[doc.key]}
                    onChange={e => handleChange(doc.key, e.target.checked)}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 text-sm">{doc.label}</div>
                    <div className="text-gray-400 text-xs">{doc.desc}</div>
                  </div>
                  {profile[doc.key] && <span className="text-green-500 text-lg">✓</span>}
                </label>
              ))}
            </div>

            {msg && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${msg.includes('success') ? 'bg-green-50 text-green-700' : msg.includes('Analysing') ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
                {msg.includes('Analysing') && <span className="mr-2">⏳</span>}{msg}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1 py-3 rounded-xl">
                ← Back
              </button>
              <button onClick={() => handleSave(false)} disabled={saving} className="btn-outline flex-1 py-3 rounded-xl">
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
              <button onClick={() => handleSave(true)} disabled={saving || loading} className="btn-primary flex-1 py-3 rounded-xl">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analysing...
                  </span>
                ) : '🎯 Get Schemes →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
