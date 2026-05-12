import { useParams, Link } from 'react-router-dom'
import { ArrowRight, AlertTriangle, CheckCircle, Lightbulb, Clock } from 'lucide-react'
import { treatments } from '../data/treatments'

export default function TreatmentDetail() {
  const { id } = useParams()
  const treatment = treatments.find((t) => t.id === id)

  if (!treatment) {
    return <p className="text-center py-10">ما لقيناش هذا العلاج</p>
  }

  return (
    <div className="space-y-4 pb-8">
      <div className="flex items-center gap-2 mb-2">
        <Link to="/wash-rah-ysrali" className="text-teal-600"><ArrowRight size={20} /></Link>
        <h2 className="text-lg font-bold text-gray-800">{treatment.icon} {treatment.title}</h2>
      </div>

      <div className="card bg-teal-50 border-teal-200">
        <p className="text-sm text-gray-700 leading-relaxed">{treatment.summary}</p>
        <div className="flex items-center gap-2 mt-3 text-xs text-teal-700">
          <Clock size={14} />
          <span>{treatment.duration}</span>
        </div>
      </div>

      {/* What happens */}
      <div className="card">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span className="text-blue-500">📋</span> واش راح يصرا؟
        </h3>
        <ul className="space-y-2">
          {treatment.whatHappens.map((item, i) => (
            <li key={i} className="text-sm text-gray-600 flex gap-2">
              <span className="text-blue-400 shrink-0">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Normal symptoms */}
      <div className="card border-green-100">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <CheckCircle size={18} className="text-green-500" /> أعراض طبيعية (ما تخافش)
        </h3>
        <ul className="space-y-2">
          {treatment.normalSymptoms.map((item, i) => (
            <li key={i} className="text-sm text-gray-600 flex gap-2">
              <span className="text-green-400 shrink-0">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* When to worry */}
      <div className="card border-red-100 bg-red-50">
        <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2">
          <AlertTriangle size={18} className="text-red-500" /> ⚠️ روح للطبيب فوراً إذا:
        </h3>
        <ul className="space-y-2">
          {treatment.whenToWorry.map((item, i) => (
            <li key={i} className="text-sm text-red-700 flex gap-2">
              <span className="shrink-0">🚨</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Tips */}
      <div className="card border-amber-100">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Lightbulb size={18} className="text-amber-500" /> نصائح عملية
        </h3>
        <ul className="space-y-2">
          {treatment.tips.map((item, i) => (
            <li key={i} className="text-sm text-gray-600 flex gap-2">
              <span className="text-amber-400 shrink-0">💡</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
