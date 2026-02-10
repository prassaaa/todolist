import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "./StatusBadge"
import { PriorityIcon } from "./PriorityIcon"
import { Task } from "@/types/task"
import { formatDistanceToNow } from "date-fns"
import { Calendar, Tag } from "lucide-react"

interface TaskCardProps {
  task: Task
  onClick?: () => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const tagColors: Record<string, string> = {
    bug: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    feature: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    refactor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    bugfix: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    improvement: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    documentation: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  }

  const getTagColor = (tag: string) => {
    return tagColors[tag.toLowerCase()] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
  }

  return (
    <Card
      className="hover:border-primary/50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-base leading-tight line-clamp-2 flex-1">
            {task.title}
          </h3>
        </div>
      </CardHeader>
      
      {task.description && (
        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        </CardContent>
      )}

      <CardFooter className="pt-0 gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <StatusBadge status={task.status} />
        </div>
        <div className="flex items-center gap-1.5">
          <PriorityIcon priority={task.priority} />
        </div>
        
        <div className="flex-1" />
        
        {task.tags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {task.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className={`text-xs gap-1 ${getTagColor(tag)}`}>
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </Badge>
            ))}
            {task.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{task.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
        </div>
      </CardFooter>
    </Card>
  )
}
