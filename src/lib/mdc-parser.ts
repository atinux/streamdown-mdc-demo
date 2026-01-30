import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMDC from 'remark-mdc'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

export interface MDCNode {
  type: string
  name?: string
  children?: MDCNode[]
  value?: string
  attributes?: Record<string, unknown>
  fmAttributes?: Record<string, unknown>
  data?: {
    hName?: string
    hProperties?: Record<string, unknown>
  }
}

export interface ParsedMDC {
  body: MDCNode
  html: string
}

/**
 * Parse MDC content and return both AST and HTML
 */
export async function parseMDC(content: string): Promise<ParsedMDC> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMDC)

  // Parse to get AST
  const ast = processor.parse(content)
  const mdast = await processor.run(ast)

  // Convert to HTML
  const htmlProcessor = unified()
    .use(remarkParse)
    .use(remarkMDC)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })

  const result = await htmlProcessor.process(content)

  return {
    body: mdast as MDCNode,
    html: String(result)
  }
}

/**
 * Extract component nodes from MDC AST
 */
export function extractComponents(node: MDCNode): MDCNode[] {
  const components: MDCNode[] = []

  function traverse(n: MDCNode) {
    if (n.type === 'containerComponent' || n.type === 'leafComponent' || n.type === 'textComponent') {
      components.push(n)
    }
    if (n.children) {
      n.children.forEach(traverse)
    }
  }

  traverse(node)
  return components
}
