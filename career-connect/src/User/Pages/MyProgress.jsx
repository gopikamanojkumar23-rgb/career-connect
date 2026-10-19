
const progressItems = [
  { name: 'Portfolio Website', progress: 70 },
  { name: 'Resume Preparation', progress: 40 },
  { name: 'React Mini Project', progress: 100 },
]

function MyProgress() {
  const average = Math.round(
    progressItems.reduce((total, item) => total + item.progress, 0) /
      progressItems.length
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-yellow-400">My Progress</h1>
        <p className="mt-2 text-neutral-400">
          Track your assignment completion.
        </p>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <p className="text-neutral-400">Overall progress</p>
        <p className="mt-2 text-4xl font-bold text-yellow-400">{average}%</p>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-neutral-800">
          <div
            className="h-full rounded-full bg-yellow-400"
            style={{ width: `${average}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {progressItems.map((item) => (
          <div
            key={item.name}
            className="rounded-xl border border-neutral-800 bg-neutral-900 p-5"
          >
            <div className="flex justify-between gap-3">
              <h2 className="font-semibold text-white">{item.name}</h2>
              <span className="text-yellow-400">{item.progress}%</span>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-800">
              <div
                className="h-full rounded-full bg-yellow-400"
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyProgress
