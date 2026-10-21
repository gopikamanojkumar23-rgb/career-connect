import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CalendarDays, ClipboardList, Save } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

import { AdminPageHeader } from '../Components/AdminUI'
import { createAssignment } from '../../Redux/Slice/assignmentSlice'

const courses = [
  'Web Development',
  'UI/UX Design',
  'JavaScript',
  'Data Science',
  'Career Development',
]

const emptyForm = {
  title: '',
  description: '',
  course: courses[0],
  deadline: '',
  maxMarks: '100',
}

function CreateAssignments() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { status, error } = useSelector((state) => state.assignments)

  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    setFormError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.title.trim()) {
      setFormError('Assignment title is required.')
      return
    }

    if (!form.deadline) {
      setFormError('Please pick a deadline for this assignment.')
      return
    }

    try {
      await dispatch(
        createAssignment({
          title: form.title.trim(),
          description: form.description.trim(),
          course: form.course,
          deadline: form.deadline,
          maxMarks: form.maxMarks,
        }),
      ).unwrap()

      Swal.fire({
        icon: 'success',
        title: 'Assignment created',
        text: 'Your learners can see it now.',
      })

      navigate('/admin/assignments')
    } catch (error) {
      setFormError(error)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-neutral-700 bg-black p-3 text-white outline-none placeholder:text-neutral-600 focus:border-yellow-400'

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader
        eyebrow="Content"
        title="Create Assignment"
        description="Publish a new task for your learners and set the deadline they need to hit."
        actions={
          <Link
            to="/admin/assignments"
            className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:border-yellow-400 hover:text-yellow-400"
          >
            Back to assignments
          </Link>
        }
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-neutral-800 bg-neutral-900 p-6"
      >
        <div>
          <label htmlFor="title" className="mb-2 block text-sm text-neutral-300">
            Assignment Title
          </label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Portfolio Website"
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm text-neutral-300"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="5"
            value={form.description}
            onChange={handleChange}
            placeholder="Explain what the learner has to build and how it will be evaluated"
            className={inputClass}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
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
              className={inputClass}
            >
              {courses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="deadline"
              className="mb-2 block text-sm text-neutral-300"
            >
              Deadline
            </label>
            <input
              id="deadline"
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="maxMarks"
            className="mb-2 block text-sm text-neutral-300"
          >
            Maximum Marks
          </label>
          <input
            id="maxMarks"
            name="maxMarks"
            type="number"
            min="1"
            value={form.maxMarks}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {formError && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {formError}
          </p>
        )}

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 border-t border-neutral-800 pt-5">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-300 disabled:opacity-50"
          >
            <Save size={16} />
            {status === 'loading' ? 'Creating...' : 'Create Assignment'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/admin/assignments')}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-300 transition hover:border-neutral-500 hover:text-white"
          >
            <ClipboardList size={16} />
            Cancel
          </button>

          <span className="inline-flex items-center gap-2 text-xs text-neutral-600">
            <CalendarDays size={14} />
            Learners are notified once published
          </span>
        </div>
      </form>
    </div>
  )
}

export default CreateAssignments
