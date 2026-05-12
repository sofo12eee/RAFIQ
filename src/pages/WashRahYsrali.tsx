import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { treatments } from '../data/treatments'

export default function WashRahYsrali() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Link to="/" className="text-teal-600"><ArrowRight size={20} /></Link>
        <h2 className="text-xl font-bold text-gray-800">واش راح يصرالي؟</h2>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        اختار نوع العلاج تاعك باش نشرحلك واش راح يصرا، واش طبيعي، واش لازم تنتبه منه.
      </p>

      {treatments.map((t) => (
        <Link key={t.id} to={`/wash-rah-ysrali/${t.id}`} className="block">
          <div className="card flex items-center gap-4">
            <span className="text-3xl">{t.icon}</span>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">{t.title}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{t.summary}</p>
            </div>
            <span className="text-gray-300">‹</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
