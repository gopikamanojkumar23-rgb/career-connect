
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { updateUser } from '../../Redux/Slice/userSlice'
import Swal from 'sweetalert2'

const courses = [
  'Web Development',
  'UI/UX Design',
  'JavaScript',
  'Data Science',
  'Career Development',
]

function ProfileForm({ user }) {
  const dispatch = useDispatch()

  const [profile, setProfile] = useState({
    fullName: user.name,
    email: user.email,
    phone: user.phone || '',
    course: user.course,
  })

  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target

    setProfile((current) => ({
      ...current,
      [name]: value,
    }))

    setSaved(false)
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      await dispatch(
        updateUser({
          id: user.id,
          name: profile.fullName.trim(),
          email: profile.email.trim(),
          phone: profile.phone.trim(),
          course: profile.course,
        }),
      ).unwrap()

      Swal.fire({
        icon: 'success',
        title: 'Profile saved',
        text: 'The admin panel sees the same record.',
      })

      setSaved(true)
    } catch (error) {
      setError(error)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-neutral-800 bg-neutral-900 p-6"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-400 text-3xl font-bold text-black">
        👤
      </div>

      <div>
        <label
          htmlFor="fullName"
          className="mb-2 block text-sm text-neutral-300"
        >
          Full Name
        </label>
        <input
          required
          id="fullName"
          name="fullName"
          value={profile.fullName}
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
          required
          id="email"
          name="email"
          type="email"
          value={profile.email}
          onChange={handleChange}
          placeholder="Enter your email"
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
          value={profile.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
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
          value={profile.course}
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

      <div>
        <p className="mb-2 text-sm text-neutral-300">Role</p>
        <p className="inline-block rounded-full bg-yellow-400/10 px-3 py-1 text-sm text-yellow-400">
          {user.role}
        </p>
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="rounded-lg bg-yellow-400 px-5 py-3 font-semibold text-black hover:bg-yellow-300"
      >
        Save Profile
      </button>

      {saved && (
        <p className="text-sm text-yellow-400">
          Profile saved. The admin panel sees the same record.
        </p>
      )}
    </form>
  )
}

function Profile() {
  const user = useSelector((state) => state.auth.user)

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-yellow-400">My Profile</h1>
        <p className="mt-2 text-neutral-400">
          Update your personal information.
        </p>
      </div>

      {user ? (
        <ProfileForm key={user.id} user={user} />
      ) : (
        <p className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900 p-12 text-center text-sm text-neutral-500">
          Sign in to manage your profile.
        </p>
      )}
    </div>
  )
}

export default Profile
