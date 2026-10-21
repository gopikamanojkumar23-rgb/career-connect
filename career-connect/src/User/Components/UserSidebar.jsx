import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
  { name: 'My Assignments', path: '/assignments', icon: '📋' },
  { name: 'My Progress', path: '/progress', icon: '📊' },
  { name: 'Notifications', path: '/notifications', icon: '🔔' },
  { name: 'Profile', path: '/profile', icon: '👤' },
  { name: 'Submit Work', path: '/submit-work', icon: '📤' },
]

function UserSlidebar() {
  const user = useSelector((state) => state.auth.user)

  const items =
    user?.role === 'Admin'
      ? [...menuItems, { name: 'Admin Panel', path: '/admin', icon: '🛠️' }]
      : menuItems

  return (
    <aside className="min-h-[calc(100vh-4rem)] w-56 shrink-0 border-r border-yellow-500/20 bg-neutral-950 p-4 max-sm:w-16 max-sm:px-2">
      <p className="mb-5 px-2 text-xs font-semibold uppercase tracking-widest text-neutral-500 max-sm:hidden">
        User Menu
      </p>

      <nav className="space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            title={item.name}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-yellow-400 text-black'
                  : 'text-neutral-300 hover:bg-neutral-800 hover:text-yellow-400'
              }`
            }
          >
            <span>{item.icon}</span>
            <span className="max-sm:hidden">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-10 rounded-lg border border-neutral-800 p-3 max-sm:hidden">
        <p className="text-sm font-semibold text-yellow-400">
          CareerConnect
        </p>
        <p className="mt-1 text-xs text-neutral-500">
          Manage your career journey.
        </p>
      </div>
    </aside>
  )
}

export default UserSlidebar
