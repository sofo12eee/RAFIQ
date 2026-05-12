import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Heart, BookOpen, Salad, ClipboardList, Users } from 'lucide-react'

const navItems = [
  { path: '/', icon: Heart, label: 'الرئيسية' },
  { path: '/wash-rah-ysrali', icon: BookOpen, label: 'واش راح يصرالي' },
  { path: '/kifash-n3ich', icon: Salad, label: 'كيفاش نعيش' },
  { path: '/sijil', icon: ClipboardList, label: 'سجلي' },
  { path: '/msh-wahdek', icon: Users, label: 'ما راكش وحدك' },
]

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen pb-20 max-w-md mx-auto">
      {/* Header */}
      {location.pathname === '/' && (
        <header className="bg-gradient-to-b from-teal-600 to-teal-500 text-white px-6 pt-10 pb-8 rounded-b-3xl shadow-lg">
          <div className="text-center">
            <div className="text-5xl mb-3">💚</div>
            <h1 className="text-3xl font-bold mb-2">رفيق</h1>
            <p className="text-teal-100 text-sm leading-relaxed">
              كل ما لم يقوله لك الطبيب، تلقاه هنا
            </p>
          </div>
        </header>
      )}

      {/* Content */}
      <main className="px-4 pt-4">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-teal-100 shadow-lg z-50">
        <div className="max-w-md mx-auto flex justify-around py-2">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all text-xs ${
                  isActive
                    ? 'text-teal-600 font-bold'
                    : 'text-gray-400'
                }`
              }
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
