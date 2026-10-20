import {
  AdminPageHeader,
  AdminStatCard,
  StatusBadge,
} from '../Components/AdminUI'

import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CheckCircle2,
  Clock,
  FileCheck,
  MessageSquare,
  RotateCcw,
  Search,
  Send,
  XCircle,
} from 'lucide-react'

import { updateSubmission } from '../../Redux/Slice/submissionSlice'
import { formatDate } from '../../Redux/selectors'
import { showSuccess } from '../../Services/alert'

const statuses = ['All', 'Submitted', 'Review', 'Completed', 'Rejected']

function Submissions() {
  const dispatch = useDispatch()

  const { items: submissions } = useSelector((state) => state.submissions)

  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [activeId, setActiveId] = useState(null)
  const [feedback, setFeedback] = useState('')

  const stats = useMemo(() => {
    return {
      total: submissions.length,
      pending: submissions.filter((item) => item.status === 'Submitted').length,
      review: submissions.filter((item) => item.status === 'Review').length,
      completed: submissions.filter((item) => item.status === 'Completed').length,
    }
  }, [submissions])

  const visibleSubmissions = useMemo(() => {
    const query = search.trim().toLowerCase()

    return submissions.filter((item) => {
      const matchesStatus =
        statusFilter === 'All' || item.status === statusFilter

      const matchesSearch =
        query === '' ||
        item.studentName.toLowerCase().includes(query) ||
        item.assignmentTitle.toLowerCase().includes(query)

      return matchesStatus && matchesSearch
    })
  }, [submissions, statusFilter, search])

  async function setStatus(id, status) {
    await dispatch(updateSubmission({ id, status })).unwrap()

    showSuccess(`Submission marked as ${status}.`)
  }

  function openFeedback(item) {
    setActiveId(item.id)
    setFeedback(item.feedback)
  }

  async function saveFeedback() {
    if (activeId === null) return

    await dispatch(updateSubmission({ id: activeId, feedback: feedback.trim() })).unwrap()

    setActiveId(null)
    setFeedback('')

    showSuccess('Feedback sent to the student.')
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Review Queue"
        title="Submissions"
        description="Review what learners have submitted, leave feedback and close the loop."
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          title="Total Submissions"
          value={stats.total}
          icon={FileCheck}
          tone="yellow"
        />
        <AdminStatCard
          title="Awaiting Review"
          value={stats.pending}
          icon={Clock}
          tone="orange"
        />
        <AdminStatCard
          title="In Review"
          value={stats.review}
          icon={MessageSquare}
          tone="blue"
        />
        <AdminStatCard
          title="Approved"
          value={stats.completed}
          icon={CheckCircle2}
          tone="green"
        />
      </section>

      <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-neutral-500"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by student or assignment"
              aria-label="Search submissions"
              className="w-full rounded-lg border border-neutral-700 bg-black py-2 pr-3 pl-9 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-yellow-400"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                  statusFilter === status
                    ? 'border-yellow-400 bg-yellow-400 text-black'
                    : 'border-neutral-700 text-neutral-300 hover:border-yellow-400 hover:text-yellow-400'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </section>

      {visibleSubmissions.length === 0 ? (
        <section className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900 p-12 text-center">
          <Search size={28} className="mx-auto text-neutral-600" />
          <h2 className="mt-4 text-lg font-semibold text-white">
            Nothing to review here
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            No submissions match the current filters.
          </p>
        </section>
      ) : (
        <section className="space-y-4">
          {visibleSubmissions.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-neutral-800 bg-neutral-900 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-white">{item.studentName}</h2>
                  <p className="mt-1 text-xs text-neutral-500">
                    {item.assignmentTitle} · {item.course}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-neutral-500">
                    {formatDate(item.submittedAt)}
                  </span>
                  <StatusBadge value={item.status} />
                </div>
              </div>

              <p className="mt-4 rounded-lg border border-neutral-800 bg-neutral-950 p-3 text-sm leading-relaxed text-neutral-400">
                {item.description}
              </p>

              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-xs text-yellow-400 hover:underline"
                >
                  {item.link}
                </a>
              )}

              {item.feedback && (
                <p className="mt-3 rounded-lg border border-neutral-800 bg-neutral-950 p-3 text-sm leading-relaxed text-neutral-400">
                  <span className="font-medium text-neutral-300">Feedback: </span>
                  {item.feedback}
                </p>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-neutral-800 pt-4">
                <button
                  type="button"
                  onClick={() => setStatus(item.id, 'Review')}
                  className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 px-3 py-2 text-xs font-medium text-neutral-300 transition hover:border-yellow-400 hover:text-yellow-400"
                >
                  <Clock size={14} />
                  Move to review
                </button>

                <button
                  type="button"
                  onClick={() => setStatus(item.id, 'Completed')}
                  className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/20"
                >
                  <CheckCircle2 size={14} />
                  Approve
                </button>

                <button
                  type="button"
                  onClick={() => setStatus(item.id, 'Rejected')}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/20"
                >
                  <XCircle size={14} />
                  Reject
                </button>

                <button
                  type="button"
                  onClick={() => openFeedback(item)}
                  className="inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-3 py-2 text-xs font-semibold text-black transition hover:bg-yellow-300"
                >
                  <MessageSquare size={14} />
                  {item.feedback ? 'Edit feedback' : 'Add feedback'}
                </button>

                {item.status !== 'Submitted' && (
                  <button
                    type="button"
                    onClick={() => setStatus(item.id, 'Submitted')}
                    className="inline-flex items-center gap-2 px-2 py-2 text-xs text-neutral-500 transition hover:text-neutral-300"
                  >
                    <RotateCcw size={13} />
                    Reset
                  </button>
                )}
              </div>

              {activeId === item.id && (
                <div className="mt-4 rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
                  <label
                    htmlFor={`feedback-${item.id}`}
                    className="mb-2 block text-sm text-neutral-300"
                  >
                    Feedback for {item.studentName}
                  </label>

                  <textarea
                    id={`feedback-${item.id}`}
                    rows="4"
                    value={feedback}
                    onChange={(event) => setFeedback(event.target.value)}
                    placeholder="Share what went well and what to improve..."
                    className="w-full rounded-lg border border-neutral-700 bg-black p-3 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-yellow-400"
                  />

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={saveFeedback}
                      className="inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-300"
                    >
                      <Send size={15} />
                      Send feedback
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

export default Submissions
