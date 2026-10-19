
import { Link } from 'react-router-dom'

const assignmentList = [
  {
    id: 1,
    title: 'Portfolio Website',
    description: 'Create a responsive personal portfolio website.',
    deadline: '2026-10-25',
    status: 'In Progress',
  },
  {
    id: 2,
    title: 'Resume Preparation',
    description: 'Prepare and review your professional resume.',
    deadline: '2026-10-28',
    status: 'Pending',
  },
  {
    id: 3,
    title: 'React Mini Project',
    description: 'Build a small application using React components.',
    deadline: '2026-10-15',
    status: 'Completed',
  },
]

function MyAssingment() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-yellow-400">
          My Assignments
        </h1>
        <p className="mt-2 text-neutral-400">
          View your tasks, deadlines, and progress.
        </p>
      </div>

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
                  Deadline: {item.deadline}
                </p>
              </div>

              <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-sm text-yellow-400">
                {item.status}
              </span>
            </div>

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
    </div>
  )
}

export default MyAssingment
