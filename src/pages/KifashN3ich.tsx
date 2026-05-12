import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { tips } from '../data/tips'

export default function KifashN3ich() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Link to="/" className="text-teal-600"><ArrowRight size={20} /></Link>
        <h2 className="text-xl font-bold text-gray-800">كيفاش نعيش اليوم؟</h2>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        نصائح عملية يومية باش تعيش أحسن مع العلاج.
      </p>

      {tips.map((tip) => (
        <Link key={tip.id} to={`/kifash-n3ich/${tip.id}`} className="block">
          <div className="card flex items-center gap-4">
            <span className="text-3xl">{tip.icon}</span>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">{tip.title}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{tip.category}</p>
            </div>
            <span className="text-gray-300">‹</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
