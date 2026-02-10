import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, Code2, Circle } from "lucide-react"
import type { TaskStatus } from "@/types/task"

interface StatusBadgeProps {
  status: TaskStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    todo: {
      label: "To Do",
      variant: "secondary" as const,
      icon: Circle,
    },
    in_progress: {
      label: "In Progress",
      variant: "default" as const,
      icon: Clock,
    },
    code_review: {
      label: "Code Review",
      variant: "outline" as const,
      icon: Code2,
    },
    done: {
      label: "Done",
      variant: "default" as const,
      icon: CheckCircle2,
    },
  }

  const { label, variant, icon: Icon } = config[status]

  return (
    <Badge variant={variant} className="gap-1.5">
      <Icon className="w-3 h-3" />
      {label}
    </Badge>
  )
}
