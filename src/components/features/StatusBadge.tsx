import type { TaskStatus } from "@/types/task"

interface StatusBadgeProps {
  status: TaskStatus
}

const config: Record<TaskStatus, { label: string; dotColor: string; bgColor: string; textColor: string }> = {
  todo: {
    label: "Belum Mulai",
    dotColor: "bg-slate-400",
    bgColor: "bg-slate-100 dark:bg-slate-800/50",
    textColor: "text-slate-600 dark:text-slate-400",
  },
  in_progress: {
    label: "Dikerjakan",
    dotColor: "bg-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/50",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  code_review: {
    label: "Ditinjau",
    dotColor: "bg-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/50",
    textColor: "text-amber-600 dark:text-amber-400",
  },
  done: {
    label: "Selesai",
    dotColor: "bg-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/50",
    textColor: "text-emerald-600 dark:text-emerald-400",
  },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, dotColor, bgColor, textColor } = config[status]

  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full ${bgColor} ${textColor}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {label}
    </span>
  )
}
