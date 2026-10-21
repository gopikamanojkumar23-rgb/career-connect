import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { CheckCircle2, ClipboardList, Clock, FileCheck, TrendingUp, Users } from 'lucide-react'

import { AdminPageHeader, AdminStatCard, StatusBadge } from '../Components/AdminUI'
import { formatDate, getInitials, getOverallCompletion } from '../../Redux/selectors'

const avatarTones = [
  'bg-yellow-400/15 text-yellow-400',
  'bg-sky-500/15 text-sky-400',
  'bg-emerald-500/15 text-emerald-400',
  'bg-violet-500/15 text-violet-400',
  'bg-orange-500/15 text-orange-400',
  'bg-rose-500/15 text-rose-400',
]

function getTone(name) {
  const total = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)

  return avatarTones[total % avatarTones.length]
}

function AdminDashboard() {
  const { items: users } = useSelector((state) => state.users)
  const { items: assignments } = useSelector((state) => state.assignments)
  const { items: submissions } = useSelector((state) => state.submissions)

  const stats = useMemo(() => {
    const students = users.filter((user) => user.role === 'Student').length
    const completion = getOverallCompletion(submissions)

    return [
      {
        title: 'Total Students',
        value: students,
        hint: 'Enrolled in a course',
        icon: Users,
        tone: 'blue',
      },
      {
        title: 'Assignments',
        value: assignments.length,
        hint: 'Published for learners',
        icon: ClipboardList,
        tone: 'purple',
      },
      {
        title: 'Submissions',
        value: submissions.length,
        hint: 'Waiting or graded',
        icon: FileCheck,
        tone: 'green',
      },
      {
        title: 'Completion Rate',
        value: `${completion}%`,
        hint: 'Approved submissions',
        icon: TrendingUp,
        tone: 'orange',
      },
    ]
  }, [users, assignments, submissions])

  const recentSubmissions = useMemo(() => {
    return [...submissions]
      .sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1))
      .slice(0, 5)
  }, [submissions])

  const breakdown = useMemo(() => {
    const completed = submissions.filter((item) => item.status === 'Completed').length
    const total = submissions.length

    return {
      completed,
      pending: total - completed,
      completion: getOverallCompletion(submissions),
    }
  }, [submissions])

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Here’s what’s happening with your platform today."
      />

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">
            Platform Statistics
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Live numbers from the career-server database
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <AdminStatCard
              key={item.title}
              title={item.title}
              value={item.value}
              icon={item.icon}
              tone={item.tone}
              hint={item.hint}
            />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <section className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 px-5 py-4">
            <div>
              <h2 className="font-semibold text-white">Recent Submissions</h2>
              <p className="mt-1 text-xs text-neutral-500">
                Latest student assignment activity
              </p>
            </div>

            <span className="rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1 text-xs text-neutral-400">
              {recentSubmissions.length} records
            </span>
          </div>

          {recentSubmissions.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-neutral-500">
              No submissions yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-neutral-800 text-xs tracking-widest text-neutral-500 uppercase">
                    <th className="px-5 py-3 font-medium">Student</th>
                    <th className="px-5 py-3 font-medium">Assignment</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentSubmissions.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-neutral-800/70 transition last:border-0 hover:bg-neutral-800/40"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${getTone(item.studentName)}`}
                          >
                            {getInitials(item.studentName)}
                          </span>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">
                              {item.studentName}
                            </p>
                            <p className="truncate text-xs text-neutral-500">
                              {item.course}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-neutral-300">
                        {item.assignmentTitle}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge value={item.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold text-white">Learning Progress</h2>
              <p className="mt-1 text-xs text-neutral-500">
                Overall student performance
              </p>
            </div>

            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-400/10 text-yellow-400">
              <TrendingUp size={18} />
            </span>
          </div>

          <div className="mt-5 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs tracking-wide text-neutral-500 uppercase">
                Overall completion
              </p>
              <p className="mt-1 text-4xl font-bold text-white">
                {breakdown.completion}
                <span className="text-2xl text-yellow-400">%</span>
              </p>
            </div>

            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
              On track
            </span>
          </div>

          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-neutral-800">
            <div
              className="h-full rounded-full bg-yellow-400"
              style={{ width: `${breakdown.completion}%` }}
            />
          </div>

          <div className="mt-2 flex justify-between text-xs text-neutral-600">
            <span>0%</span>
            <span>100%</span>
          </div>

          <div className="mt-5 space-y-3 border-t border-neutral-800 pt-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                <CheckCircle2 size={18} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white">Completed</p>
                <p className="text-xs text-neutral-500">Successfully finished</p>
              </div>

              <span className="text-sm font-semibold text-yellow-400">
                {breakdown.completed}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/15 text-orange-400">
                <Clock size={18} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white">In Progress</p>
                <p className="text-xs text-neutral-500">Waiting for review</p>
              </div>

              <span className="text-sm font-semibold text-yellow-400">
                {breakdown.pending}
              </span>
            </div>
          </div>

          <p className="mt-5 flex items-start gap-2 rounded-lg border border-neutral-800 bg-neutral-950 p-3 text-xs leading-relaxed text-neutral-400">
            <TrendingUp size={15} className="mt-0.5 shrink-0 text-yellow-400" />
            Keep encouraging students to complete their courses.
          </p>
        </section>
      </div>

      <section className="flex items-center gap-4 rounded-xl border border-neutral-800 bg-neutral-900 p-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
          <CheckCircle2 size={20} />
        </span>

        <div>
          <p className="text-sm font-semibold text-white">
            Your workspace is ready
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Last synced {formatDate(new Date().toISOString())} from
            career-server.
          </p>
        </div>
      </section>
    </div>
  )
}

export default AdminDashboard
