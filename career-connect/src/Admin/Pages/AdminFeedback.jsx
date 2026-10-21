import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CheckCircle2, MessageSquare, Reply, Star, Trash2 } from 'lucide-react'
import Swal from 'sweetalert2'

import { AdminPageHeader, AdminStatCard, StatusBadge } from '../Components/AdminUI'
import { deleteFeedback, updateFeedback } from '../../Redux/Slice/feedbackSlice'
import { formatDate } from '../../Redux/selectors'

function AdminFeedback() {
  const dispatch = useDispatch()

  const { items: feedback } = useSelector((state) => state.feedback)

  const [activeId, setActiveId] = useState(null)
  const [reply, setReply] = useState('')

  const stats = useMemo(() => {
    const average = feedback.length
      ? (
          feedback.reduce((sum, item) => sum + (item.rating || 0), 0) /
          feedback.length
        ).toFixed(1)
      : '0.0'

    return {
      total: feedback.length,
      open: feedback.filter((item) => !item.reply).length,
      average,
    }
  }, [feedback])

  function openReply(item) {
    setActiveId(item.id)
    setReply(item.reply || '')
  }

  async function sendReply() {
    if (activeId === null) return

    await dispatch(
      updateFeedback({ id: activeId, reply: reply.trim() }),
    ).unwrap()

    setActiveId(null)
    setReply('')

    Swal.fire('Reply sent to the student')
  }

  async function removeFeedback(item) {
    await dispatch(deleteFeedback(item.id)).unwrap()

    Swal.fire('Feedback removed')
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Voice of the learner"
        title="Feedback"
        description="What the students are telling you. Reply so they know it was read."
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AdminStatCard
          title="Total Feedback"
          value={stats.total}
          icon={MessageSquare}
          tone="yellow"
        />
        <AdminStatCard
          title="Awaiting Reply"
          value={stats.open}
          icon={Reply}
          tone="orange"
        />
        <AdminStatCard
          title="Average Rating"
          value={stats.average}
          icon={Star}
          tone="green"
        />
      </section>

      {feedback.length === 0 ? (
        <section className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900 p-12 text-center">
          <MessageSquare size={28} className="mx-auto text-neutral-600" />
          <h2 className="mt-4 text-lg font-semibold text-white">No feedback yet</h2>
          <p className="mt-2 text-sm text-neutral-500">
            Students can send feedback from their dashboard.
          </p>
        </section>
      ) : (
        <section className="space-y-4">
          {feedback.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-neutral-800 bg-neutral-900 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-white">
                      {item.studentName}
                    </h2>
                    <StatusBadge value={item.reply ? 'Resolved' : 'Open'} />
                  </div>

                  <p className="mt-1 text-xs text-neutral-500">
                    {item.subject} · {item.course} ·{' '}
                    {formatDate(item.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={15}
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

              <p className="mt-4 rounded-lg border border-neutral-800 bg-neutral-950 p-4 text-sm leading-relaxed text-neutral-300">
                {item.message}
              </p>

              {item.reply && (
                <p className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm leading-relaxed text-neutral-300">
                  <span className="font-medium text-emerald-400">
                    Your reply:{' '}
                  </span>
                  {item.reply}
                </p>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-neutral-800 pt-4">
                <button
                  type="button"
                  onClick={() => openReply(item)}
                  className="inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-3 py-2 text-xs font-semibold text-black transition hover:bg-yellow-300"
                >
                  <Reply size={14} />
                  {item.reply ? 'Edit reply' : 'Reply'}
                </button>

                {!item.reply && (
                  <button
                    type="button"
                    onClick={() =>
                      dispatch(
                        updateFeedback({
                          id: item.id,
                          reply: 'Thanks for the feedback, we will get back to you soon.',
                        }),
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 px-3 py-2 text-xs font-medium text-neutral-300 transition hover:border-yellow-400 hover:text-yellow-400"
                  >
                    <CheckCircle2 size={14} />
                    Mark resolved
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => removeFeedback(item)}
                  aria-label={`Remove feedback from ${item.studentName}`}
                  className="ml-auto rounded-lg p-2 text-neutral-400 transition hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {activeId === item.id && (
                <div className="mt-4 rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
                  <label
                    htmlFor={`reply-${item.id}`}
                    className="mb-2 block text-sm text-neutral-300"
                  >
                    Reply to {item.studentName}
                  </label>

                  <textarea
                    id={`reply-${item.id}`}
                    rows="4"
                    value={reply}
                    onChange={(event) => setReply(event.target.value)}
                    placeholder="Write your reply..."
                    className="w-full rounded-lg border border-neutral-700 bg-black p-3 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-yellow-400"
                  />

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={sendReply}
                      className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-300"
                    >
                      Send reply
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveId(null)}
                      className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:border-neutral-500 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </section>
      )}
    </div>
  )
}

export default AdminFeedback
