
import { useState } from 'react'

function SubmitWork() {
  const [form, setForm] = useState({
    assignment: '',
    description: '',
    link: '',
  })

  const [submitted, setSubmitted] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    setSubmitted(false)
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-yellow-400">Submit Work</h1>
        <p className="mt-2 text-neutral-400">
          Provide the details of your completed assignment.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-neutral-800 bg-neutral-900 p-6"
      >
        <div>
          <label className="mb-2 block text-sm text-neutral-300">
            Assignment Name
          </label>
          <input
            required
            name="assignment"
            value={form.assignment}
            onChange={handleChange}
            placeholder="Enter assignment name"
            className="w-full rounded-lg border border-neutral-700 bg-black p-3 text-white outline-none focus:border-yellow-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-neutral-300">
            Work Description
          </label>
          <textarea
            required
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="5"
            placeholder="Describe your completed work"
            className="w-full rounded-lg border border-neutral-700 bg-black p-3 text-white outline-none focus:border-yellow-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-neutral-300">
            Project Link (optional)
          </label>
          <input
            type="url"
            name="link"
            value={form.link}
            onChange={handleChange}
            placeholder="https://github.com/..."
            className="w-full rounded-lg border border-neutral-700 bg-black p-3 text-white outline-none focus:border-yellow-400"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-yellow-400 px-5 py-3 font-semibold text-black hover:bg-yellow-300"
        >
          Submit Assignment
        </button>

        {submitted && (
          <p className="text-sm text-yellow-400">
            Demo submission complete. Your work has not been sent to a server.
          </p>
        )}
      </form>
    </div>
  )
}

export default SubmitWork
