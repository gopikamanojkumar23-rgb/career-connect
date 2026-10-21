import {
  AdminModal,
  AdminPageHeader,
  AdminStatCard,
  ConfirmDialog,
  StatusBadge,
} from '../Components/AdminUI'

import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Download,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserCog,
  Users,
} from 'lucide-react'

import { createUser, deleteUser, updateUser } from '../../Redux/Slice/userSlice'
import { formatDate, getInitials, getUserProgress } from '../../Redux/selectors'
import Swal from 'sweetalert2'
const roles = ['Student', 'Admin']
const statuses = ['Active', 'Pending', 'Suspended']
const courses = [
  'Web Development',
  'UI/UX Design',
  'JavaScript',
  'Data Science',
  'Career Development',
]

const avatarTones = [
  'bg-yellow-400/15 text-yellow-400',
  'bg-sky-500/15 text-sky-400',
  'bg-emerald-500/15 text-emerald-400',
  'bg-violet-500/15 text-violet-400',
  'bg-orange-500/15 text-orange-400',
  'bg-rose-500/15 text-rose-400',
]

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
  role: 'Student',
  course: 'Web Development',
  status: 'Active',
}

function getTone(name) {
  const total = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)

  return avatarTones[total % avatarTones.length]
}

function ManageUsers() {
  const dispatch = useDispatch()

  const { items: users, status } = useSelector((state) => state.users)
  const { items: submissions } = useSelector((state) => state.submissions)

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortKey, setSortKey] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')

  const [formMode, setFormMode] = useState(null)
  const [formValues, setFormValues] = useState(emptyForm)
  const [formError, setFormError] = useState('')

  const [deleteTarget, setDeleteTarget] = useState(null)

  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((user) => user.status === 'Active').length,
      students: users.filter((user) => user.role === 'Student').length,
      pending: users.filter((user) => user.status === 'Pending').length,
    }
  }, [users])

  const visibleUsers = useMemo(() => {
    const query = search.trim().toLowerCase()

    const filtered = users.filter((user) => {
      const matchesSearch =
        query === '' ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.course.toLowerCase().includes(query)

      const matchesRole = roleFilter === 'All' || user.role === roleFilter
      const matchesStatus =
        statusFilter === 'All' || user.status === statusFilter

      return matchesSearch && matchesRole && matchesStatus
    })

    const direction = sortDirection === 'asc' ? 1 : -1

    return [...filtered].sort((a, b) => {
      if (sortKey === 'joined') return (a.joined < b.joined ? -1 : 1) * direction

      return a.name.localeCompare(b.name) * direction
    })
  }, [users, search, roleFilter, statusFilter, sortKey, sortDirection])

  const hasFilters =
    search !== '' || roleFilter !== 'All' || statusFilter !== 'All'

  function resetFilters() {
    setSearch('')
    setRoleFilter('All')
    setStatusFilter('All')
  }

  function openCreateForm() {
    setFormMode('create')
    setFormValues(emptyForm)
    setFormError('')
  }

  function openEditForm(user) {
    setFormMode('edit')
    setFormValues({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: '',
      role: user.role,
      course: user.course,
      status: user.status,
    })
    setFormError('')
  }

  function closeForm() {
    setFormMode(null)
    setFormError('')
  }

  function handleFormChange(event) {
    const { name, value } = event.target

    setFormValues((current) => ({
      ...current,
      [name]: value,
    }))

    setFormError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const name = formValues.name.trim()
    const email = formValues.email.trim()

    if (!name || !email) {
      setFormError('Name and email are required.')
      return
    }

    if (formMode === 'create' && formValues.password.length < 6) {
      setFormError('Password must be at least 6 characters.')
      return
    }

    const isDuplicate = users.some(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() &&
        (formMode === 'create' || user.id !== formValues.id),
    )

    if (isDuplicate) {
      setFormError('A user with this email already exists.')
      return
    }

    try {
      if (formMode === 'create') {
        await dispatch(
          createUser({
            name,
            email,
            phone: formValues.phone.trim(),
            password: formValues.password,
            role: formValues.role,
            course: formValues.course,
            status: formValues.status,
          }),
        ).unwrap()

        Swal.fire(`${name} was added successfully.`)
      } else {
        const changes = {
          id: formValues.id,
          name,
          email,
          phone: formValues.phone.trim(),
          role: formValues.role,
          course: formValues.course,
          status: formValues.status,
        }

        if (formValues.password) {
          changes.password = formValues.password
        }

        await dispatch(updateUser(changes)).unwrap()

        Swal.fire(`${name}'s record was updated.`)
      }

      closeForm()
    } catch (error) {
      setFormError(error)
    }
  }

  async function changeRole(user, role) {
    try {
      await dispatch(updateUser({ id: user.id, role })).unwrap()

      Swal.fire(`${user.name} is now a ${role}.`)
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Something went wrong', text: error })
    }
  }

  async function toggleStatus(user) {
    const nextStatus = user.status === 'Suspended' ? 'Active' : 'Suspended'

    try {
      await dispatch(updateUser({ id: user.id, status: nextStatus })).unwrap()

      Swal.fire(
        `${user.name} was ${nextStatus === 'Active' ? 'reactivated' : 'suspended'}.`,
      )
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Something went wrong', text: error })
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return

    try {
      await dispatch(deleteUser(deleteTarget.id)).unwrap()

      Swal.fire(`${deleteTarget.name} was removed.`)
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Something went wrong', text: error })
    }

    setDeleteTarget(null)
  }

  function exportCsv() {
    const header = ['Name', 'Email', 'Phone', 'Role', 'Course', 'Status', 'Joined']

    const rows = visibleUsers.map((user) => [
      user.name,
      user.email,
      user.phone,
      user.role,
      user.course,
      user.status,
      user.joined,
    ])

    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
      .join('\n')

    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const link = document.createElement('a')

    link.href = url
    link.download = 'careerconnect-users.csv'
    link.click()

    URL.revokeObjectURL(url)

    Swal.fire('User list exported as CSV.')
  }

  const selectClass =
    'rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-yellow-400'

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Users"
        title="Manage Users"
        description="Review every learner on the platform, adjust roles and access, and keep records tidy."
        actions={
          <>
            <button
              type="button"
              onClick={exportCsv}
              disabled={visibleUsers.length === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:border-yellow-400 hover:text-yellow-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download size={16} />
              Export CSV
            </button>

            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-300"
            >
              <Plus size={16} />
              Add User
            </button>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          title="Total Users"
          value={stats.total}
          icon={Users}
          tone="yellow"
          hint="All registered accounts"
        />
        <AdminStatCard
          title="Active Users"
          value={stats.active}
          icon={UserCheck}
          tone="green"
          hint="Currently with full access"
        />
        <AdminStatCard
          title="Students"
          value={stats.students}
          icon={Users}
          tone="blue"
          hint="Enrolled in a course"
        />
        <AdminStatCard
          title="Pending Approval"
          value={stats.pending}
          icon={ShieldCheck}
          tone="orange"
          hint="Awaiting admin review"
        />
      </section>

      <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="relative sm:col-span-2 xl:col-span-1">
            <Search
              size={16}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-neutral-500"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email or course"
              aria-label="Search users"
              className="w-full rounded-lg border border-neutral-700 bg-black py-2 pr-3 pl-9 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-yellow-400"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            aria-label="Filter by role"
            className={selectClass}
          >
            <option value="All">All roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by status"
            className={selectClass}
          >
            <option value="All">All statuses</option>
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <select
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value)}
              aria-label="Sort users"
              className={`${selectClass} flex-1`}
            >
              <option value="name">Sort: Name</option>
              <option value="joined">Sort: Joined</option>
            </select>

            <button
              type="button"
              onClick={() =>
                setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
              }
              aria-label="Toggle sort direction"
              title="Toggle sort direction"
              className="rounded-lg border border-neutral-700 px-3 text-sm text-neutral-300 transition hover:border-yellow-400 hover:text-yellow-400"
            >
              {sortDirection === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-800 pt-4">
          <p className="text-sm text-neutral-500">
            Showing <span className="text-yellow-400">{visibleUsers.length}</span>{' '}
            of {users.length} users
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 text-sm text-neutral-400 transition hover:text-yellow-400"
            >
              <RotateCcw size={14} />
              Reset filters
            </button>
          )}
        </div>
      </section>

      {status === 'loading' && users.length === 0 ? (
        <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-12 text-center text-sm text-neutral-500">
          Loading users...
        </section>
      ) : visibleUsers.length === 0 ? (
        <section className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900 p-12 text-center">
          <Search size={28} className="mx-auto text-neutral-600" />
          <h2 className="mt-4 text-lg font-semibold text-white">No users found</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-500">
            {hasFilters
              ? 'Try adjusting your search or filters to find the users you are looking for.'
              : 'Add your first user to get started.'}
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-300"
            >
              <RotateCcw size={16} />
              Reset filters
            </button>
          )}
        </section>
      ) : (
        <section className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse text-left">
              <thead>
                <tr className="border-b border-neutral-800 text-xs tracking-widest text-neutral-500 uppercase">
                  <th className="px-5 py-4 font-medium">User</th>
                  <th className="px-5 py-4 font-medium">Role</th>
                  <th className="px-5 py-4 font-medium">Course</th>
                  <th className="px-5 py-4 font-medium">Progress</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Joined</th>
                  <th className="px-5 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {visibleUsers.map((user) => {
                  const progress = getUserProgress(submissions, user.id)

                  return (
                    <tr
                      key={user.id}
                      className="border-b border-neutral-800/70 transition last:border-0 hover:bg-neutral-800/40"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${getTone(user.name)}`}
                          >
                            {getInitials(user.name)}
                          </span>

                          <div className="min-w-0">
                            <p className="truncate font-medium text-white">
                              {user.name}
                            </p>
                            <p className="truncate text-xs text-neutral-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={user.role}
                          onChange={(event) => changeRole(user, event.target.value)}
                          aria-label={`Change role for ${user.name}`}
                          className="rounded-lg border border-neutral-700 bg-neutral-900 px-2.5 py-1.5 text-xs text-white outline-none focus:border-yellow-400"
                        >
                          {roles.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-5 py-4 text-sm text-neutral-300">
                        {user.course}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-neutral-800">
                            <div
                              className="h-full rounded-full bg-yellow-400"
                              style={{ width: `${progress.percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-neutral-400">
                            {progress.percentage}%
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge value={user.status} />
                      </td>

                      <td className="px-5 py-4 text-sm whitespace-nowrap text-neutral-400">
                        {formatDate(user.joined)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => toggleStatus(user)}
                            title={
                              user.status === 'Suspended'
                                ? 'Reactivate user'
                                : 'Suspend user'
                            }
                            aria-label={
                              user.status === 'Suspended'
                                ? `Reactivate ${user.name}`
                                : `Suspend ${user.name}`
                            }
                            className="rounded-lg p-2 text-neutral-400 transition hover:bg-yellow-400/10 hover:text-yellow-400"
                          >
                            <UserCog size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditForm(user)}
                            title="Edit user"
                            aria-label={`Edit ${user.name}`}
                            className="rounded-lg p-2 text-neutral-400 transition hover:bg-yellow-400/10 hover:text-yellow-400"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(user)}
                            title="Remove user"
                            aria-label={`Remove ${user.name}`}
                            className="rounded-lg p-2 text-neutral-400 transition hover:bg-red-500/10 hover:text-red-400"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <AdminModal
        open={formMode !== null}
        title={formMode === 'create' ? 'Add New User' : 'Edit User'}
        description={
          formMode === 'create'
            ? 'Create an account and assign the right access level.'
            : 'Update the details and access level for this account.'
        }
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
              form="user-form"
              className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-300"
            >
              {formMode === 'create' ? 'Add User' : 'Save Changes'}
            </button>
          </>
        }
      >
        <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="user-name"
              className="mb-2 block text-sm text-neutral-300"
            >
              Full Name
            </label>
            <input
              id="user-name"
              name="name"
              value={formValues.name}
              onChange={handleFormChange}
              placeholder="Enter the user's full name"
              className="w-full rounded-lg border border-neutral-700 bg-black p-3 text-white outline-none placeholder:text-neutral-600 focus:border-yellow-400"
            />
          </div>

          <div>
            <label
              htmlFor="user-email"
              className="mb-2 block text-sm text-neutral-300"
            >
              Email
            </label>
            <input
              id="user-email"
              name="email"
              type="email"
              value={formValues.email}
              onChange={handleFormChange}
              placeholder="name@example.com"
              className="w-full rounded-lg border border-neutral-700 bg-black p-3 text-white outline-none placeholder:text-neutral-600 focus:border-yellow-400"
            />
          </div>

          <div>
            <label
              htmlFor="user-phone"
              className="mb-2 block text-sm text-neutral-300"
            >
              Phone
            </label>
            <input
              id="user-phone"
              name="phone"
              value={formValues.phone}
              onChange={handleFormChange}
              placeholder="+91 98765 43210"
              className="w-full rounded-lg border border-neutral-700 bg-black p-3 text-white outline-none placeholder:text-neutral-600 focus:border-yellow-400"
            />
          </div>

          <div>
            <label
              htmlFor="user-password"
              className="mb-2 block text-sm text-neutral-300"
            >
              Password{' '}
              {formMode === 'edit' && (
                <span className="text-neutral-600">(leave empty to keep)</span>
              )}
            </label>
            <input
              id="user-password"
              name="password"
              type="password"
              value={formValues.password}
              onChange={handleFormChange}
              placeholder="At least 6 characters"
              className="w-full rounded-lg border border-neutral-700 bg-black p-3 text-white outline-none placeholder:text-neutral-600 focus:border-yellow-400"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="user-role"
                className="mb-2 block text-sm text-neutral-300"
              >
                Role
              </label>
              <select
                id="user-role"
                name="role"
                value={formValues.role}
                onChange={handleFormChange}
                className="w-full rounded-lg border border-neutral-700 bg-black p-3 text-white outline-none focus:border-yellow-400"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="user-status"
                className="mb-2 block text-sm text-neutral-300"
              >
                Status
              </label>
              <select
                id="user-status"
                name="status"
                value={formValues.status}
                onChange={handleFormChange}
                className="w-full rounded-lg border border-neutral-700 bg-black p-3 text-white outline-none focus:border-yellow-400"
              >
                {statuses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="user-course"
              className="mb-2 block text-sm text-neutral-300"
            >
              Course / Track
            </label>
            <select
              id="user-course"
              name="course"
              value={formValues.course}
              onChange={handleFormChange}
              className="w-full rounded-lg border border-neutral-700 bg-black p-3 text-white outline-none focus:border-yellow-400"
            >
              {courses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          {formError && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {formError}
            </p>
          )}
        </form>
      </AdminModal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Remove user"
        message={`This will permanently remove ${deleteTarget?.name ?? 'this user'} and revoke their access. This action cannot be undone.`}
        confirmLabel="Remove user"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default ManageUsers
