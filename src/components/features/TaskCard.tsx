import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "./StatusBadge"
import { PriorityIcon } from "./PriorityIcon"
import type { Task } from "@/types/task"
import { formatDistanceToNow } from "date-fns"
import { Calendar, Tag, ChevronDown, ChevronUp } from "lucide-react"
import { MarkdownViewer } from "./MarkdownViewer"
import { useState } from "react"
import { getTagColor } from "@/lib/tag-colors"

interface TaskCardProps {
  task: Task
  onClick?: () => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

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
          {!isExpanded ? (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          ) : (
            <MarkdownViewer content={task.description} />
          )}
          {task.description.length > 100 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
              className="mt-2 text-xs text-primary hover:underline flex items-center gap-1"
            >
              {isExpanded ? (
                <>
                  Show less <ChevronUp className="w-3 h-3" />
                </>
              ) : (
                <>
                  Show more <ChevronDown className="w-3 h-3" />
                </>
              )}
            </button>
          )}
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
