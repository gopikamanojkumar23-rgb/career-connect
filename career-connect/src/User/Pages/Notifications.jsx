
const notifications = [
  {
    id: 1,
    title: 'New Assignment',
    message: 'A new portfolio assignment has been added.',
    time: 'Today',
  },
  {
    id: 2,
    title: 'Deadline Reminder',
    message: 'Remember to check your upcoming deadlines.',
    time: 'Yesterday',
  },
  {
    id: 3,
    title: 'Work Reviewed',
    message: 'Your submitted work is waiting for feedback.',
    time: '2 days ago',
  },
]

function Notification() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-yellow-400">Notifications</h1>
        <p className="mt-2 text-neutral-400">
          Stay updated with your assignments.
        </p>
      </div>

      <div className="space-y-3">
        {notifications.map((item) => (
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
              <p className="mt-3 text-xs text-neutral-500">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Notification
