
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { formatDate } from '../../Redux/selectors'

function MyAssingment() {
  const user = useSelector((state) => state.auth.user)
  const { items: assignments } = useSelector((state) => state.assignments)
  const { items: submissions } = useSelector((state) => state.submissions)

  const assignmentList = useMemo(() => {
    if (!user) return []

    return assignments
      .filter((item) => item.course === user.course)
      .map((assignment) => {
        const submission = submissions.find(
          (item) =>
            item.assignmentId === assignment.id && item.studentId === user.id,
        )

        return {
          ...assignment,
          status: submission ? submission.status : 'Pending',
          submission,
        }
      })
  }, [assignments, submissions, user])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-yellow-400">My Assignments</h1>
        <p className="mt-2 text-neutral-400">
          View your tasks, deadlines, and progress.
        </p>
      </div>

      {assignmentList.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900 p-12 text-center text-sm text-neutral-500">
          No assignments published for your course yet.
        </p>
      ) : (
        <div className="grid gap-4">
          {assignmentList.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-neutral-800 bg-neutral-900 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm text-neutral-400">
                    {item.description}
                  </p>
                  <p className="mt-3 text-sm text-neutral-500">
                    Deadline: {formatDate(item.deadline)}
                  </p>
                </div>

                <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-sm text-yellow-400">
                  {item.status}
                </span>
              </div>

              {item.submission?.feedback && (
                <p className="mt-4 rounded-lg border border-neutral-800 bg-black p-3 text-sm text-neutral-400">
                  <span className="font-medium text-yellow-400">Feedback: </span>
                  {item.submission.feedback}
                </p>
              )}

              {item.status !== 'Completed' && (
                <Link
                  to="/submit-work"
                  className="mt-4 inline-block rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-300"
                >
                  Submit Work
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyAssingment
