import { useState, useCallback, useRef, useEffect } from 'react'
import { Streamdown } from 'streamdown'
import { code } from '@streamdown/code'
import { MDCRenderer } from './components/MDCRenderer'
import './App.css'

// Example MDC content demonstrating custom components
const mdcExample = `# Welcome to Streamdown + MDC

This demo shows how to use **remark-mdc** with custom Vue/React-style components.

## Custom Components

::alert{type="info"}
This is an info alert using the MDC block component syntax.
::

::alert{type="warning"}
Warning! This demonstrates the warning style alert.
::

::callout{icon="💡" title="Pro Tip"}
You can use props to customize component behavior. The \`icon\` and \`title\` props are passed to the Callout component.
::

::card{title="Feature Card"}
Cards are great for highlighting important information or features.

- Supports **markdown** inside
- Renders children properly
- Fully customizable
::

## Inline Components

You can also use inline components like :badge[New]{color="green"} or :badge[Beta]{color="yellow"} or :badge[Deprecated]{color="red"}.

## Code Example

\`\`\`typescript
import { MDCRenderer } from './components/MDCRenderer'

// Render MDC content with custom components
<MDCRenderer content={mdcContent} />
\`\`\`

## Regular Markdown

Regular markdown works too:

1. First item
2. Second item
3. Third item

> Blockquotes are also supported and styled nicely.

---

Learn more about [remark-mdc](https://github.com/nuxtlabs/remark-mdc) and [Streamdown](https://github.com/vercel/streamdown).
`

// Streaming speed options
const SPEEDS = {
  slow: 30,
  normal: 15,
  fast: 5,
}

function useStreamingText(fullText: string, speed: number = 15) {
  const [streamedText, setStreamedText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const indexRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsStreaming(false)
    setIsPaused(false)
  }, [])

  const start = useCallback(() => {
    stop()
    setStreamedText('')
    indexRef.current = 0
    setIsStreaming(true)
    setIsPaused(false)

    intervalRef.current = setInterval(() => {
      if (indexRef.current < fullText.length) {
        // Stream a few characters at a time for more natural feel
        const chunkSize = Math.floor(Math.random() * 3) + 1
        const nextIndex = Math.min(indexRef.current + chunkSize, fullText.length)
        setStreamedText(fullText.slice(0, nextIndex))
        indexRef.current = nextIndex
      } else {
        stop()
      }
    }, speed)
  }, [fullText, speed, stop])

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsPaused(true)
  }, [])

  const resume = useCallback(() => {
    if (!isPaused) return
    setIsPaused(false)

    intervalRef.current = setInterval(() => {
      if (indexRef.current < fullText.length) {
        const chunkSize = Math.floor(Math.random() * 3) + 1
        const nextIndex = Math.min(indexRef.current + chunkSize, fullText.length)
        setStreamedText(fullText.slice(0, nextIndex))
        indexRef.current = nextIndex
      } else {
        stop()
      }
    }, speed)
  }, [fullText, speed, isPaused, stop])

  const reset = useCallback(() => {
    stop()
    setStreamedText('')
    indexRef.current = 0
  }, [stop])

  const complete = useCallback(() => {
    stop()
    setStreamedText(fullText)
    indexRef.current = fullText.length
  }, [fullText, stop])

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const progress = fullText.length > 0 ? (indexRef.current / fullText.length) * 100 : 0

  return {
    streamedText,
    isStreaming,
    isPaused,
    progress,
    start,
    pause,
    resume,
    stop,
    reset,
    complete,
  }
}

function App() {
  const [activeTab, setActiveTab] = useState<'mdc' | 'streamdown'>('mdc')
  const [mdcContent, setMdcContent] = useState(mdcExample)
  const [speed, setSpeed] = useState<keyof typeof SPEEDS>('normal')

  const {
    streamedText,
    isStreaming,
    isPaused,
    start,
    pause,
    resume,
    reset,
    complete,
  } = useStreamingText(mdcContent, SPEEDS[speed])

  const handleTabChange = (tab: 'mdc' | 'streamdown') => {
    reset()
    setActiveTab(tab)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Streamdown + MDC Demo</h1>
          <p className="text-zinc-400">
            Combining Vercel's Streamdown with remark-mdc for streaming custom components
          </p>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => handleTabChange('mdc')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'mdc'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            MDC Streaming
          </button>
          <button
            onClick={() => handleTabChange('streamdown')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'streamdown'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            Streamdown
          </button>
        </div>

        {/* Streaming Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-zinc-900 rounded-xl border border-zinc-800">
          <div className="flex gap-2">
            {!isStreaming && !isPaused && (
              <button
                onClick={start}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                Start Streaming
              </button>
            )}
            {isStreaming && !isPaused && (
              <button
                onClick={pause}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
                </svg>
                Pause
              </button>
            )}
            {isPaused && (
              <button
                onClick={resume}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                Resume
              </button>
            )}
            {(isStreaming || isPaused || streamedText) && (
              <>
                <button
                  onClick={complete}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3.5 2A1.5 1.5 0 002 3.5v13A1.5 1.5 0 003.5 18h13a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0012.378 2H3.5z" />
                  </svg>
                  Complete
                </button>
                <button
                  onClick={reset}
                  className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0v2.43l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389 5.5 5.5 0 019.201-2.466l.312.311h-2.433a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd" />
                  </svg>
                  Reset
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-zinc-400">Speed:</span>
            <select
              value={speed}
              onChange={(e) => setSpeed(e.target.value as keyof typeof SPEEDS)}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-zinc-600"
              disabled={isStreaming}
            >
              <option value="slow">Slow</option>
              <option value="normal">Normal</option>
              <option value="fast">Fast</option>
            </select>
          </div>

          {/* Progress indicator */}
          {(isStreaming || isPaused) && (
            <div className="w-full flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-100"
                  style={{ width: `${(streamedText.length / mdcContent.length) * 100}%` }}
                />
              </div>
              <span className="text-xs text-zinc-500 tabular-nums">
                {streamedText.length} / {mdcContent.length}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <h3 className="text-sm font-medium text-zinc-400 mb-3">
              {activeTab === 'mdc' ? 'MDC Source' : 'Markdown Source'}
            </h3>
            <textarea
              value={mdcContent}
              onChange={(e) => {
                setMdcContent(e.target.value)
                reset()
              }}
              className="w-full h-[500px] bg-zinc-950 text-zinc-300 font-mono text-sm p-4 rounded-lg border border-zinc-800 resize-none focus:outline-none focus:border-zinc-600"
              placeholder="Enter MDC content here..."
            />
          </div>

          {/* Preview */}
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-zinc-400">
                Streaming Preview
                {isStreaming && (
                  <span className="ml-2 inline-flex items-center gap-1 text-green-400">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Live
                  </span>
                )}
              </h3>
            </div>
            <div className="h-[500px] overflow-y-auto pr-2">
              {activeTab === 'mdc' ? (
                streamedText ? (
                  <MDCRenderer content={streamedText} />
                ) : (
                  <div className="text-zinc-500 text-center py-12">
                    Click "Start Streaming" to see MDC components render in real-time
                  </div>
                )
              ) : (
                <Streamdown plugins={{ code }} isAnimating={isStreaming}>
                  {streamedText || ''}
                </Streamdown>
              )}
              {isStreaming && (
                <span className="inline-block w-2 h-5 bg-blue-400 animate-pulse ml-0.5" />
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 p-4 bg-zinc-900 rounded-xl border border-zinc-800">
          <h3 className="font-semibold mb-2">About this demo</h3>
          <p className="text-zinc-400 text-sm mb-3">
            This project demonstrates streaming MDC (Markdown Components) content, similar to how AI chat interfaces stream responses.
            The MDC parser handles incomplete markdown gracefully, rendering components as they stream in.
          </p>
          <div className="flex flex-wrap gap-2 text-sm">
            <a href="https://github.com/vercel/streamdown" className="text-blue-400 hover:underline">
              Streamdown
            </a>
            <span className="text-zinc-600">|</span>
            <a href="https://github.com/nuxtlabs/remark-mdc" className="text-blue-400 hover:underline">
              remark-mdc
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
