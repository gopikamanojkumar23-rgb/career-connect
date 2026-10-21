import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CheckCircle2, MessageSquare, Reply, Star } from 'lucide-react'

import { AdminPageHeader, AdminStatCard, StatusBadge } from '../Components/AdminUI'
import { updateSubmission } from '../../Redux/Slice/submissionSlice'
import { formatDate, getInitials } from '../../Redux/selectors'

const avatarTones = [
  'bg-yellow-400/15 text-yellow-400',
  'bg-sky-500/15 text-sky-400',
  'bg-emerald-500/15 text-emerald-400',
  'bg-violet-500/15 text-violet-400',
  'bg-orange-500/15 text-orange-400',
  'bg-rose-500/15 text-rose-400',
]

function getTone(name = '') {
  const total = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)

  return avatarTones[total % avatarTones.length]
}

function AdminFeedback() {
  const dispatch = useDispatch()

  const { items: submissions } = useSelector((state) => state.submissions)

  const [activeId, setActiveId] = useState(null)
  const [reply, setReply] = useState('')

  const feedbackList = useMemo(() => {
    return submissions
      .filter((item) => item.feedback || item.rating > 0)
      .map((item) => ({
        ...item,
        topic: item.status === 'Rejected' ? 'Assignment Feedback' : 'Graded Work',
      }))
  }, [submissions])

  const open = feedbackList.filter((item) => !item.reply).length
  const average = feedbackList.length
    ? (
        feedbackList.reduce((sum, item) => sum + (item.rating || 0), 0) /
        feedbackList.length
      ).toFixed(1)
    : '0.0'

  function openReply(item) {
    setActiveId(item.id)
    setReply(item.reply || '')
  }

  async function sendReply() {
    if (activeId === null) return

    await dispatch(
      updateSubmission({ id: activeId, reply: reply.trim() }),
    ).unwrap()

    setActiveId(null)
    setReply('')
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Voice of the learner"
        title="Feedback"
        description="Read what students are saying and close the loop with a reply."
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AdminStatCard
          title="Total Feedback"
          value={feedbackList.length}
          icon={MessageSquare}
          tone="yellow"
        />
        <AdminStatCard
          title="Awaiting Reply"
          value={open}
          icon={Reply}
          tone="orange"
        />
        <AdminStatCard
          title="Average Rating"
          value={average}
          icon={Star}
          tone="green"
        />
      </section>

      {feedbackList.length === 0 ? (
        <section className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900 p-12 text-center">
          <MessageSquare size={28} className="mx-auto text-neutral-600" />
          <h2 className="mt-4 text-lg font-semibold text-white">
            No feedback yet
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Feedback shows up here once submissions are graded.
          </p>
        </section>
      ) : (
        <section className="space-y-4">
          {feedbackList.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-neutral-800 bg-neutral-900 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${getTone(item.studentName)}`}
                  >
                    {getInitials(item.studentName)}
                  </span>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-white">
                        {item.studentName}
                      </h2>
                      <StatusBadge
                        value={item.reply ? 'Resolved' : 'Open'}
                      />
                    </div>

                    <p className="mt-1 text-xs text-neutral-500">
                      {item.topic} · {item.assignmentTitle} ·{' '}
                      {formatDate(item.submittedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      size={15}
                      className={
                        index < item.rating
                          ? 'text-yellow-400'
                          : 'text-neutral-700'
                      }
                      fill={index < item.rating ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
              </div>

              <p className="mt-4 rounded-lg border border-neutral-800 bg-neutral-950 p-4 text-sm leading-relaxed text-neutral-300">
                {item.feedback}
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
                        updateSubmission({
                          id: item.id,
                          reply: 'Thanks for the feedback! We will get back to you soon.',
                        }),
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 px-3 py-2 text-xs font-medium text-neutral-300 transition hover:border-yellow-400 hover:text-yellow-400"
                  >
                    <CheckCircle2 size={14} />
                    Mark resolved
                  </button>
                )}
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
