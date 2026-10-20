import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { logout } from '../../Redux/Slice/authSlice'

function UserHeader() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector((state) => state.auth.user)

  function handleLogout() {
    dispatch(logout())

    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-yellow-500/20 bg-black px-4 sm:px-6">
      <Link to="/" className="text-2xl font-bold tracking-wide text-yellow-400">
        Career<span className="text-white">Connect</span>
      </Link>

      <div className="flex items-center gap-4">
        <Link
          to="/notifications"
          className="rounded-lg p-2 text-yellow-400 transition hover:bg-yellow-400 hover:text-black"
          aria-label="Notifications"
        >
          🔔
        </Link>

        {user?.role === 'Admin' && (
          <Link
            to="/admin"
            className="rounded-lg border border-yellow-500/20 px-3 py-2 text-sm text-yellow-400 transition hover:bg-yellow-400 hover:text-black"
          >
            Admin Panel
          </Link>
        )}

        <Link
          to="/profile"
          className="flex items-center gap-2 rounded-lg border border-neutral-800 px-3 py-2 text-sm text-yellow-400 hover:border-yellow-400"
        >
          <span>👤</span>
          <span className="hidden sm:inline">{user?.name}</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="hidden rounded-lg border border-neutral-800 px-3 py-2 text-sm text-neutral-400 transition hover:border-yellow-400 hover:text-yellow-400 sm:block"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}

export default UserHeader
