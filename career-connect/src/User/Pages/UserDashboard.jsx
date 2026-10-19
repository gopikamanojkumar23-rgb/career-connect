
const assignments = [
  {
    title: 'Portfolio Website',
    category: 'Web Development',
    status: 'In Progress',
    progress: 70,
  },
  {
    title: 'Resume Preparation',
    category: 'Career Development',
    status: 'Pending',
    progress: 20,
  },
  {
    title: 'React Mini Project',
    category: 'Frontend Development',
    status: 'Completed',
    progress: 100,
  },
]

function UserDashboard() {
  const stats = [
    { title: 'Total Assignments', value: 6, icon: '📋' },
    { title: 'Completed', value: 3, icon: '✅' },
    { title: 'In Progress', value: 2, icon: '⏳' },
    { title: 'Pending', value: 1, icon: '📌' },
  ]

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
          Welcome back! Here is an overview of your assignments.
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
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-yellow-400">
            Recent Assignments
          </h2>
          <span className="text-sm text-neutral-500">Sample data</span>
        </div>

        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div
              key={assignment.title}
              className="rounded-lg border border-neutral-800 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-white">
                    {assignment.title}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-400">
                    {assignment.category}
                  </p>
                </div>

                <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs text-yellow-400">
                  {assignment.status}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-800">
                  <div
                    className="h-full rounded-full bg-yellow-400"
                    style={{ width: `${assignment.progress}%` }}
                  />
                </div>
                <span className="text-sm text-neutral-400">
                  {assignment.progress}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default UserDashboard
