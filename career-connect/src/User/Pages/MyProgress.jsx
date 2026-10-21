import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { getUserProgress } from '../../Redux/selectors'

function MyProgress() {
  const user = useSelector((state) => state.auth.user)
  const { items: assignments } = useSelector((state) => state.assignments)
  const { items: submissions } = useSelector((state) => state.submissions)

  const progressItems = useMemo(() => {
    if (!user) return []

    return assignments
      .filter((item) => item.course === user.course)
      .map((assignment) => {
        const own = submissions.filter(
          (item) =>
            item.assignmentId === assignment.id && item.studentId === user.id,
        )

        const completed = own.filter((item) => item.status === 'Completed').length

        return {
          name: assignment.title,
          progress: own.length === 0 ? 0 : Math.round((completed / own.length) * 100),
        }
      })
  }, [assignments, submissions, user])

  const average = getUserProgress(submissions, user?.id).percentage

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-yellow-400">My Progress</h1>
        <p className="mt-2 text-neutral-400">
          Track your assignment completion.
        </p>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <p className="text-neutral-400">Overall progress</p>
        <p className="mt-2 text-4xl font-bold text-yellow-400">{average}%</p>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-neutral-800">
          <div
            className="h-full rounded-full bg-yellow-400"
            style={{ width: `${average}%` }}
          />
        </div>
      </div>

      {progressItems.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900 p-12 text-center text-sm text-neutral-500">
          No assignments published for your course yet.
        </p>
      ) : (
        <div className="space-y-4">
          {progressItems.map((assignment) => (
            <div
              key={assignment.name}
              className="rounded-xl border border-neutral-800 bg-neutral-900 p-5"
            >
              <div className="flex justify-between gap-3">
                <h2 className="font-semibold text-white">{assignment.name}</h2>
                <span className="text-yellow-400">{assignment.progress}%</span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-800">
                <div
                  className="h-full rounded-full bg-yellow-400"
                  style={{ width: `${assignment.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyProgress
