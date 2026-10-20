
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import {
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  FolderKanban,
  ListTodo,
} from 'lucide-react'
import { Doughnut } from 'react-chartjs-2'
import { Link } from 'react-router-dom'

import {
  formatDate,
  getCompletionOverview,
  getMyProjects,
  getOpenTasks,
  getUpcomingExams,
  getUserProgress,
} from '../../Redux/selectors'

ChartJS.register(ArcElement, Tooltip, Legend)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '62%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#a3a3a3',
        boxWidth: 12,
        boxHeight: 12,
        usePointStyle: true,
        padding: 16,
        font: { size: 12 },
      },
    },
    tooltip: {
      backgroundColor: '#171717',
      borderColor: '#404040',
      borderWidth: 1,
      titleColor: '#facc15',
      bodyColor: '#e5e5e5',
    },
  },
}

const chartColours = {
  assignments: 'rgba(250, 204, 21, 0.85)',
  tasks: 'rgba(56, 189, 248, 0.85)',
  projects: 'rgba(167, 139, 250, 0.85)',
}

function UserDashboard() {
  const user = useSelector((state) => state.auth.user)
  const { items: assignments } = useSelector((state) => state.assignments)
  const { items: submissions } = useSelector((state) => state.submissions)
  const { exams, tasks, projects } = useSelector((state) => state.student)

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
      { title: 'Assignments', value: myAssignments.length, icon: '📋' },
      { title: 'Completed', value: completed, icon: '✅' },
      { title: 'In Progress', value: inProgress, icon: '⏳' },
      { title: 'Pending', value: pending, icon: '📌' },
    ]
  }, [myAssignments, mySubmissions])

  const overview = useMemo(() => {
    return getCompletionOverview(assignments, tasks, projects, user)
  }, [assignments, tasks, projects, user])

  const upcomingExams = useMemo(() => {
    return getUpcomingExams(exams, user)
  }, [exams, user])

  const openTasks = useMemo(() => {
    return getOpenTasks(tasks, user)
  }, [tasks, user])

  const myProjects = useMemo(() => {
    return getMyProjects(projects, user)
  }, [projects, user])

  const chartData = useMemo(() => {
    return {
      labels: ['Assignments', 'Tasks', 'Projects'],
      datasets: [
        {
          data: [
            overview.assignments.done,
            overview.tasks.done,
            overview.projects.done,
          ],
          backgroundColor: [
            chartColours.assignments,
            chartColours.tasks,
            chartColours.projects,
          ],
          borderColor: '#171717',
          borderWidth: 3,
        },
      ],
    }
  }, [overview])

  const progress = getUserProgress(submissions, user?.id)

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
          Welcome back, {user?.name}! Here is everything waiting for you.
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

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-yellow-400">
                Completion
              </h2>
              <p className="mt-1 text-xs text-neutral-500">
                What you have finished so far
              </p>
            </div>

            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-400/10 text-yellow-400">
              <CheckCircle2 size={20} />
            </span>
          </div>

          <div className="relative mt-4 h-52">
            <Doughnut data={chartData} options={chartOptions} />

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {overview.percentage}%
              </span>
              <span className="text-xs text-neutral-500">complete</span>
            </div>
          </div>

          <div className="mt-5 space-y-3 border-t border-neutral-800 pt-5">
            {[
              { key: 'assignments', label: 'Assignments', icon: ClipboardList },
              { key: 'tasks', label: 'Tasks', icon: ListTodo },
              { key: 'projects', label: 'Projects', icon: FolderKanban },
            ].map((row) => {
              const Icon = row.icon
              const item = overview[row.key]

              return (
                <div key={row.key} className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: chartColours[row.key] }}
                  />
                  <Icon size={16} className="shrink-0 text-neutral-500" />
                  <span className="flex-1 text-sm text-neutral-300">
                    {row.label}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {item.done}/{item.total}
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 xl:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-yellow-400">
                Upcoming Exams
              </h2>
              <p className="mt-1 text-xs text-neutral-500">
                Exam dates for your course
              </p>
            </div>

            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-400/10 text-yellow-400">
              <CalendarClock size={20} />
            </span>
          </div>

          {upcomingExams.length === 0 ? (
            <p className="mt-6 text-sm text-neutral-500">
              No exams scheduled for your course yet.
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              {upcomingExams.map((exam) => (
                <div
                  key={exam.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-800 bg-neutral-950 p-4"
                >
                  <div>
                    <h3 className="font-medium text-white">{exam.title}</h3>
                    <p className="mt-1 text-xs text-neutral-500">
                      {formatDate(exam.date)} at {exam.time} · {exam.venue}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      exam.days <= 7
                        ? 'bg-red-500/10 text-red-400'
                        : 'bg-yellow-400/10 text-yellow-400'
                    }`}
                  >
                    {exam.days === 0
                      ? 'Today'
                      : `${exam.days} day${exam.days === 1 ? '' : 's'} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-yellow-400">Tasks</h2>
              <p className="mt-1 text-xs text-neutral-500">
                Small steps still to do
              </p>
            </div>

            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-400/10 text-yellow-400">
              <ListTodo size={20} />
            </span>
          </div>

          {openTasks.length === 0 ? (
            <p className="mt-6 text-sm text-neutral-500">
              All caught up, no open tasks.
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              {openTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-neutral-800 bg-neutral-950 p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-white">{task.title}</p>
                    <p className="mt-1 text-xs text-neutral-500">
                      Due {formatDate(task.dueDate)}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-yellow-400/10 px-2.5 py-1 text-xs text-yellow-400">
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-yellow-400">
                Projects
              </h2>
              <p className="mt-1 text-xs text-neutral-500">
                What you are building
              </p>
            </div>

            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-400/10 text-yellow-400">
              <FolderKanban size={20} />
            </span>
          </div>

          {myProjects.length === 0 ? (
            <p className="mt-6 text-sm text-neutral-500">
              No projects for your course yet.
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              {myProjects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-lg border border-neutral-800 bg-neutral-950 p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm text-white">{project.title}</p>
                    <span className="shrink-0 text-xs font-medium text-yellow-400">
                      {project.progress}%
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-800">
                    <div
                      className="h-full rounded-full bg-yellow-400"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-neutral-500">
                    Due {formatDate(project.dueDate)} · {project.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-yellow-400">
            Recent Submissions
          </h2>
          <span className="text-sm text-neutral-500">
            {progress.completed} of {progress.total} approved
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

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          to="/assignments"
          className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 transition hover:border-yellow-400"
        >
          <p className="text-sm font-semibold text-white">My Assignments</p>
          <p className="mt-1 text-xs text-neutral-500">
            {myAssignments.length} tasks in your course
          </p>
        </Link>

        <Link
          to="/submit-work"
          className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 transition hover:border-yellow-400"
        >
          <p className="text-sm font-semibold text-white">Submit Work</p>
          <p className="mt-1 text-xs text-neutral-500">
            Hand in your completed assignment
          </p>
        </Link>
      </section>
    </div>
  )
}

export default UserDashboard
