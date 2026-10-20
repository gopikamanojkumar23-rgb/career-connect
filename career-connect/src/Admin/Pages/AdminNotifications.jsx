import {
  AdminPageHeader,
  AdminStatCard,
  StatusBadge,
} from '../Components/AdminUI'

import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Bell, CheckCheck, Send, Trash2 } from 'lucide-react'

import {
  createNotification,
  deleteNotification,
  updateNotification,
} from '../../Redux/Slice/notificationSlice'
import { formatDate } from '../../Redux/selectors'

const audiences = [
  'All Students',
  'Web Development',
  'UI/UX Design',
  'JavaScript',
  'Data Science',
  'Admins',
]

const emptyForm = {
  title: '',
  message: '',
  audience: 'All Students',
}

function AdminNotifications() {
  const dispatch = useDispatch()

  const { items: notifications } = useSelector((state) => state.notifications)

  const [form, setForm] = useState(emptyForm)
  const [sent, setSent] = useState(false)

  const unread = useMemo(() => {
    return notifications.filter((item) => !item.read).length
  }, [notifications])

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function markAllRead() {
    const pending = notifications.filter((item) => !item.read)

    for (const item of pending) {
      await dispatch(updateNotification({ id: item.id, read: true })).unwrap()
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.title.trim() || !form.message.trim()) return

    await dispatch(
      createNotification({
        title: form.title.trim(),
        message: form.message.trim(),
        audience: form.audience,
        recipientId: null,
      }),
    ).unwrap()

    setForm(emptyForm)
    setSent(true)

    window.setTimeout(() => setSent(false), 3000)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Comms"
        title="Notifications"
        description="Broadcast announcements and keep track of what has already gone out."
        actions={
          <button
            type="button"
            onClick={markAllRead}
            disabled={unread === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:border-yellow-400 hover:text-yellow-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CheckCheck size={16} />
            Mark all read
          </button>
        }
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AdminStatCard
          title="Total Notifications"
          value={notifications.length}
          icon={Bell}
          tone="yellow"
        />
        <AdminStatCard title="Unread" value={unread} icon={Bell} tone="orange" />
        <AdminStatCard
          title="Sent This Month"
          value={notifications.length}
          icon={Send}
          tone="green"
        />
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
          <h2 className="font-semibold text-white">Send a notification</h2>
          <p className="mt-1 text-xs text-neutral-500">
            Push an announcement to a group of learners.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="notification-title"
                className="mb-2 block text-sm text-neutral-300"
              >
                Title
              </label>
              <input
                id="notification-title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Campus drive on Friday"
                className="w-full rounded-lg border border-neutral-700 bg-black p-3 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-yellow-400"
              />
            </div>

            <div>
              <label
                htmlFor="notification-message"
                className="mb-2 block text-sm text-neutral-300"
              >
                Message
              </label>
              <textarea
                id="notification-message"
                name="message"
                rows="4"
                value={form.message}
                onChange={handleChange}
                placeholder="Write the announcement..."
                className="w-full rounded-lg border border-neutral-700 bg-black p-3 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-yellow-400"
              />
            </div>

            <div>
              <label
                htmlFor="notification-audience"
                className="mb-2 block text-sm text-neutral-300"
              >
                Audience
              </label>
              <select
                id="notification-audience"
                name="audience"
                value={form.audience}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-700 bg-black p-3 text-sm text-white outline-none focus:border-yellow-400"
              >
                {audiences.map((audience) => (
                  <option key={audience} value={audience}>
                    {audience}
                  </option>
                ))}
              </select>
            </div>

            {sent && (
              <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
                Notification sent successfully.
              </p>
            )}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-300"
            >
              <Send size={16} />
              Send Notification
            </button>
          </form>
        </section>

        <section className="space-y-3 xl:col-span-2">
          {notifications.length === 0 ? (
            <p className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900 p-12 text-center text-sm text-neutral-500">
              No notifications sent yet.
            </p>
          ) : (
            notifications.map((item) => (
              <article
                key={item.id}
                className={`rounded-xl border bg-neutral-900 p-5 transition ${
                  item.read ? 'border-neutral-800' : 'border-yellow-500/30'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-400/10 text-yellow-400">
                      <Bell size={18} />
                    </span>

                    <div>
                      <h2 className="font-semibold text-white">{item.title}</h2>
                      <p className="mt-1 text-sm text-neutral-400">
                        {item.message}
                      </p>
                    </div>
                  </div>

                  <StatusBadge value={item.read ? 'Read' : 'Unread'} />
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-800 pt-4">
                  <p className="text-xs text-neutral-500">
                    {item.audience} · {formatDate(item.createdAt)}
                  </p>

                  <div className="flex items-center gap-3">
                    {!item.read && (
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(updateNotification({ id: item.id, read: true }))
                        }
                        className="text-xs text-neutral-400 transition hover:text-yellow-400"
                      >
                        Mark as read
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        dispatch(deleteNotification(item.id))
                      }
                      aria-label={`Remove ${item.title}`}
                      className="rounded-lg p-1.5 text-neutral-400 transition hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  )
}

export default AdminNotifications
