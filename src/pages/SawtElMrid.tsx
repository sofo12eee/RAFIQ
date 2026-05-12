import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Plus, ThumbsUp, Filter, Megaphone } from 'lucide-react'
import type { Testimony } from '../data/testimonies'
import { categoryLabels, categoryColors } from '../data/testimonies'

const API = 'https://rafiq-production-dfa1.up.railway.app/api'

const wilayas = [
  'الجزائر', 'وهران', 'قسنطينة', 'سطيف', 'باتنة', 'عنابة', 'بليدة',
  'تيزي وزو', 'بجاية', 'تلمسان', 'مستغانم', 'الشلف', 'جيجل', 'سكيكدة',
  'بسكرة', 'المسيلة', 'ورقلة', 'أخرى',
]

export default function SawtElMrid() {
  const [testimonies, setTestimonies] = useState<Testimony[]>([])
  const [filter, setFilter] = useState<Testimony['category'] | 'all'>('all')
  const [showForm, setShowForm] = useState(false)
  const [formName, setFormName] = useState('')
  const [formWilaya, setFormWilaya] = useState('')
  const [formCategory, setFormCategory] = useState<Testimony['category']>('delay')
  const [formMessage, setFormMessage] = useState('')
  const [stats, setStats] = useState({ total: 0, delay: 0, medication: 0 })
  const [loading, setLoading] = useState(true)

  const fetchTestimonies = async () => {
    try {
      const url = filter === 'all' ? `${API}/testimonies` : `${API}/testimonies?category=${filter}`
      const res = await fetch(url)
      const data = await res.json()
      setTestimonies(data)
    } catch (e) {
      console.error('Error fetching testimonies:', e)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/testimonies/stats`)
      const data = await res.json()
      setStats(data)
    } catch (e) {
      console.error('Error fetching stats:', e)
    }
  }

  useEffect(() => { fetchTestimonies() }, [filter])
  useEffect(() => { fetchStats() }, [])

  const handleSubmit = async () => {
    if (!formName.trim() || !formMessage.trim() || !formWilaya) return
    try {
      const res = await fetch(`${API}/testimonies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          wilaya: formWilaya,
          category: formCategory,
          message: formMessage.trim(),
        }),
      })
      if (res.ok) {
        setFormName('')
        setFormWilaya('')
        setFormMessage('')
        setShowForm(false)
        fetchTestimonies()
        fetchStats()
      }
    } catch (e) {
      console.error('Error posting testimony:', e)
    }
  }

  const handleLike = async (id: string | number) => {
    try {
      await fetch(`${API}/testimonies/${id}/like`, { method: 'POST' })
      setTestimonies(testimonies.map(t =>
        t.id === String(id) || t.id === id ? { ...t, likes: t.likes + 1 } : t
      ))
    } catch (e) {
      console.error('Error liking:', e)
    }
  }

  return (
    <div className="space-y-4 pb-8">
      <div className="flex items-center gap-2 mb-2">
        <Link to="/" className="text-teal-600"><ArrowRight size={20} /></Link>
        <h2 className="text-xl font-bold text-gray-800">صوت المريض</h2>
      </div>

      {/* Intro */}
      <div className="card bg-gradient-to-l from-red-50 to-white border border-red-200">
        <div className="flex items-start gap-3">
          <Megaphone className="text-red-400 mt-1 shrink-0" size={20} />
          <div>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-red-700">هنا صوتك يتسمع.</strong> شارك تجربتك بكل شفافية: تأخر في المواعيد، ندرة الأدوية، أو أي مشكل تواجهه. الكل يقرا والكل يتضامن.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
          <p className="text-xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-xs text-gray-500">شهادة</p>
        </div>
        <div className="bg-white rounded-xl p-3 text-center border border-amber-100">
          <p className="text-xl font-bold text-amber-600">{stats.delay}</p>
          <p className="text-xs text-gray-500">تأخر مواعيد</p>
        </div>
        <div className="bg-white rounded-xl p-3 text-center border border-red-100">
          <p className="text-xl font-bold text-red-600">{stats.medication}</p>
          <p className="text-xs text-gray-500">ندرة دواء</p>
        </div>
      </div>

      {/* Add button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        <Plus size={18} /> شارك تجربتك
      </button>

      {/* Form */}
      {showForm && (
        <div className="card border border-teal-200 space-y-3">
          <h3 className="font-bold text-gray-800">شارك شكواك أو تجربتك</h3>

          <input
            type="text"
            placeholder="اسمك (ولا اسم مستعار)"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400"
          />

          <select
            value={formWilaya}
            onChange={(e) => setFormWilaya(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400"
          >
            <option value="">اختار الولاية</option>
            {wilayas.map(w => <option key={w} value={w}>{w}</option>)}
          </select>

          <select
            value={formCategory}
            onChange={(e) => setFormCategory(e.target.value as Testimony['category'])}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400"
          >
            {Object.entries(categoryLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <textarea
            placeholder="اكتب تجربتك أو شكواك هنا..."
            value={formMessage}
            onChange={(e) => setFormMessage(e.target.value)}
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400 resize-none"
          />

          <div className="flex gap-2">
            <button onClick={handleSubmit} className="btn-primary flex-1">نشر</button>
            <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-bold">إلغاء</button>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter size={14} className="text-gray-400 shrink-0" />
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            filter === 'all' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          الكل
        </button>
        {Object.entries(categoryLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key as Testimony['category'])}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filter === key ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Testimonies list */}
      {loading ? (
        <p className="text-center text-gray-400 text-sm py-6">جاري التحميل...</p>
      ) : (
        <>
          {testimonies.map((t) => (
            <div key={t.id} className="card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-sm font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-800">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.wilaya} • {t.date}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${categoryColors[t.category]}`}>
                  {categoryLabels[t.category]}
                </span>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed mb-3 pr-10">
                {t.message}
              </p>

              <div className="flex items-center gap-1 border-t border-gray-50 pt-2">
                <button
                  onClick={() => handleLike(t.id)}
                  className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors text-xs"
                >
                  <ThumbsUp size={14} />
                  <span>{t.likes}</span>
                </button>
                <span className="text-xs text-gray-300 mr-2">متضامن/ة</span>
              </div>
            </div>
          ))}

          {testimonies.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-6">ما كاين حتى شهادة في هذا القسم بعد.</p>
          )}
        </>
      )}
    </div>
  )
}
