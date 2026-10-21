import { useMemo, useState } from 'react'
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js'
import { useSelector } from 'react-redux'
import { Download, FileBarChart, TrendingUp, Users } from 'lucide-react'
import { Bar } from 'react-chartjs-2'

import { AdminPageHeader, AdminStatCard } from '../Components/AdminUI'
import { getOverallCompletion } from '../../Redux/selectors'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const reportOptions = [
  {
    id: 'enrolment',
    title: 'Enrolment Report',
    description: 'New and existing learners across every course.',
    icon: Users,
  },
  {
    id: 'completion',
    title: 'Completion Report',
    description: 'Assignments finished per course over the last 6 months.',
    icon: TrendingUp,
  },
  {
    id: 'submissions',
    title: 'Submission Report',
    description: 'Submissions received, reviewed and approved.',
    icon: FileBarChart,
  },
]

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#a3a3a3',
        boxWidth: 12,
        boxHeight: 12,
        usePointStyle: true,
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
  scales: {
    x: {
      ticks: { color: '#737373' },
      grid: { color: 'rgba(64, 64, 64, 0.35)' },
    },
    y: {
      ticks: { color: '#737373' },
      grid: { color: 'rgba(64, 64, 64, 0.35)' },
    },
  },
}

function getLastMonths(count) {
  const months = []

  for (let index = count - 1; index >= 0; index -= 1) {
    const date = new Date()
    date.setMonth(date.getMonth() - index)

    months.push({
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleDateString('en-GB', { month: 'short' }),
    })
  }

  return months
}

function AdminReports() {
  const { items: users } = useSelector((state) => state.users)
  const { items: assignments } = useSelector((state) => state.assignments)
  const { items: submissions } = useSelector((state) => state.submissions)

  const [notice, setNotice] = useState('')

  const chartData = useMemo(() => {
    const months = getLastMonths(6)

    const labels = months.map((month) => month.label)

    const submitted = months.map((month) => {
      return submissions.filter((item) => {
        const date = new Date(item.submittedAt)

        return `${date.getFullYear()}-${date.getMonth()}` === month.key
      }).length
    })

    const approved = months.map((month) => {
      return submissions.filter((item) => {
        const date = new Date(item.submittedAt)

        return (
          `${date.getFullYear()}-${date.getMonth()}` === month.key &&
          item.status === 'Completed'
        )
      }).length
    })

    return {
      labels,
      datasets: [
        {
          label: 'Submissions',
          data: submitted,
          backgroundColor: 'rgba(250, 204, 21, 0.75)',
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: 'Approved',
          data: approved,
          backgroundColor: 'rgba(148, 163, 184, 0.55)',
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    }
  }, [submissions])

  const students = users.filter((user) => user.role === 'Student').length
  const completion = getOverallCompletion(submissions)

  function exportReport(title) {
    setNotice(`${title} is being prepared for download.`)

    window.setTimeout(() => setNotice(''), 3000)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Analytics"
        title="Reports"
        description="Pull the numbers you need for reviews, audits and planning."
      />

      {notice && (
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
          {notice}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {reportOptions.map((report) => {
          const Icon = report.icon

          return (
            <article
              key={report.id}
              className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 transition hover:border-yellow-400/60"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400">
                  <Icon size={22} />
                </div>

                <button
                  type="button"
                  onClick={() => exportReport(report.title)}
                  aria-label={`Export ${report.title}`}
                  className="rounded-lg p-2 text-neutral-400 transition hover:bg-yellow-400/10 hover:text-yellow-400"
                >
                  <Download size={17} />
                </button>
              </div>

              <h2 className="mt-4 font-semibold text-white">{report.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                {report.description}
              </p>

              <button
                type="button"
                onClick={() => exportReport(report.title)}
                className="mt-4 w-full rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:border-yellow-400 hover:text-yellow-400"
              >
                Download report
              </button>
            </article>
          )
        })}
      </section>

      <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
        <div className="mb-5">
          <h2 className="font-semibold text-white">
            Submissions vs approvals
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            Last 6 months across all courses
          </p>
        </div>

        <div className="h-72 sm:h-80">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AdminStatCard
          title="Enrolled Students"
          value={students}
          icon={Users}
          tone="blue"
          hint="active on the platform"
        />
        <AdminStatCard
          title="Completion Rate"
          value={`${completion}%`}
          icon={TrendingUp}
          tone="green"
          hint="approved submissions"
        />
        <AdminStatCard
          title="Assignments Published"
          value={assignments.length}
          icon={FileBarChart}
          tone="yellow"
          hint="across all courses"
        />
      </section>
    </div>
  )
}

export default AdminReports
