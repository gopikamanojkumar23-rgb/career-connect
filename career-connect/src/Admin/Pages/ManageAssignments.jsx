import {
  AdminPageHeader,
  AdminStatCard,
  ConfirmDialog,
  StatusBadge,
} from '../Components/AdminUI'

import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CalendarDays, ClipboardList, Plus, Search, Trash2, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import { deleteAssignment } from '../../Redux/Slice/assignmentSlice'
import { formatDate, getAssignmentProgress } from '../../Redux/selectors'
import { showSuccess } from '../../Services/alert'

function ManageAssignments() {
  const dispatch = useDispatch()

  const { items: assignments } = useSelector((state) => state.assignments)
  const { items: submissions } = useSelector((state) => state.submissions)

  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const visibleAssignments = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (query === '') return assignments

    return assignments.filter(
      (assignment) =>
        assignment.title.toLowerCase().includes(query) ||
        assignment.course.toLowerCase().includes(query),
    )
  }, [assignments, search])

  const totalSubmissions = submissions.length

  async function confirmDelete() {
    if (!deleteTarget) return

    await dispatch(deleteAssignment(deleteTarget.id)).unwrap()

    showSuccess('Assignment removed')

    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Content"
        title="Assignments"
        description="Create, track and archive every assignment published for your learners."
        actions={
          <Link
            to="/admin/assignments/create"
            className="inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-300"
          >
            <Plus size={16} />
            New Assignment
          </Link>
        }
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AdminStatCard
          title="Total Assignments"
          value={assignments.length}
          icon={ClipboardList}
          tone="yellow"
        />
        <AdminStatCard
          title="Total Submissions"
          value={totalSubmissions}
          icon={Users}
          tone="blue"
        />
        <AdminStatCard
          title="Courses Covered"
          value={new Set(assignments.map((item) => item.course)).size}
          icon={CalendarDays}
          tone="green"
        />
      </section>

      <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 sm:p-5">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-neutral-500"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search assignments by title or course"
            aria-label="Search assignments"
            className="w-full rounded-lg border border-neutral-700 bg-black py-2 pr-3 pl-9 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-yellow-400"
          />
        </div>

        <p className="mt-4 border-t border-neutral-800 pt-4 text-sm text-neutral-500">
          Showing <span className="text-yellow-400">{visibleAssignments.length}</span>{' '}
          of {assignments.length} assignments
        </p>
      </section>

      {visibleAssignments.length === 0 ? (
        <section className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900 p-12 text-center">
          <Search size={28} className="mx-auto text-neutral-600" />
          <h2 className="mt-4 text-lg font-semibold text-white">
            No assignments found
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Try a different search term.
          </p>
        </section>
      ) : (
        <section className="grid gap-4 lg:grid-cols-2">
          {visibleAssignments.map((assignment) => {
            const progress = getAssignmentProgress(submissions, assignment.id)

            return (
              <article
                key={assignment.id}
                className="flex flex-col rounded-xl border border-neutral-800 bg-neutral-900 p-5 transition hover:border-yellow-400/60"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-white">{assignment.title}</h2>
                    <p className="mt-1 text-xs text-neutral-500">
                      {assignment.course}
                    </p>
                  </div>

                  <StatusBadge
                    value={
                      progress.completed >= progress.total && progress.total > 0
                        ? 'Completed'
                        : 'Active'
                    }
                  />
                </div>

                <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                  {assignment.description}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays size={14} className="text-yellow-400" />
                    Deadline: {formatDate(assignment.deadline)}
                  </span>

                  <span>Marks: {assignment.maxMarks}</span>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>
                      {progress.completed} of {progress.total} submissions
                      approved
                    </span>
                    <span className="text-yellow-400">
                      {progress.percentage}%
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-800">
                    <div
                      className="h-full rounded-full bg-yellow-400"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-end gap-2 border-t border-neutral-800 pt-4">
                  <Link
                    to="/admin/submissions"
                    className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:border-yellow-400 hover:text-yellow-400"
                  >
                    View submissions
                  </Link>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(assignment)}
                    aria-label={`Delete ${assignment.title}`}
                    className="rounded-lg p-2 text-neutral-400 transition hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            )
          })}
        </section>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete assignment"
        message={`"${deleteTarget?.title ?? ''}" will be removed along with its submission progress. This action cannot be undone.`}
        confirmLabel="Delete assignment"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default ManageAssignments
