import { StatusBadge } from "./StatusBadge"
import { PriorityIcon } from "./PriorityIcon"
import type { Task } from "@/types/task"
import { formatDistanceToNow } from "date-fns"
import { Calendar, Tag, X } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { getTagColor } from "@/lib/tag-colors"

interface TaskCardProps {
  task: Task
  onClick?: () => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const [showImageModal, setShowImageModal] = useState(false)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setShowImageModal(false)
  }, [])

  useEffect(() => {
    if (showImageModal) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showImageModal, handleKeyDown])

  return (
    <>
      <div
        className="group bg-card border rounded-xl p-4 cursor-pointer hover:border-primary/30 hover:shadow-sm transition-all duration-200"
        onClick={onClick}
      >
        {/* Image */}
        {task.image_url && (
          <div className="mb-3 -mx-4 -mt-4">
            <img
              src={task.image_url}
              alt={task.title}
              className="w-full h-40 object-cover rounded-t-xl cursor-zoom-in hover:opacity-95 transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
                setShowImageModal(true)
              }}
            />
          </div>
        )}

        {/* Title */}
        <h3 className="font-medium text-sm leading-snug line-clamp-2 mb-2">
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {task.description}
          </p>
        )}

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap mb-3">
            {task.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md ${getTagColor(tag)}`}
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
            {task.tags.length > 2 && (
              <span className="text-[10px] text-muted-foreground">
                +{task.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <StatusBadge status={task.status} />
          <PriorityIcon priority={task.priority} />
          <span className="flex-1" />
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Calendar className="w-2.5 h-2.5" />
            {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
          </span>
        </div>
      </div>

      {/* Image Preview Modal */}
      {showImageModal && task.image_url && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowImageModal(false)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            onClick={() => setShowImageModal(false)}
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={task.image_url}
            alt={task.title}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
