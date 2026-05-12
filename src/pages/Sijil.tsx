import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Plus, Trash2, Calendar, AlertCircle, HelpCircle } from 'lucide-react'

interface Appointment {
  id: string
  title: string
  date: string
  note: string
}

interface Symptom {
  id: string
  date: string
  text: string
  severity: number
}

interface Question {
  id: string
  text: string
  answered: boolean
}

function getStored<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key)
  return raw ? JSON.parse(raw) : fallback
}

export default function Sijil() {
  const [tab, setTab] = useState<'appointments' | 'symptoms' | 'questions'>('appointments')
  const [appointments, setAppointments] = useState<Appointment[]>(() => getStored('rafiq_appointments', []))
  const [symptoms, setSymptoms] = useState<Symptom[]>(() => getStored('rafiq_symptoms', []))
  const [questions, setQuestions] = useState<Question[]>(() => getStored('rafiq_questions', []))

  useEffect(() => { localStorage.setItem('rafiq_appointments', JSON.stringify(appointments)) }, [appointments])
  useEffect(() => { localStorage.setItem('rafiq_symptoms', JSON.stringify(symptoms)) }, [symptoms])
  useEffect(() => { localStorage.setItem('rafiq_questions', JSON.stringify(questions)) }, [questions])

  const addAppointment = () => {
    const title = prompt('نوع الموعد (مثلاً: كيماوي، تحاليل، مراجعة...)')
    if (!title) return
    const date = prompt('التاريخ (مثلاً: 2025-06-15)')
    if (!date) return
    const note = prompt('ملاحظة (اختياري)') || ''
    setAppointments([...appointments, { id: Date.now().toString(), title, date, note }])
  }

  const addSymptom = () => {
    const text = prompt('واش حسيت بيه؟ (مثلاً: غثيان، تعب، ألم في...)')
    if (!text) return
    const severityStr = prompt('قداش (من 1 خفيف إلى 10 شديد)؟')
    const severity = Number(severityStr) || 5
    setSymptoms([...symptoms, { id: Date.now().toString(), date: new Date().toLocaleDateString('ar-DZ'), text, severity }])
  }

  const addQuestion = () => {
    const text = prompt('واش تحب تسأل الطبيب؟')
    if (!text) return
    setQuestions([...questions, { id: Date.now().toString(), text, answered: false }])
  }

  const tabs = [
    { key: 'appointments' as const, label: 'المواعيد', icon: Calendar },
    { key: 'symptoms' as const, label: 'الأعراض', icon: AlertCircle },
    { key: 'questions' as const, label: 'أسئلة للطبيب', icon: HelpCircle },
  ]

  return (
    <div className="space-y-4 pb-8">
      <div className="flex items-center gap-2 mb-2">
        <Link to="/" className="text-teal-600"><ArrowRight size={20} /></Link>
        <h2 className="text-xl font-bold text-gray-800">سجلي الشخصي</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === key ? 'bg-teal-600 text-white' : 'text-gray-500'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'appointments' && (
        <div className="space-y-3">
          <button onClick={addAppointment} className="btn-primary w-full flex items-center justify-center gap-2">
            <Plus size={18} /> أضف موعد
          </button>
          {appointments.length === 0 && <p className="text-center text-gray-400 text-sm py-6">ما عندك حتى موعد مسجل. أضف واحد!</p>}
          {appointments.sort((a, b) => a.date.localeCompare(b.date)).map((apt) => (
            <div key={apt.id} className="card flex items-center gap-3">
              <div className="flex-1">
                <p className="font-bold text-sm text-gray-800">{apt.title}</p>
                <p className="text-xs text-teal-600">{apt.date}</p>
                {apt.note && <p className="text-xs text-gray-400 mt-1">{apt.note}</p>}
              </div>
              <button onClick={() => setAppointments(appointments.filter(a => a.id !== apt.id))} className="text-red-300 hover:text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'symptoms' && (
        <div className="space-y-3">
          <button onClick={addSymptom} className="btn-primary w-full flex items-center justify-center gap-2">
            <Plus size={18} /> سجّل عرض
          </button>
          {symptoms.length === 0 && <p className="text-center text-gray-400 text-sm py-6">سجّل أعراضك باش تخبّر الطبيب بالضبط</p>}
          {symptoms.slice().reverse().map((s) => (
            <div key={s.id} className="card flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                s.severity >= 7 ? 'bg-red-500' : s.severity >= 4 ? 'bg-amber-500' : 'bg-green-500'
              }`}>
                {s.severity}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">{s.text}</p>
                <p className="text-xs text-gray-400">{s.date}</p>
              </div>
              <button onClick={() => setSymptoms(symptoms.filter(x => x.id !== s.id))} className="text-red-300 hover:text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'questions' && (
        <div className="space-y-3">
          <button onClick={addQuestion} className="btn-primary w-full flex items-center justify-center gap-2">
            <Plus size={18} /> أضف سؤال للطبيب
          </button>
          {questions.length === 0 && <p className="text-center text-gray-400 text-sm py-6">حضّر أسئلتك هنا باش ما تنساهمش يوم الموعد</p>}
          {questions.map((q) => (
            <div key={q.id} className="card flex items-center gap-3">
              <input
                type="checkbox"
                checked={q.answered}
                onChange={() => setQuestions(questions.map(x => x.id === q.id ? { ...x, answered: !x.answered } : x))}
                className="w-5 h-5 accent-teal-600"
              />
              <p className={`flex-1 text-sm ${q.answered ? 'line-through text-gray-400' : 'text-gray-800'}`}>{q.text}</p>
              <button onClick={() => setQuestions(questions.filter(x => x.id !== q.id))} className="text-red-300 hover:text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
