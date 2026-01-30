import type { ReactNode } from 'react'

interface ComponentProps {
  children?: ReactNode
  [key: string]: unknown
}

/**
 * Alert component - renders different alert styles
 * Usage in MDC: ::alert{type="warning"}
 */
export function Alert({ type = 'info', children }: ComponentProps & { type?: 'info' | 'warning' | 'error' | 'success' }) {
  const styles: Record<string, string> = {
    info: 'bg-blue-500/10 border-blue-500 text-blue-200',
    warning: 'bg-yellow-500/10 border-yellow-500 text-yellow-200',
    error: 'bg-red-500/10 border-red-500 text-red-200',
    success: 'bg-green-500/10 border-green-500 text-green-200'
  }

  return (
    <div className={`p-4 rounded-lg border-l-4 my-4 ${styles[type] || styles.info}`}>
      {children}
    </div>
  )
}

/**
 * Callout component with icon
 * Usage in MDC: ::callout{icon="💡"}
 */
export function Callout({ icon = '📌', title, children }: ComponentProps & { icon?: string; title?: string }) {
  return (
    <div className="bg-zinc-800/50 rounded-lg p-4 my-4 border border-zinc-700">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          {title && <h4 className="font-semibold mb-2 text-white">{title}</h4>}
          <div className="text-zinc-300">{children}</div>
        </div>
      </div>
    </div>
  )
}

/**
 * Card component
 * Usage in MDC: ::card{title="My Card"}
 */
export function Card({ title, children }: ComponentProps & { title?: string }) {
  return (
    <div className="bg-zinc-900 rounded-xl p-6 my-4 border border-zinc-800 shadow-lg">
      {title && <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>}
      <div className="text-zinc-300">{children}</div>
    </div>
  )
}

/**
 * Badge inline component
 * Usage in MDC: :badge[text]{color="blue"}
 */
export function Badge({ children, color = 'blue' }: ComponentProps & { color?: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    green: 'bg-green-500/20 text-green-300 border-green-500/30',
    red: 'bg-red-500/20 text-red-300 border-red-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
  }

  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-sm font-medium border ${colors[color] || colors.blue}`}>
      {children}
    </span>
  )
}

/**
 * Code Group component for tabbed code blocks
 * Usage in MDC: ::code-group
 */
export function CodeGroup({ children }: ComponentProps) {
  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden my-4 border border-zinc-800">
      <div className="flex border-b border-zinc-800 bg-zinc-800/50">
        <span className="px-4 py-2 text-sm text-zinc-400">Code</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

/**
 * Registry of all custom MDC components
 */
export const mdcComponents: Record<string, React.ComponentType<ComponentProps>> = {
  alert: Alert,
  callout: Callout,
  card: Card,
  badge: Badge,
  'code-group': CodeGroup
}
