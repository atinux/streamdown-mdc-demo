import { useEffect, useState, type ReactNode } from 'react'
import { parseMDC, type MDCNode } from '../lib/mdc-parser'
import { mdcComponents } from './MDCComponents'

interface MDCRendererProps {
  content: string
  components?: Record<string, React.ComponentType<{ children?: ReactNode; [key: string]: unknown }>>
}

/**
 * Render an MDC node to React elements
 */
function renderNode(node: MDCNode, customComponents: MDCRendererProps['components'], key: string | number): ReactNode {
  // Text node
  if (node.type === 'text') {
    return node.value
  }

  // Component nodes (block, inline, or text components)
  if (node.type === 'containerComponent' || node.type === 'leafComponent' || node.type === 'textComponent') {
    const componentName = node.name?.toLowerCase() || ''
    const Component = customComponents?.[componentName]

    if (Component) {
      const children = node.children?.map((child, i) => renderNode(child, customComponents, `${key}-${i}`))
      return <Component key={key} {...(node.attributes || {})}>{children}</Component>
    }

    // Fallback for unknown components
    return (
      <div key={key} className="border border-dashed border-zinc-600 p-2 my-2 rounded">
        <span className="text-xs text-zinc-500">Unknown component: {node.name}</span>
        <div>
          {node.children?.map((child, i) => renderNode(child, customComponents, `${key}-${i}`))}
        </div>
      </div>
    )
  }

  // Paragraph
  if (node.type === 'paragraph') {
    return (
      <p key={key} className="mb-4 leading-relaxed">
        {node.children?.map((child, i) => renderNode(child, customComponents, `${key}-${i}`))}
      </p>
    )
  }

  // Heading
  if (node.type === 'heading') {
    const depth = (node as MDCNode & { depth?: number }).depth || 1
    const sizes: Record<number, string> = {
      1: 'text-3xl font-bold mb-6',
      2: 'text-2xl font-bold mb-4',
      3: 'text-xl font-semibold mb-3',
      4: 'text-lg font-semibold mb-2',
      5: 'text-base font-semibold mb-2',
      6: 'text-sm font-semibold mb-2'
    }
    const children = node.children?.map((child, i) => renderNode(child, customComponents, `${key}-${i}`))
    const className = sizes[depth]
    switch (depth) {
      case 1: return <h1 key={key} className={className}>{children}</h1>
      case 2: return <h2 key={key} className={className}>{children}</h2>
      case 3: return <h3 key={key} className={className}>{children}</h3>
      case 4: return <h4 key={key} className={className}>{children}</h4>
      case 5: return <h5 key={key} className={className}>{children}</h5>
      default: return <h6 key={key} className={className}>{children}</h6>
    }
  }

  // Code block
  if (node.type === 'code') {
    const codeNode = node as MDCNode & { value?: string; lang?: string }
    return (
      <pre key={key} className="bg-zinc-900 rounded-lg p-4 my-4 overflow-x-auto border border-zinc-800">
        <code className="text-sm text-zinc-300 font-mono">{codeNode.value}</code>
      </pre>
    )
  }

  // Inline code
  if (node.type === 'inlineCode') {
    return (
      <code key={key} className="bg-zinc-800 px-1.5 py-0.5 rounded text-sm text-pink-300 font-mono">
        {(node as MDCNode & { value?: string }).value}
      </code>
    )
  }

  // Strong/bold
  if (node.type === 'strong') {
    return (
      <strong key={key} className="font-bold">
        {node.children?.map((child, i) => renderNode(child, customComponents, `${key}-${i}`))}
      </strong>
    )
  }

  // Emphasis/italic
  if (node.type === 'emphasis') {
    return (
      <em key={key} className="italic">
        {node.children?.map((child, i) => renderNode(child, customComponents, `${key}-${i}`))}
      </em>
    )
  }

  // Link
  if (node.type === 'link') {
    const linkNode = node as MDCNode & { url?: string }
    return (
      <a key={key} href={linkNode.url} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
        {node.children?.map((child, i) => renderNode(child, customComponents, `${key}-${i}`))}
      </a>
    )
  }

  // List
  if (node.type === 'list') {
    const listNode = node as MDCNode & { ordered?: boolean }
    const Tag = listNode.ordered ? 'ol' : 'ul'
    return (
      <Tag key={key} className={`mb-4 pl-6 ${listNode.ordered ? 'list-decimal' : 'list-disc'}`}>
        {node.children?.map((child, i) => renderNode(child, customComponents, `${key}-${i}`))}
      </Tag>
    )
  }

  // List item
  if (node.type === 'listItem') {
    return (
      <li key={key} className="mb-1">
        {node.children?.map((child, i) => renderNode(child, customComponents, `${key}-${i}`))}
      </li>
    )
  }

  // Blockquote
  if (node.type === 'blockquote') {
    return (
      <blockquote key={key} className="border-l-4 border-zinc-600 pl-4 italic text-zinc-400 my-4">
        {node.children?.map((child, i) => renderNode(child, customComponents, `${key}-${i}`))}
      </blockquote>
    )
  }

  // Thematic break (hr)
  if (node.type === 'thematicBreak') {
    return <hr key={key} className="border-zinc-700 my-6" />
  }

  // Default: render children
  if (node.children) {
    return node.children.map((child, i) => renderNode(child, customComponents, `${key}-${i}`))
  }

  return null
}

/**
 * MDC Renderer component
 * Parses MDC content and renders it with custom components
 */
export function MDCRenderer({ content, components = mdcComponents }: MDCRendererProps) {
  const [parsed, setParsed] = useState<{ body: MDCNode } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    parseMDC(content)
      .then(result => {
        setParsed(result)
        setError(null)
      })
      .catch(err => {
        setError(err.message)
        setParsed(null)
      })
  }, [content])

  if (error) {
    return (
      <div className="text-red-400 p-4 bg-red-500/10 rounded">
        Error parsing MDC: {error}
      </div>
    )
  }

  if (!parsed) {
    return <div className="text-zinc-500">Loading...</div>
  }

  return (
    <div className="mdc-content">
      {renderNode(parsed.body, components, 'root')}
    </div>
  )
}
