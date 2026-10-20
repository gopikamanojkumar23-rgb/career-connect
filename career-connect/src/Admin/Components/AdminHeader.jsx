import { useDispatch, useSelector } from 'react-redux'
import { Bell, Menu, UserRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { logout } from '../../Redux/Slice/authSlice'
import { showSuccess } from '../../Services/alert'

function AdminHeader({ onToggleSidebar }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector((state) => state.auth.user)

  function handleLogout() {
    dispatch(logout())

    showSuccess('Signed out', 'See you again soon.')
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-neutral-800 bg-black/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Open navigation"
          className="rounded-lg p-2 text-neutral-300 transition hover:bg-neutral-800 hover:text-yellow-400 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold text-white">
            Welcome, {user?.name ?? 'Admin'}!
          </h1>
          <p className="hidden truncate text-xs text-neutral-500 sm:block">
            Manage your CareerConnect platform
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          to="/admin/notifications"
          aria-label="Notifications"
          className="relative rounded-lg p-2 text-neutral-300 transition hover:bg-neutral-800 hover:text-yellow-400"
        >
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-yellow-400" />
        </Link>

        <div className="hidden h-8 w-px bg-neutral-800 sm:block" />

        <div className="flex items-center gap-2 rounded-lg border border-neutral-800 px-2 py-1.5 sm:px-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-400/10 text-yellow-400">
            <UserRound size={18} />
          </span>

          <span className="hidden sm:block">
            <span className="block text-sm font-medium leading-tight text-white">
              {user?.name ?? 'Admin'}
            </span>
            <span className="block text-xs leading-tight text-neutral-500">
              {user?.role ?? 'Admin'}
            </span>
          </span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-neutral-800 px-3 py-2 text-sm text-neutral-400 transition hover:border-yellow-400 hover:text-yellow-400"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}

export default AdminHeader
