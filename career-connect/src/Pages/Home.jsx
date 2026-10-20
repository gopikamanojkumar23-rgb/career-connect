
import { useSelector } from 'react-redux'
import {
  Bell,
  ClipboardList,
  LayoutDashboard,
  Send,
  ShieldCheck,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const features = [
  {
    icon: ClipboardList,
    title: 'Assignments',
    text: 'Every task for your course in one place, with the deadline and the marks.',
  },
  {
    icon: Send,
    title: 'Submit work',
    text: 'Hand in your work and get feedback from your admin.',
  },
  {
    icon: TrendingUp,
    title: 'Track progress',
    text: 'See how far you have come on every assignment at a glance.',
  },
  {
    icon: Bell,
    title: 'Stay updated',
    text: 'Get notified the moment a new assignment goes live.',
  },
]

const roles = [
  {
    icon: Users,
    title: 'For admins',
    text:
      'Add users, publish assignments, review submissions and keep every learner on track from one panel.',
    action: 'Open the admin panel',
    to: '/admin',
  },
  {
    icon: LayoutDashboard,
    title: 'For students',
    text:
      'Your assignments, your progress and your feedback, all in one simple dashboard.',
    action: 'Go to my dashboard',
    to: '/dashboard',
  },
]

function Home() {
  const user = useSelector((state) => state.auth.user)

  const destination = user
    ? user.role === 'Admin'
      ? '/admin'
      : '/dashboard'
    : '/login'

  return (
    <div className="min-h-screen bg-black text-neutral-200">
      <header className="sticky top-0 z-50 border-b border-neutral-800 bg-black/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="text-xl font-bold tracking-wide text-yellow-400">
            Career<span className="text-white">Connect</span>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to={destination}
                className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-300"
              >
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-300 transition hover:text-yellow-400"
                >
                  Sign in
                </Link>

                <Link
                  to="/register"
                  className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-300"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1.5 text-xs font-medium text-yellow-400">
              <ShieldCheck size={14} />
              One platform for students and admins
            </span>

            <h1 className="mt-6 text-4xl font-bold text-white sm:text-5xl">
              Build your career, one assignment at a time.
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-neutral-400">
              CareerConnect keeps your assignments, progress and feedback in one
              place, and gives admins the tools to keep every learner moving
              forward.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={destination}
                className="rounded-lg bg-yellow-400 px-6 py-3 font-semibold text-black transition hover:bg-yellow-300"
              >
                {user ? 'Go to dashboard' : 'Get started free'}
              </Link>

              <Link
                to="/login"
                className="rounded-lg border border-neutral-700 px-6 py-3 font-semibold text-neutral-200 transition hover:border-yellow-400 hover:text-yellow-400"
              >
                Sign in
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-neutral-800 pt-8">
              {[
                { label: 'Assignments', value: '5' },
                { label: 'Learners', value: '7' },
                { label: 'Completion', value: '78%' },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="text-xs tracking-widest text-neutral-500 uppercase">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 text-2xl font-bold text-yellow-400">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="border-y border-neutral-800 bg-neutral-950">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-2xl font-bold text-white">What you can do</h2>
            <p className="mt-2 text-neutral-400">
              Everything a learner needs, nothing they do not.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon

                return (
                  <div
                    key={feature.title}
                    className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 transition hover:border-yellow-400/60"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400">
                      <Icon size={22} />
                    </span>

                    <h3 className="mt-4 font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-400">
                      {feature.text}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-4 md:grid-cols-2">
            {roles.map((role) => {
              const Icon = role.icon

              return (
                <div
                  key={role.title}
                  className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 transition hover:border-yellow-400/60"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400">
                    <Icon size={24} />
                  </span>

                  <h2 className="mt-5 text-xl font-bold text-white">
                    {role.title}
                  </h2>
                  <p className="mt-2 leading-relaxed text-neutral-400">
                    {role.text}
                  </p>

                  <Link
                    to={role.to}
                    className="mt-6 inline-flex rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-200 transition hover:border-yellow-400 hover:text-yellow-400"
                  >
                    {role.action}
                  </Link>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>CareerConnect v1.0</p>

          <div className="flex gap-5">
            <Link to="/login" className="transition hover:text-yellow-400">
              Sign in
            </Link>
            <Link to="/register" className="transition hover:text-yellow-400">
              Create account
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
