import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { Card, CardContent } from '@/components/ui/card'

interface MarkdownViewerProps {
  content: string
  className?: string
}

export function MarkdownViewer({ content, className = '' }: MarkdownViewerProps) {
  return (
    <div className={`prose prose-sm dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        rehypePlugins={[
          [rehypeHighlight, { detect: true, ignoreMissing: true }],
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        ]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : ''

            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          pre({ children }) {
            return (
              <pre className="bg-muted rounded-lg p-4 overflow-x-auto">
                {children}
              </pre>
            )
          },
          h1({ children }) {
            return <h1 className="text-2xl font-bold">{children}</h1>
          },
          h2({ children }) {
            return <h2 className="text-xl font-semibold">{children}</h2>
          },
          h3({ children }) {
            return <h3 className="text-lg font-medium">{children}</h3>
          },
          ul({ children }) {
            return <ul className="list-disc pl-6">{children}</ul>
          },
          ol({ children }) {
            return <ol className="list-decimal pl-6">{children}</ol>
          },
          li({ children }) {
            return <li className="mb-1">{children}</li>
          },
          p({ children }) {
            return <p className="mb-2">{children}</p>
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                {children}
              </blockquote>
            )
          },
          a({ children, href }) {
            return (
              <a
                href={href}
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            )
          },
        }}
      >
        {content || 'No description'}
      </ReactMarkdown>
    </div>
  )
}
