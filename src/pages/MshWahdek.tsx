import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Heart, RefreshCw, Plus, ThumbsUp } from 'lucide-react'
import { dailyMessages } from '../data/stories'

const API = '/api'

interface Story {
  id: number
  name: string
  age: number | null
  cancer_type: string
  message: string
  likes: number
  date: string
}

export default function MshWahdek() {
  const [messageIndex, setMessageIndex] = useState(0)
  const [stories, setStories] = useState<Story[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formName, setFormName] = useState('')
  const [formAge, setFormAge] = useState('')
  const [formType, setFormType] = useState('')
  const [formMessage, setFormMessage] = useState('')

  useEffect(() => {
    const today = new Date().getDate()
    setMessageIndex(today % dailyMessages.length)
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      const res = await fetch(`${API}/stories`)
      const data = await res.json()
      setStories(data)
    } catch (e) {
      console.error('Error fetching stories:', e)
    }
  }

  const refreshMessage = () => {
    setMessageIndex((prev) => (prev + 1) % dailyMessages.length)
  }

  const handleSubmit = async () => {
    if (!formName.trim() || !formType.trim() || !formMessage.trim()) return
    try {
      const res = await fetch(`${API}/stories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          age: formAge ? Number(formAge) : null,
          cancer_type: formType.trim(),
          message: formMessage.trim(),
        }),
      })
      if (res.ok) {
        setFormName('')
        setFormAge('')
        setFormType('')
        setFormMessage('')
        setShowForm(false)
        fetchStories()
      }
    } catch (e) {
      console.error('Error posting story:', e)
    }
  }

  const handleLike = async (id: number) => {
    try {
      await fetch(`${API}/stories/${id}/like`, { method: 'POST' })
      setStories(stories.map(s => s.id === id ? { ...s, likes: s.likes + 1 } : s))
    } catch (e) {
      console.error('Error liking:', e)
    }
  }

  return (
    <div className="space-y-4 pb-8">
      <div className="flex items-center gap-2 mb-2">
        <Link to="/" className="text-teal-600"><ArrowRight size={20} /></Link>
        <h2 className="text-xl font-bold text-gray-800">ما راكش وحدك</h2>
      </div>

      {/* Daily message */}
      <div className="card bg-gradient-to-l from-teal-50 to-emerald-50 border border-teal-200">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-teal-600 font-bold mb-2">💬 رسالة اليوم</p>
            <p className="text-gray-700 text-base leading-relaxed font-bold">
              {dailyMessages[messageIndex]}
            </p>
          </div>
          <button onClick={refreshMessage} className="text-teal-400 hover:text-teal-600 shrink-0">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Add story button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        <Plus size={18} /> شارك قصتك وألهم غيرك
      </button>

      {/* Form */}
      {showForm && (
        <div className="card border border-teal-200 space-y-3">
          <h3 className="font-bold text-gray-800">شارك تجربتك مع المرض</h3>
          <p className="text-xs text-gray-500">قصتك ممكن تعطي أمل لمريض آخر يحس بالوحدة</p>

          <input
            type="text"
            placeholder="اسمك (ولا اسم مستعار)"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400"
          />

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="العمر"
              value={formAge}
              onChange={(e) => setFormAge(e.target.value)}
              className="w-24 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400"
            />
            <input
              type="text"
              placeholder="نوع السرطان (مثلاً: سرطان الثدي)"
              value={formType}
              onChange={(e) => setFormType(e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400"
            />
          </div>

          <textarea
            placeholder="احكي تجربتك... واش مريت بيه؟ كيفاش تغلبت؟ واش تقول لمريض جديد؟"
            value={formMessage}
            onChange={(e) => setFormMessage(e.target.value)}
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400 resize-none"
          />

          <div className="flex gap-2">
            <button onClick={handleSubmit} className="btn-primary flex-1">نشر القصة</button>
            <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-bold">إلغاء</button>
          </div>
        </div>
      )}

      {/* Survivor stories */}
      <h3 className="font-bold text-gray-700 flex items-center gap-2 pt-2">
        <Heart size={18} className="text-rose-400" />
        قصص ناس قدرو
      </h3>

      {stories.map((story) => (
        <div key={story.id} className="card">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 text-sm font-bold">
              {story.name[0]}
            </div>
            <div>
              <p className="font-bold text-sm text-gray-800">{story.name}</p>
              <p className="text-xs text-gray-400">
                {story.cancer_type}{story.age ? ` • ${story.age} سنة` : ''}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed pr-11 mb-3">"{story.message}"</p>
          <div className="flex items-center gap-1 border-t border-gray-50 pt-2">
            <button
              onClick={() => handleLike(story.id)}
              className="flex items-center gap-1 text-gray-400 hover:text-rose-500 transition-colors text-xs"
            >
              <ThumbsUp size={14} />
              <span>{story.likes}</span>
            </button>
            <span className="text-xs text-gray-300 mr-2">ألهمتني</span>
          </div>
        </div>
      ))}

      {stories.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-6">ما كاين حتى قصة بعد. كون أول واحد يشارك!</p>
      )}

      {/* Emergency support */}
      <div className="card bg-amber-50 border border-amber-200">
        <h3 className="font-bold text-amber-700 mb-2">📞 تحتاج تهدر مع حد؟</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          إذا حسيت بوحدة أو ضيق كبير، ما تبقاش وحدك. تواصل مع الجمعية ولا اتصل بخط الدعم النفسي.
        </p>
        <div className="mt-3 p-3 bg-white rounded-lg text-center">
          <p className="text-xs text-gray-500">خط المساعدة النفسية</p>
          <p className="text-xl font-bold text-teal-700 mt-1" dir="ltr">0800 00 00 00</p>
          <p className="text-xs text-gray-400 mt-1">(الرقم مجاني ومتاح 24/24)</p>
        </div>
      </div>
    </div>
  )
}
