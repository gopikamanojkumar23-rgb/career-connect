
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { ROLES } from '../Redux/Slice/authSlice'

const points = [
  {
    title: 'Assignments',
    text: 'Every task with its deadline and marks.',
  },
  {
    title: 'Projects',
    text: 'Track what you are building and how far you are.',
  },
  {
    title: 'Exams',
    text: 'Exam dates, times and venues in one place.',
  },
  {
    title: 'Tasks',
    text: 'Small steps, checked off one by one.',
  },
]

function Home() {
  const user = useSelector((state) => state.auth.user)

  const destination = user
    ? user.role === ROLES.ADMIN
      ? '/admin'
      : '/dashboard'
    : '/login'

  return (
    <div className="min-h-screen bg-black text-neutral-200">
      <header className="border-b border-neutral-800">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            to="/"
            className="text-xl font-bold tracking-wide text-yellow-400"
          >
            Career<span className="text-white">Connect</span>
          </Link>

          {user ? (
            <Link
              to={destination}
              className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-300"
            >
              Dashboard
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-neutral-300 transition hover:text-yellow-400"
              >
                Sign in
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-300"
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <h1 className="max-w-2xl text-4xl font-bold text-white sm:text-5xl">
          Everything a student needs, in one place.
        </h1>

        <p className="mt-5 max-w-xl text-lg leading-relaxed text-neutral-400">
          Assignments, projects, exams and tasks. Track what is done, what is
          due and what comes next.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={destination}
            className="rounded-lg bg-yellow-400 px-6 py-3 font-semibold text-black transition hover:bg-yellow-300"
          >
            {user ? 'Go to dashboard' : 'Get started free'}
          </Link>

          {!user && (
            <Link
              to="/login"
              className="rounded-lg border border-neutral-700 px-6 py-3 font-semibold text-neutral-200 transition hover:border-yellow-400 hover:text-yellow-400"
            >
              Sign in
            </Link>
          )}
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((point) => (
            <div
              key={point.title}
              className="rounded-xl border border-neutral-800 bg-neutral-900 p-5"
            >
              <h2 className="font-semibold text-yellow-400">{point.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-neutral-400">
                {point.text}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-neutral-800">
        <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-neutral-500 sm:px-6">
          CareerConnect v1.0
        </div>
      </footer>
    </div>
  )
}

export default Home
