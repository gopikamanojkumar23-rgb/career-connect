import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'

import { createSubmission } from '../../Redux/Slice/submissionSlice'

function SubmitWork() {
  const dispatch = useDispatch()

  const user = useSelector((state) => state.auth.user)
  const { items: assignments } = useSelector((state) => state.assignments)

  const [form, setForm] = useState({
    assignmentId: '',
    description: '',
    link: '',
  })

  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const myAssignments = useMemo(() => {
    if (!user) return []

    return assignments.filter((item) => item.course === user.course)
  }, [assignments, user])

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    setSubmitted(false)
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const assignment = myAssignments.find(
      (item) => String(item.id) === form.assignmentId,
    )

    if (!assignment) {
      setError('Please choose an assignment to submit for.')
      return
    }

    try {
      await dispatch(
        createSubmission({
          assignmentId: assignment.id,
          studentId: user.id,
          studentName: user.name,
          assignmentTitle: assignment.title,
          course: assignment.course,
          description: form.description.trim(),
          link: form.link.trim(),
        }),
      ).unwrap()

      Swal.fire({
        icon: 'success',
        title: 'Work submitted',
        text: 'The admin can review it right away.',
      })

      setSubmitted(true)
      setForm({ assignmentId: '', description: '', link: '' })
    } catch (error) {
      setError(error)
    }
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
          <label
            htmlFor="assignmentId"
            className="mb-2 block text-sm text-neutral-300"
          >
            Assignment Name
          </label>
          <select
            required
            id="assignmentId"
            name="assignmentId"
            value={form.assignmentId}
            onChange={handleChange}
            className="w-full rounded-lg border border-neutral-700 bg-black p-3 text-white outline-none focus:border-yellow-400"
          >
            <option value="">Select an assignment</option>

            {myAssignments.map((assignment) => (
              <option key={assignment.id} value={assignment.id}>
                {assignment.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm text-neutral-300"
          >
            Work Description
          </label>
          <textarea
            required
            id="description"
            name="description"
            rows="5"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe your completed work"
            className="w-full rounded-lg border border-neutral-700 bg-black p-3 text-white outline-none focus:border-yellow-400"
          />
        </div>

        <div>
          <label
            htmlFor="link"
            className="mb-2 block text-sm text-neutral-300"
          >
            Project Link (optional)
          </label>
          <input
            id="link"
            name="link"
            type="url"
            value={form.link}
            onChange={handleChange}
            placeholder="https://github.com/..."
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
          className="rounded-lg bg-yellow-400 px-5 py-3 font-semibold text-black hover:bg-yellow-300"
        >
          Submit Assignment
        </button>

        {submitted && (
          <p className="text-sm text-yellow-400">
            Work submitted. The admin panel can review it right away.
          </p>
        )}
      </form>
    </div>
  )
}

export default SubmitWork
