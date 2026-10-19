
import { Link } from 'react-router-dom'

function UserHeader() {
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

        <Link
          to="/profile"
          className="flex items-center gap-2 rounded-lg border border-neutral-800 px-3 py-2 text-sm text-yellow-400 hover:border-yellow-400"
        >
          <span>👤</span>
          <span className="hidden sm:inline">My Profile</span>
        </Link>
      </div>
    </header>
  )
}

export default UserHeader
