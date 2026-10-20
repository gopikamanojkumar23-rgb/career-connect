import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import {
  formatDate,
  getCourseProgress,
  getUserProgress,
} from '../../Redux/selectors'

function UserDashboard() {
  const user = useSelector((state) => state.auth.user)
  const { items: assignments } = useSelector((state) => state.assignments)
  const { items: submissions } = useSelector((state) => state.submissions)

  const myAssignments = useMemo(() => {
    if (!user) return []

    return assignments.filter((item) => item.course === user.course)
  }, [assignments, user])

  const mySubmissions = useMemo(() => {
    if (!user) return []

    return submissions.filter((item) => item.studentId === user.id)
  }, [submissions, user])

  const stats = useMemo(() => {
    const completed = mySubmissions.filter((item) => item.status === 'Completed').length
    const inProgress = mySubmissions.filter((item) => item.status !== 'Completed').length
    const pending = myAssignments.length - mySubmissions.length

    return [
      { title: 'Total Assignments', value: myAssignments.length, icon: '📋' },
      { title: 'Completed', value: completed, icon: '✅' },
      { title: 'In Progress', value: inProgress, icon: '⏳' },
      { title: 'Pending', value: pending, icon: '📌' },
    ]
  }, [myAssignments, mySubmissions])

  const progress = getUserProgress(submissions, user?.id)
  const courseProgress = getCourseProgress(assignments, submissions, user?.course)

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm uppercase tracking-widest text-yellow-500">
          Overview
        </p>
        <h1 className="mt-2 text-3xl font-bold text-yellow-400">
          User Dashboard
        </h1>
        <p className="mt-2 text-neutral-400">
          Welcome back, {user?.name}! Here is an overview of your assignments.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 transition hover:border-yellow-400"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-400">{stat.title}</p>
              <span>{stat.icon}</span>
            </div>
            <p className="mt-4 text-3xl font-bold text-yellow-400">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-yellow-400">
            {user?.course} Progress
          </h2>
          <span className="text-sm text-neutral-500">
            {progress.completed} of {progress.total} approved
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-neutral-800">
            <div
              className="h-full rounded-full bg-yellow-400"
              style={{ width: `${courseProgress.percentage}%` }}
            />
          </div>
          <span className="text-sm text-neutral-400">
            {courseProgress.percentage}%
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            to="/assignments"
            className="rounded-lg border border-neutral-800 p-4 transition hover:border-yellow-400"
          >
            <p className="text-sm font-semibold text-white">My Assignments</p>
            <p className="mt-1 text-xs text-neutral-500">
              {myAssignments.length} tasks in your course
            </p>
          </Link>

          <Link
            to="/submit-work"
            className="rounded-lg border border-neutral-800 p-4 transition hover:border-yellow-400"
          >
            <p className="text-sm font-semibold text-white">Submit Work</p>
            <p className="mt-1 text-xs text-neutral-500">
              Hand in your completed assignment
            </p>
          </Link>
        </div>
      </section>

      <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-yellow-400">
            Recent Submissions
          </h2>
          <span className="text-sm text-neutral-500">
            {mySubmissions.length} submitted
          </span>
        </div>

        {mySubmissions.length === 0 ? (
          <p className="rounded-lg border border-dashed border-neutral-800 p-8 text-center text-sm text-neutral-500">
            You have not submitted any work yet.
          </p>
        ) : (
          <div className="space-y-4">
            {[...mySubmissions]
              .sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1))
              .map((submission) => (
                <div
                  key={submission.id}
                  className="rounded-lg border border-neutral-800 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-white">
                        {submission.assignmentTitle}
                      </h3>
                      <p className="mt-1 text-sm text-neutral-400">
                        Submitted on {formatDate(submission.submittedAt)}
                      </p>
                    </div>

                    <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs text-yellow-400">
                      {submission.status}
                    </span>
                  </div>

                  {submission.feedback && (
                    <p className="mt-3 rounded-lg border border-neutral-800 bg-black p-3 text-sm text-neutral-400">
                      <span className="font-medium text-yellow-400">
                        Feedback:{' '}
                      </span>
                      {submission.feedback}
                    </p>
                  )}
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default UserDashboard
