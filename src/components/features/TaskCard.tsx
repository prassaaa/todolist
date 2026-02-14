import { StatusBadge } from "./StatusBadge"
import { PriorityIcon } from "./PriorityIcon"
import type { Task } from "@/types/task"
import { formatDistanceToNow } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { Clock, Tag, X, ZoomIn } from "lucide-react"
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
        className="group relative bg-card border border-border/60 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-black/4 dark:hover:shadow-black/20 hover:border-border transition-all duration-300 hover:-translate-y-0.5"
        onClick={onClick}
      >
        {/* Image */}
        {task.image_url && (
          <div className="relative">
            <img
              src={task.image_url}
              alt={task.title}
              className="w-full h-36 object-cover"
              onClick={(e) => {
                e.stopPropagation()
                setShowImageModal(true)
              }}
            />
            {/* Zoom hint on hover */}
            <div
              className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center cursor-zoom-in"
              onClick={(e) => {
                e.stopPropagation()
                setShowImageModal(true)
              }}
            >
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full p-2">
                <ZoomIn className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-4 space-y-2.5">
          {/* Title */}
          <h3 className="font-semibold text-[13px] leading-snug line-clamp-2">
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              {task.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className={`inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-md ${getTagColor(tag)}`}
                >
                  <Tag className="w-2 h-2" />
                  {tag}
                </span>
              ))}
              {task.tags.length > 3 && (
                <span className="text-[10px] text-muted-foreground">+{task.tags.length - 3}</span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center gap-1.5 pt-1">
            <StatusBadge status={task.status} />
            <PriorityIcon priority={task.priority} />
            <span className="flex-1" />
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
              <Clock className="w-2.5 h-2.5" />
              {formatDistanceToNow(new Date(task.created_at), { addSuffix: true, locale: idLocale })}
            </span>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {showImageModal && task.image_url && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md"
          onClick={() => setShowImageModal(false)}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white/90 hover:bg-white/20 hover:text-white transition-all"
            onClick={() => setShowImageModal(false)}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-center">
            <p className="text-white/80 text-sm font-medium truncate">{task.title}</p>
          </div>

          <img
            src={task.image_url}
            alt={task.title}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
