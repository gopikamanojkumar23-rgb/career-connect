import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowLeft } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

import { clearAuthError, login, loginWithGoogle, ROLES } from '../Redux/Slice/authSlice'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

// Reads the profile out of the credential Google returns. The signature is
// checked by Google on the backend once a real auth server is connected.
function decodeGoogleProfile(credential) {
  try {
    const payload = credential.split('.')[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')

    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(''),
    )

    const profile = JSON.parse(json)

    return {
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
    }
  } catch {
    return null
  }
}

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const { user, status, error } = useSelector((state) => state.auth)

  const googleButtonRef = useRef(null)

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    if (user) {
      navigate(user.role === ROLES.ADMIN ? '/admin' : '/dashboard', {
        replace: true,
      })
    }
  }, [user, navigate])

  const handleGoogleCredential = useCallback(
    (response) => {
      const profile = decodeGoogleProfile(response.credential)

      if (!profile) {
        Swal.fire('Could not read the Google account')
        return
      }

      dispatch(loginWithGoogle(profile))
        .unwrap()
        .then((user) => {
          Swal.fire({
            icon: 'success',
            title: 'Signed in with Google',
            text: `Welcome back, ${user.name}`,
          })
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Google sign-in failed',
            text: error,
          })
        })
    },
    [dispatch],
  )

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current) return undefined

    function renderButton() {
      if (!window.google || !googleButtonRef.current) return

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredential,
      })

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'filled_black',
        size: 'large',
        width: 320,
        text: 'continue_with',
        shape: 'rectangular',
      })
    }

    if (window.google) {
      renderButton()

      return undefined
    }

    const script = document.querySelector(
      'script[src*="accounts.google.com/gsi/client"]',
    )

    script?.addEventListener('load', renderButton)

    return () => script?.removeEventListener('load', renderButton)
  }, [handleGoogleCredential])

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

    dispatch(login(form))
      .unwrap()
      .then((user) => {
        Swal.fire({
          icon: 'success',
          title: 'Logged in successfully',
          text: `Welcome back, ${user.name}`,
        })
      })
      .catch(() => {
        // The form already shows the error message.
      })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-10">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-400 transition hover:text-yellow-400"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

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
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="mt-2 text-sm text-neutral-400">
              Sign in to continue to your dashboard.
            </p>
          </div>

          {location.state?.registered && (
            <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
              Your account is ready. Sign in to continue.
            </p>
          )}

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
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-neutral-700 bg-black p-3 text-white outline-none focus:border-yellow-400"
            />
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
            {status === 'loading' ? 'Signing in...' : 'Sign In'}
          </button>

          {googleClientId && (
            <>
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-neutral-800" />
                <span className="text-xs text-neutral-500">or</span>
                <span className="h-px flex-1 bg-neutral-800" />
              </div>

              <div className="flex min-h-[44px] items-center justify-center">
                <div ref={googleButtonRef} />
              </div>
            </>
          )}

          <p className="text-center text-sm text-neutral-400">
            New to CareerConnect?{' '}
            <Link to="/register" className="text-yellow-400 hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
