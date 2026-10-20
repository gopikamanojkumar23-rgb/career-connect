import {
  AdminPageHeader,
  AdminStatCard,
} from '../Components/AdminUI'

import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Award, CheckCircle2, Clock, TrendingUp, Users } from 'lucide-react'

import { getInitials, getOverallCompletion } from '../../Redux/selectors'

function AdminProgress() {
  const { items: users } = useSelector((state) => state.users)
  const { items: assignments } = useSelector((state) => state.assignments)
  const { items: submissions } = useSelector((state) => state.submissions)

  const courseProgress = useMemo(() => {
    const courses = [...new Set(assignments.map((item) => item.course))]

    return courses.map((course) => {
      const courseAssignments = assignments.filter((item) => item.course === course)
      const courseIds = courseAssignments.map((item) => item.id)

      const own = submissions.filter((item) => courseIds.includes(item.assignmentId))
      const completed = own.filter((item) => item.status === 'Completed').length

      return {
        name: course,
        assignments: courseAssignments.length,
        submitted: own.length,
        completed,
        percentage: own.length === 0 ? 0 : Math.round((completed / own.length) * 100),
      }
    })
  }, [assignments, submissions])

  const topPerformers = useMemo(() => {
    return users
      .filter((user) => user.role === 'Student')
      .map((user) => {
        const own = submissions.filter((item) => item.studentId === user.id)
        const rated = own.filter((item) => item.rating > 0)

        const score = rated.length
          ? Math.round(rated.reduce((sum, item) => sum + item.rating, 0) / rated.length)
          : 0

        return { ...user, score, submitted: own.length }
      })
      .filter((user) => user.submitted > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
  }, [users, submissions])

  const overall = getOverallCompletion(submissions)
  const students = users.filter((user) => user.role === 'Student').length
  const awaiting = submissions.filter((item) => item.status !== 'Completed').length

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Insights"
        title="Learning Progress"
        description="Track completion across every course and spot the learners who need a nudge."
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          title="Overall Completion"
          value={`${overall}%`}
          icon={TrendingUp}
          tone="yellow"
          hint="Approved submissions"
        />
        <AdminStatCard
          title="Active Learners"
          value={students}
          icon={Users}
          tone="blue"
        />
        <AdminStatCard
          title="Completed Courses"
          value={courseProgress.length}
          icon={CheckCircle2}
          tone="green"
        />
        <AdminStatCard
          title="Awaiting Grading"
          value={awaiting}
          icon={Clock}
          tone="orange"
        />
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <section className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 xl:col-span-2">
          <div className="border-b border-neutral-800 px-5 py-4">
            <h2 className="font-semibold text-white">Course Completion</h2>
            <p className="mt-1 text-xs text-neutral-500">
              How far learners have progressed in each track
            </p>
          </div>

          {courseProgress.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-neutral-500">
              No assignments published yet.
            </p>
          ) : (
            <div className="divide-y divide-neutral-800/70">
              {courseProgress.map((course) => (
                <div key={course.name} className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-medium text-white">
                        {course.name}
                      </h3>
                      <p className="mt-1 text-xs text-neutral-500">
                        {course.completed} of {course.submitted} submissions
                        approved · {course.assignments} assignments
                      </p>
                    </div>

                    <span className="text-sm font-semibold text-yellow-400">
                      {course.percentage}%
                    </span>
                  </div>

                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-neutral-800">
                    <div
                      className="h-full rounded-full bg-yellow-400"
                      style={{ width: `${course.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold text-white">Top Performers</h2>
              <p className="mt-1 text-xs text-neutral-500">
                Highest scores from feedback ratings
              </p>
            </div>

            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-400/10 text-yellow-400">
              <Award size={18} />
            </span>
          </div>

          {topPerformers.length === 0 ? (
            <p className="mt-6 text-sm text-neutral-500">
              No rated submissions yet.
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              {topPerformers.map((person) => (
                <div
                  key={person.id}
                  className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-950 p-3"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-400/10 text-sm font-semibold text-yellow-400">
                    {getInitials(person.name)}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {person.name}
                    </p>
                    <p className="truncate text-xs text-neutral-500">
                      {person.course}
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-yellow-400">
                    {person.score}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default AdminProgress
