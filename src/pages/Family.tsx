import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Heart } from 'lucide-react'
import { familyGuides } from '../data/family'

export default function Family() {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div className="space-y-4 pb-8">
      <div className="flex items-center gap-2 mb-2">
        <Link to="/" className="text-teal-600"><ArrowRight size={20} /></Link>
        <h2 className="text-xl font-bold text-gray-800">دليل العائلة</h2>
      </div>

      <div className="card bg-gradient-to-l from-orange-50 to-white border-orange-200">
        <div className="flex items-start gap-3">
          <Heart className="text-orange-400 mt-1 shrink-0" size={20} />
          <p className="text-sm text-gray-700 leading-relaxed">
            <strong className="text-orange-700">هذا القسم ليك أنت — العائلة.</strong> المرافق يتعب ويحتاج دليل أيضاً. هنا تلقى كيفاش تدعم المريض بالطريقة الصحيحة، وكيفاش تحمي روحك في نفس الوقت.
          </p>
        </div>
      </div>

      {familyGuides.map((guide) => (
        <div key={guide.id} className="card">
          <button
            onClick={() => setOpenId(openId === guide.id ? null : guide.id)}
            className="w-full flex items-center gap-3 text-right"
          >
            <span className="text-2xl">{guide.icon}</span>
            <h3 className="flex-1 font-bold text-gray-800 text-sm">{guide.title}</h3>
            <span className={`text-gray-400 transition-transform ${openId === guide.id ? 'rotate-90' : ''}`}>‹</span>
          </button>

          {openId === guide.id && (
            <ul className="mt-4 space-y-2 border-t border-gray-100 pt-4">
              {guide.content.map((item, i) => (
                <li key={i} className="text-sm text-gray-700 leading-relaxed">{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}
