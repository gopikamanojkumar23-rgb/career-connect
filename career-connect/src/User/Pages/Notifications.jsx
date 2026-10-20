
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { updateNotification } from '../../Redux/Slice/notificationSlice'
import { getNotificationsForUser } from '../../Redux/selectors'

function Notification() {
  const dispatch = useDispatch()

  const user = useSelector((state) => state.auth.user)
  const { items: notifications } = useSelector((state) => state.notifications)

  const myNotifications = useMemo(() => {
    return getNotificationsForUser(notifications, user)
  }, [notifications, user])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-yellow-400">Notifications</h1>
        <p className="mt-2 text-neutral-400">
          Stay updated with your assignments.
        </p>
      </div>

      {myNotifications.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900 p-12 text-center text-sm text-neutral-500">
          No notifications for you yet.
        </p>
      ) : (
        <div className="space-y-3">
          {myNotifications.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-xl border border-neutral-800 bg-neutral-900 p-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-400/10 text-xl">
                🔔
              </div>

              <div className="flex-1">
                <h2 className="font-semibold text-yellow-400">{item.title}</h2>
                <p className="mt-1 text-sm text-neutral-300">{item.message}</p>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <p className="text-xs text-neutral-500">
                    {new Date(item.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>

                  {!item.read && (
                    <button
                      type="button"
                      onClick={() =>
                        dispatch(
                          updateNotification({ id: item.id, read: true }),
                        )
                      }
                      className="text-xs text-neutral-400 transition hover:text-yellow-400"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Notification
