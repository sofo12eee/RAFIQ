import { Link } from 'react-router-dom'
import { BookOpen, Salad, ClipboardList, Users, Sparkles, HeartHandshake, Megaphone } from 'lucide-react'

const sections = [
  {
    path: '/wash-rah-ysrali',
    icon: BookOpen,
    title: 'واش راح يصرالي؟',
    desc: 'شرح كل مرحلة من العلاج بالدارجة',
    color: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  {
    path: '/kifash-n3ich',
    icon: Salad,
    title: 'كيفاش نعيش اليوم؟',
    desc: 'أكل، نوم، ألم، أعراض... نصائح عملية',
    color: 'bg-amber-50 text-amber-600 border-amber-100',
  },
  {
    path: '/sijil',
    icon: ClipboardList,
    title: 'سجلي الشخصي',
    desc: 'مواعيدك، أعراضك، وأسئلة للطبيب',
    color: 'bg-purple-50 text-purple-600 border-purple-100',
  },
  {
    path: '/msh-wahdek',
    icon: Users,
    title: 'ما راكش وحدك',
    desc: 'دعم نفسي، قصص ناجين، ورسائل تطمين',
    color: 'bg-rose-50 text-rose-600 border-rose-100',
  },
  {
    path: '/family',
    icon: HeartHandshake,
    title: 'دليل العائلة',
    desc: 'كيفاش تدعم المريض وتحمي روحك',
    color: 'bg-orange-50 text-orange-600 border-orange-100',
  },
  {
    path: '/sawt-el-mrid',
    icon: Megaphone,
    title: 'صوت المريض',
    desc: 'شاركو تجاربكم وشكاويكم بكل شفافية',
    color: 'bg-red-50 text-red-600 border-red-100',
  },
]

export default function Home() {
  return (
    <div className="space-y-4">
      {/* Welcome message */}
      <div className="card bg-gradient-to-l from-teal-50 to-white border-teal-200">
        <div className="flex items-start gap-3">
          <Sparkles className="text-teal-500 mt-1 shrink-0" size={22} />
          <div>
            <p className="text-gray-700 text-sm leading-relaxed">
              <strong className="text-teal-700">مرحبا بيك.</strong> هنا مش مستشفى، هنا مكان يفهمك. كل ما تحتاجه باش تفهم واش راه يصرالك وكيفاش تعيش يومك، تلقاه هنا.
            </p>
          </div>
        </div>
      </div>

      {/* Section cards */}
      {sections.map(({ path, icon: Icon, title, desc, color }) => (
        <Link key={path} to={path} className="block">
          <div className={`card border ${color} flex items-center gap-4`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 text-base">{title}</h3>
              <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
            </div>
            <span className="text-gray-300 text-xl">‹</span>
          </div>
        </Link>
      ))}

      {/* Footer note */}
      <p className="text-center text-xs text-gray-400 pt-4 pb-8">
        رفيق — مشروع خيري لفائدة جمعية البر الخيرية لرعاية مرضى السرطان المسيلة 💚
      </p>
    </div>
  )
}
