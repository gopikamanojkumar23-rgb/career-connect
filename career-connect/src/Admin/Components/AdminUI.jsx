import { useEffect } from 'react'
import { TrendingUp, X } from 'lucide-react'

const toneStyles = {
  yellow: 'bg-yellow-400/10 text-yellow-400',
  blue: 'bg-sky-500/10 text-sky-400',
  green: 'bg-emerald-500/10 text-emerald-400',
  purple: 'bg-violet-500/10 text-violet-400',
  orange: 'bg-orange-500/10 text-orange-400',
  red: 'bg-red-500/10 text-red-400',
}

const variantStyles = {
  Active: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  Pending: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
  Suspended: 'border-red-500/30 bg-red-500/10 text-red-400',
  Completed: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  Submitted: 'border-sky-500/30 bg-sky-500/10 text-sky-400',
  Review: 'border-orange-500/30 bg-orange-500/10 text-orange-400',
  Rejected: 'border-red-500/30 bg-red-500/10 text-red-400',
  Unread: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
  Read: 'border-neutral-700 bg-neutral-800 text-neutral-400',
  Open: 'border-orange-500/30 bg-orange-500/10 text-orange-400',
  Resolved: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  Admin: 'border-violet-500/30 bg-violet-500/10 text-violet-400',
  Student: 'border-neutral-700 bg-neutral-800 text-neutral-300',
}

export function AdminPageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <span className="text-xs font-semibold tracking-widest text-yellow-400 uppercase">
            {eyebrow}
          </span>
        )}

        <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
          {title}
        </h1>

        {description && (
          <p className="mt-2 max-w-2xl text-sm text-neutral-400">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </div>
  )
}

export function AdminStatCard({
  title,
  value,
  icon: Icon,
  tone = 'yellow',
  trend,
  hint,
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 transition hover:border-yellow-400/60">
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            toneStyles[tone] ?? toneStyles.yellow
          }`}
        >
          <Icon size={22} />
        </div>

        {trend && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
            <TrendingUp size={13} />
            {trend}
          </span>
        )}
      </div>

      <p className="mt-4 text-sm text-neutral-400">{title}</p>
      <p className="mt-1 text-3xl font-bold text-white">{value}</p>

      {hint && <p className="mt-2 text-xs text-neutral-500">{hint}</p>}
    </div>
  )
}

export function StatusBadge({ value }) {
  const styles = variantStyles[value] ?? variantStyles.Student

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap ${styles}`}
    >
      {value}
    </span>
  )
}

export function AdminModal({ open, title, description, onClose, children, footer }) {
  useEffect(() => {
    if (!open) return undefined

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-neutral-800 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            {description && (
              <p className="mt-1 text-sm text-neutral-400">{description}</p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-neutral-400 transition hover:bg-neutral-800 hover:text-yellow-400"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-5">{children}</div>

        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-neutral-800 px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
}) {
  return (
    <AdminModal
      open={open}
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:border-neutral-500 hover:text-white"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400"
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm leading-relaxed text-neutral-300">{message}</p>
    </AdminModal>
  )
}
