import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CalendarClock, FolderKanban, ListTodo, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import Swal from 'sweetalert2'

import { AdminModal, AdminPageHeader, ConfirmDialog, StatusBadge } from '../Components/AdminUI'
import { createStudentItem, deleteStudentItem, updateStudentItem } from '../../Redux/Slice/studentSlice'
import { formatDate } from '../../Redux/selectors'

const courses = [
  'Web Development',
  'UI/UX Design',
  'JavaScript',
  'Data Science',
  'Career Development',
]

const statuses = ['Pending', 'In Progress', 'Completed']

// One entry per collection. The list, the form and the table are all built
// from this, so exams, tasks and projects share the same code.
const tabs = [
  {
    key: 'exams',
    label: 'Exams',
    icon: CalendarClock,
    fields: [
      { name: 'title', label: 'Exam Name', type: 'text' },
      { name: 'course', label: 'Course / Track', type: 'course' },
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'time', label: 'Time', type: 'text', placeholder: '10:00' },
      { name: 'venue', label: 'Venue', type: 'text' },
    ],
  },
  {
    key: 'tasks',
    label: 'Tasks',
    icon: ListTodo,
    fields: [
      { name: 'title', label: 'Task', type: 'text' },
      { name: 'course', label: 'Course / Track', type: 'course' },
      { name: 'dueDate', label: 'Due Date', type: 'date' },
      { name: 'status', label: 'Status', type: 'status' },
    ],
  },
  {
    key: 'projects',
    label: 'Projects',
    icon: FolderKanban,
    fields: [
      { name: 'title', label: 'Project', type: 'text' },
      { name: 'course', label: 'Course / Track', type: 'course' },
      { name: 'dueDate', label: 'Due Date', type: 'date' },
      { name: 'status', label: 'Status', type: 'status' },
      { name: 'progress', label: 'Progress %', type: 'number' },
    ],
  },
]

function defaultValues(tab) {
  const values = {}

  tab.fields.forEach((field) => {
    if (field.type === 'course') values[field.name] = courses[0]
    else if (field.type === 'status') values[field.name] = 'Pending'
    else if (field.type === 'number') values[field.name] = 0
    else values[field.name] = ''
  })

  return values
}

function AdminStudyPlan() {
  const dispatch = useDispatch()

  const student = useSelector((state) => state.student)

  const [activeKey, setActiveKey] = useState('exams')
  const [search, setSearch] = useState('')

  const [formMode, setFormMode] = useState(null)
  const [formValues, setFormValues] = useState({})
  const [formError, setFormError] = useState('')

  const [deleteTarget, setDeleteTarget] = useState(null)

  const tab = tabs.find((item) => item.key === activeKey)

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase()

    return student[activeKey].filter(
      (row) =>
        query === '' ||
        row.title.toLowerCase().includes(query) ||
        row.course.toLowerCase().includes(query),
    )
  }, [student, activeKey, search])

  function openCreateForm() {
    setFormMode('create')
    setFormValues(defaultValues(tab))
    setFormError('')
  }

  function openEditForm(row) {
    setFormMode('edit')
    setFormValues({ id: row.id, ...row })
    setFormError('')
  }

  function closeForm() {
    setFormMode(null)
    setFormError('')
  }

  function handleChange(event) {
    const { name, value } = event.target

    setFormValues((current) => ({
      ...current,
      [name]: value,
    }))

    setFormError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!formValues.title?.trim()) {
      setFormError('A title is required.')
      return
    }

    const values = { ...formValues }
    delete values.id

    if (tab.key === 'projects') {
      values.progress = Number(values.progress) || 0
    }

    try {
      if (formMode === 'create') {
        await dispatch(
          createStudentItem({ type: tab.key, values }),
        ).unwrap()

        Swal.fire({
          icon: 'success',
          title: `${tab.label.slice(0, -1)} added`,
          text: 'The students can see it now.',
        })
      } else {
        await dispatch(
          updateStudentItem({
            type: tab.key,
            id: formValues.id,
            values,
          }),
        ).unwrap()

        Swal.fire('Record updated')
      }

      closeForm()
    } catch (error) {
      setFormError(error)
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return

    await dispatch(
      deleteStudentItem({ type: tab.key, id: deleteTarget.id }),
    ).unwrap()

    Swal.fire('Record removed')
    setDeleteTarget(null)
  }

  function renderInput(field) {
    const value = formValues[field.name] ?? ''

    if (field.type === 'course') {
      return (
        <select
          id={`field-${field.name}`}
          name={field.name}
          value={value}
          onChange={handleChange}
          className="w-full rounded-lg border border-neutral-700 bg-black p-3 text-white outline-none focus:border-yellow-400"
        >
          {courses.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
      )
    }

    if (field.type === 'status') {
      return (
        <select
          id={`field-${field.name}`}
          name={field.name}
          value={value}
          onChange={handleChange}
          className="w-full rounded-lg border border-neutral-700 bg-black p-3 text-white outline-none focus:border-yellow-400"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      )
    }

    return (
      <input
        id={`field-${field.name}`}
        name={field.name}
        type={field.type}
        value={value}
        onChange={handleChange}
        placeholder={field.placeholder ?? field.label}
        className="w-full rounded-lg border border-neutral-700 bg-black p-3 text-white outline-none placeholder:text-neutral-600 focus:border-yellow-400"
      />
    )
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Content"
        title="Study Plan"
        description="Publish the exam dates, tasks and projects your learners need to know about."
        actions={
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-300"
          >
            <Plus size={16} />
            {`Add ${tab.label.slice(0, -1)}`}
          </button>
        }
      />

      <div className="flex flex-wrap gap-2">
        {tabs.map((item) => {
          const Icon = item.icon
          const isActive = item.key === activeKey

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setActiveKey(item.key)
                setSearch('')
              }}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? 'border-yellow-400 bg-yellow-400 text-black'
                  : 'border-neutral-700 text-neutral-300 hover:border-yellow-400 hover:text-yellow-400'
              }`}
            >
              <Icon size={16} />
              {item.label}
              <span className="text-xs opacity-70">
                {student[item.key].length}
              </span>
            </button>
          )
        })}
      </div>

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
            placeholder={`Search ${tab.label.toLowerCase()} by title or course`}
            aria-label={`Search ${tab.label}`}
            className="w-full rounded-lg border border-neutral-700 bg-black py-2 pr-3 pl-9 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-yellow-400"
          />
        </div>
      </section>

      {rows.length === 0 ? (
        <section className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900 p-12 text-center">
          <Search size={28} className="mx-auto text-neutral-600" />
          <h2 className="mt-4 text-lg font-semibold text-white">
            No {tab.label.toLowerCase()} yet
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            {search
              ? 'Try a different search term.'
              : `Add the first one with the button above.`}
          </p>
        </section>
      ) : (
        <section className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-neutral-800 text-xs tracking-widest text-neutral-500 uppercase">
                  {tab.fields.map((field, index) => (
                    <th key={field.name} className="px-5 py-4 font-medium">
                      {index === 0 ? field.label : field.label}
                    </th>
                  ))}
                  <th className="px-5 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-neutral-800/70 transition last:border-0 hover:bg-neutral-800/40"
                  >
                    {tab.fields.map((field, index) => {
                      const value = row[field.name]

                      if (index === 0) {
                        return (
                          <td
                            key={field.name}
                            className="px-5 py-4 font-medium text-white"
                          >
                            {value}
                          </td>
                        )
                      }

                      if (field.type === 'status') {
                        return (
                          <td key={field.name} className="px-5 py-4">
                            <StatusBadge value={value} />
                          </td>
                        )
                      }

                      if (field.type === 'date') {
                        return (
                          <td
                            key={field.name}
                            className="px-5 py-4 text-sm whitespace-nowrap text-neutral-300"
                          >
                            {formatDate(value)}
                          </td>
                        )
                      }

                      if (field.type === 'number') {
                        return (
                          <td
                            key={field.name}
                            className="px-5 py-4 text-sm text-neutral-300"
                          >
                            {value}%
                          </td>
                        )
                      }

                      return (
                        <td
                          key={field.name}
                          className="px-5 py-4 text-sm text-neutral-300"
                        >
                          {value}
                        </td>
                      )
                    })}

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEditForm(row)}
                          title="Edit"
                          aria-label={`Edit ${row.title}`}
                          className="rounded-lg p-2 text-neutral-400 transition hover:bg-yellow-400/10 hover:text-yellow-400"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteTarget(row)}
                          title="Remove"
                          aria-label={`Remove ${row.title}`}
                          className="rounded-lg p-2 text-neutral-400 transition hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <AdminModal
        open={formMode !== null}
        title={
          formMode === 'create' ? `Add ${tab.label.slice(0, -1)}` : 'Edit record'
        }
        description={`This shows up on the student dashboard for the ${tab.label.toLowerCase()} of the chosen course.`}
        onClose={closeForm}
        footer={
          <>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:border-neutral-500 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="study-plan-form"
              className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-300"
            >
              {formMode === 'create' ? 'Add' : 'Save Changes'}
            </button>
          </>
        }
      >
        <form
          id="study-plan-form"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {tab.fields.map((field) => (
            <div key={field.name}>
              <label
                htmlFor={`field-${field.name}`}
                className="mb-2 block text-sm text-neutral-300"
              >
                {field.label}
              </label>
              {renderInput(field)}
            </div>
          ))}

          {formError && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {formError}
            </p>
          )}
        </form>
      </AdminModal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title={`Remove ${tab.label.slice(0, -1).toLowerCase()}`}
        message={`"${deleteTarget?.title ?? ''}" will be removed and the students will no longer see it. This action cannot be undone.`}
        confirmLabel="Remove"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default AdminStudyPlan
