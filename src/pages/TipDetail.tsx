import { useParams, Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { tips } from '../data/tips'

export default function TipDetail() {
  const { id } = useParams()
  const tip = tips.find((t) => t.id === id)

  if (!tip) {
    return <p className="text-center py-10">ما لقيناش هذا القسم</p>
  }

  return (
    <div className="space-y-4 pb-8">
      <div className="flex items-center gap-2 mb-2">
        <Link to="/kifash-n3ich" className="text-teal-600"><ArrowRight size={20} /></Link>
        <h2 className="text-lg font-bold text-gray-800">{tip.icon} {tip.title}</h2>
      </div>

      <div className="card">
        <ul className="space-y-3">
          {tip.content.map((item, i) => (
            <li key={i} className="text-sm text-gray-700 leading-relaxed border-b border-gray-50 pb-2 last:border-0">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
