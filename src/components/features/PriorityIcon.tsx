import type { TaskPriority } from "@/types/task"

interface PriorityIconProps {
  priority: TaskPriority
}

const config: Record<TaskPriority, { label: string; bgColor: string; textColor: string }> = {
  low: {
    label: "Rendah",
    bgColor: "bg-slate-100 dark:bg-slate-800/50",
    textColor: "text-slate-500 dark:text-slate-400",
  },
  medium: {
    label: "Sedang",
    bgColor: "bg-blue-50 dark:bg-blue-950/50",
    textColor: "text-blue-500 dark:text-blue-400",
  },
  high: {
    label: "Tinggi",
    bgColor: "bg-orange-50 dark:bg-orange-950/50",
    textColor: "text-orange-500 dark:text-orange-400",
  },
  critical: {
    label: "Kritis",
    bgColor: "bg-red-50 dark:bg-red-950/50",
    textColor: "text-red-500 dark:text-red-400",
  },
}

export function PriorityIcon({ priority }: PriorityIconProps) {
  const { label, bgColor, textColor } = config[priority]

  return (
    <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full ${bgColor} ${textColor}`}>
      {label}
    </span>
  )
}
