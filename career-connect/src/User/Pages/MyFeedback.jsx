
import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MessageSquare, Send, Star } from 'lucide-react'
import Swal from 'sweetalert2'

import { createFeedback } from '../../Redux/Slice/feedbackSlice'
import { formatDate } from '../../Redux/selectors'

const subjects = ['Assignment Feedback', 'Course Content', 'Support', 'General']

function MyFeedback() {
  const dispatch = useDispatch()

  const user = useSelector((state) => state.auth.user)
  const { items: feedback } = useSelector((state) => state.feedback)

  const [form, setForm] = useState({
    subject: subjects[0],
    rating: 5,
    message: '',
  })

  const [error, setError] = useState('')

  const myFeedback = useMemo(() => {
    if (!user) return []

    return feedback.filter((item) => item.studentId === user.id)
  }, [feedback, user])

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.message.trim()) {
      setError('Please write your feedback first.')
      return
    }

    try {
      await dispatch(
        createFeedback({
          studentId: user.id,
          studentName: user.name,
          course: user.course,
          subject: form.subject,
          rating: Number(form.rating),
          message: form.message.trim(),
        }),
      ).unwrap()

      setForm({ subject: subjects[0], rating: 5, message: '' })

      Swal.fire({
        icon: 'success',
        title: 'Feedback sent',
        text: 'The admin will read it.',
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Could not send the feedback',
        text: error,
      })
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-yellow-400">My Feedback</h1>
        <p className="mt-2 text-neutral-400">
          Tell the admin what is working and what is not.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-neutral-800 bg-neutral-900 p-6"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="subject"
              className="mb-2 block text-sm text-neutral-300"
            >
              About
            </label>
            <select
              id="subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full rounded-lg border border-neutral-700 bg-black p-3 text-white outline-none focus:border-yellow-400"
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="mb-2 block text-sm text-neutral-300">Rating</span>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setForm((current) => ({ ...current, rating: star }))
                  }
                  aria-label={`${star} star${star === 1 ? '' : 's'}`}
                  className="p-1 transition hover:scale-110"
                >
                  <Star
                    size={22}
                    className={
                      star <= form.rating
                        ? 'text-yellow-400'
                        : 'text-neutral-700'
                    }
                    fill={star <= form.rating ? 'currentColor' : 'none'}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm text-neutral-300"
          >
            Your feedback
          </label>
          <textarea
            id="message"
            name="message"
            rows="5"
            value={form.message}
            onChange={handleChange}
            placeholder="What went well, what could be better?"
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
          className="inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-5 py-3 font-semibold text-black hover:bg-yellow-300"
        >
          <Send size={16} />
          Send Feedback
        </button>
      </form>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-yellow-400">
          What you have sent
        </h2>

        {myFeedback.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900 p-10 text-center text-sm text-neutral-500">
            You have not sent any feedback yet.
          </p>
        ) : (
          myFeedback.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-neutral-800 bg-neutral-900 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-yellow-400" />
                  <span className="font-medium text-white">{item.subject}</span>
                </div>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      className={
                        star <= item.rating
                          ? 'text-yellow-400'
                          : 'text-neutral-700'
                      }
                      fill={star <= item.rating ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-neutral-300">
                {item.message}
              </p>

              {item.reply && (
                <p className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm leading-relaxed text-neutral-300">
                  <span className="font-medium text-emerald-400">
                    Admin reply:{' '}
                  </span>
                  {item.reply}
                </p>
              )}

              <p className="mt-3 text-xs text-neutral-500">
                Sent on {formatDate(item.createdAt)}
              </p>
            </article>
          ))
        )}
      </section>
    </div>
  )
}

export default MyFeedback
