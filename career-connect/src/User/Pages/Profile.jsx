
import { useState } from 'react'

function Profile() {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'User',
    skills: '',
  })

  const [saved, setSaved] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setProfile((current) => ({
      ...current,
      [name]: value,
    }))

    setSaved(false)
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSaved(true)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-yellow-400">My Profile</h1>
        <p className="mt-2 text-neutral-400">
          Update your personal information.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-neutral-800 bg-neutral-900 p-6"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-400 text-3xl font-bold text-black">
          👤
        </div>

        <div>
          <label className="mb-2 block text-sm text-neutral-300">
            Full Name
          </label>
          <input
            required
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full rounded-lg border border-neutral-700 bg-black p-3 text-white outline-none focus:border-yellow-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-neutral-300">
            Email
          </label>
          <input
            required
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full rounded-lg border border-neutral-700 bg-black p-3 text-white outline-none focus:border-yellow-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-neutral-300">
            Phone
          </label>
          <input
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="w-full rounded-lg border border-neutral-700 bg-black p-3 text-white outline-none focus:border-yellow-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-neutral-300">
            Skills
          </label>
          <textarea
            name="skills"
            value={profile.skills}
            onChange={handleChange}
            placeholder="Example: HTML, CSS, React"
            rows="3"
            className="w-full rounded-lg border border-neutral-700 bg-black p-3 text-white outline-none focus:border-yellow-400"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-yellow-400 px-5 py-3 font-semibold text-black hover:bg-yellow-300"
        >
          Save Profile
        </button>

        {saved && (
          <p className="text-sm text-yellow-400">
            Profile saved in this page's current state only. Backend saving is not connected.
          </p>
        )}
      </form>
    </div>
  )
}

export default Profile
