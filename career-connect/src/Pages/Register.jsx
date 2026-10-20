
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { clearAuthError, register } from '../Redux/Slice/authSlice'

const courses = [
  'Web Development',
  'UI/UX Design',
  'JavaScript',
  'Data Science',
  'Career Development',
]

function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user, status, error } = useSelector((state) => state.auth)

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    course: courses[0],
  })

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    dispatch(clearAuthError())
  }

  function handleSubmit(event) {
    event.preventDefault()

    dispatch(register(form))
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-10">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-8 block text-center text-2xl font-bold tracking-wide text-yellow-400"
        >
          Career<span className="text-white">Connect</span>
        </Link>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl border border-neutral-800 bg-neutral-900 p-6"
        >
          <div>
            <h1 className="text-2xl font-bold text-white">Create your account</h1>
            <p className="mt-2 text-sm text-neutral-400">
              Join as a student and start your assignments.
            </p>
          </div>

          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm text-neutral-300"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full rounded-lg border border-neutral-700 bg-black p-3 text-white outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm text-neutral-300"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-neutral-700 bg-black p-3 text-white outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm text-neutral-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              className="w-full rounded-lg border border-neutral-700 bg-black p-3 text-white outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm text-neutral-300"
            >
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full rounded-lg border border-neutral-700 bg-black p-3 text-white outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label
              htmlFor="course"
              className="mb-2 block text-sm text-neutral-300"
            >
              Course / Track
            </label>
            <select
              id="course"
              name="course"
              value={form.course}
              onChange={handleChange}
              className="w-full rounded-lg border border-neutral-700 bg-black p-3 text-white outline-none focus:border-yellow-400"
            >
              {courses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded-lg bg-yellow-400 px-5 py-3 font-semibold text-black hover:bg-yellow-300 disabled:opacity-50"
          >
            {status === 'loading' ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-neutral-400">
            Already have an account?{' '}
            <Link to="/login" className="text-yellow-400 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register
