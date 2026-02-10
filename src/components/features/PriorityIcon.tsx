import { Badge } from "@/components/ui/badge"
import { AlertTriangle, ArrowUpRight, ArrowRight, Minus } from "lucide-react"
import { TaskPriority } from "@/types/task"

interface PriorityIconProps {
  priority: TaskPriority
}

export function PriorityIcon({ priority }: PriorityIconProps) {
  const config = {
    low: {
      label: "Low",
      variant: "outline" as const,
      icon: Minus,
      className: "text-muted-foreground",
    },
    medium: {
      label: "Medium",
      variant: "outline" as const,
      icon: ArrowRight,
      className: "text-blue-500 dark:text-blue-400",
    },
    high: {
      label: "High",
      variant: "outline" as const,
      icon: ArrowUpRight,
      className: "text-orange-500 dark:text-orange-400",
    },
    critical: {
      label: "Critical",
      variant: "destructive" as const,
      icon: AlertTriangle,
      className: "",
    },
  }

  const { label, variant, icon: Icon, className } = config[priority]

  return (
    <Badge variant={variant} className={`gap-1.5 ${className}`}>
      <Icon className="w-3 h-3" />
      {label}
    </Badge>
  )
}
