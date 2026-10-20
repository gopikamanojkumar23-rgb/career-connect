import {
  Bell,
  CalendarClock,
  ClipboardList,
  FileBarChart,
  FileCheck,
  LayoutDashboard,
  MessageSquare,
  TrendingUp,
  Users,
  X,
} from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'

const menuItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Assignments', path: '/admin/assignments', icon: ClipboardList },
  { name: 'Study Plan', path: '/admin/study-plan', icon: CalendarClock },
  { name: 'Submissions', path: '/admin/submissions', icon: FileCheck },
  { name: 'Progress', path: '/admin/progress', icon: TrendingUp },
  { name: 'Notifications', path: '/admin/notifications', icon: Bell },
  { name: 'Feedback', path: '/admin/feedback', icon: MessageSquare },
  { name: 'Reports', path: '/admin/reports', icon: FileBarChart },
]

function AdminSidebar({ isOpen = false, onClose }) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 cursor-default bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-neutral-800 bg-neutral-950 transition-transform duration-300 ease-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 border-b border-neutral-800 px-5 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-400 font-bold text-black">
            CC
          </div>

          <div className="min-w-0">
            <p className="truncate text-base font-bold tracking-wide text-white">
              Career<span className="text-yellow-400">Connect</span>
            </p>
            <p className="text-xs uppercase tracking-widest text-neutral-500">
              Admin Panel
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="ml-auto rounded-lg p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-yellow-400 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <p className="px-5 pt-6 pb-2 text-xs font-semibold uppercase tracking-widest text-neutral-500">
          Main Menu
        </p>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {menuItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-yellow-400 text-black'
                      : 'text-neutral-300 hover:bg-neutral-800 hover:text-yellow-400'
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-neutral-800 p-4">
          <Link
            to="/dashboard"
            className="block rounded-lg border border-neutral-800 px-3 py-2 text-center text-sm font-medium text-neutral-300 transition hover:border-yellow-400 hover:text-yellow-400"
          >
            Back to student portal
          </Link>

          <p className="mt-4 text-xs leading-relaxed text-neutral-600">
            CareerConnect v1.0
            <br />
            Admin Management System
          </p>
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar
