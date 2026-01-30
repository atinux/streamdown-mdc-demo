# Streamdown + MDC Demo

A demo showcasing streaming MDC (Markdown Components) content, combining [Vercel's Streamdown](https://github.com/vercel/streamdown) with [remark-mdc](https://github.com/nuxtlabs/remark-mdc) for rendering custom components in real-time.

**Live Demo:** https://streamdown-mdc-demo.vercel.app

## Features

- **Streaming Simulation** - Watch MDC content stream character by character, similar to AI chat interfaces
- **Synchronized Panels** - Both source and preview panels stream simultaneously
- **Custom MDC Components** - Alert, Card, Callout, and Badge components
- **Playback Controls** - Start, pause, resume, complete, and reset streaming
- **Adjustable Speed** - Slow, normal, and fast streaming speeds
- **Live Indicators** - Visual feedback showing active streaming state

## MDC Components

The demo includes these custom components:

```markdown
::alert{type="info"}
This is an info alert.
::

::alert{type="warning"}
This is a warning alert.
::

::callout{icon="💡" title="Pro Tip"}
Callout with icon and title.
::

::card{title="Feature Card"}
Card content with **markdown** support.
::

Inline components: :badge[New]{color="green"} :badge[Beta]{color="yellow"}
```

## Tech Stack

- [Vite](https://vite.dev/) - Build tool
- [React](https://react.dev/) + TypeScript
- [Streamdown](https://github.com/vercel/streamdown) - Streaming markdown renderer
- [remark-mdc](https://github.com/nuxtlabs/remark-mdc) - MDC syntax parser
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

```
src/
├── components/
│   ├── MDCComponents.tsx    # Custom MDC components (Alert, Card, etc.)
│   └── MDCRenderer.tsx      # Renders MDC AST to React elements
├── lib/
│   └── mdc-parser.ts        # remark-mdc parser using unified
├── App.tsx                  # Main app with streaming controls
└── index.css                # Tailwind CSS setup
```

## License

MIT
