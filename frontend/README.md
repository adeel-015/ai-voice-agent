# AI Chat Agent Frontend

Modern chat interface built with SvelteKit and Tailwind CSS.

## Tech Stack

- **SvelteKit** - Full-stack framework
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type safety
- **Vite** - Build tool

## Features

- ✅ Floating chat widget (bottom-right corner)
- ✅ Auto-scrolling messages
- ✅ Typing indicators
- ✅ Error handling with user-friendly messages
- ✅ Session persistence with localStorage
- ✅ Responsive design
- ✅ Smooth animations
- ✅ Real-time message updates

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Backend API running

### Installation

1. **Install dependencies:**

   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:

   ```env
   PUBLIC_API_URL=http://localhost:3001
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

   App will run on http://localhost:5173

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── lib/
│   │   ├── api/
│   │   │   └── chat.ts           # API client
│   │   ├── components/
│   │   │   └── ChatWidget.svelte # Main chat widget
│   │   └── stores/
│   │       └── session.ts        # Session management
│   ├── routes/
│   │   ├── +layout.svelte        # App layout
│   │   └── +page.svelte          # Home page
│   ├── app.css                   # Global styles
│   └── app.html                  # HTML template
├── static/                       # Static assets
├── package.json
├── svelte.config.js
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── vite.config.ts
```

## Chat Widget Features

### User Experience

- **Floating Button:** Always accessible in bottom-right corner
- **Smooth Animations:** Slide-in transitions for better UX
- **Auto-scroll:** Automatically scrolls to latest message
- **Typing Indicator:** Shows when AI is generating response
- **Time Stamps:** Each message shows send time
- **Empty State:** Helpful placeholder when no messages

### Session Management

- **Persistent Sessions:** Uses localStorage to maintain session
- **Auto-restore:** Loads previous conversation on page reload
- **New Sessions:** Creates new session if none exists

### Error Handling

- Network errors shown inline
- User-friendly error messages
- Failed messages are removed from UI
- Retry capability

## Customization

### Colors

Edit [tailwind.config.js](tailwind.config.js) to customize theme:

```js
theme: {
  extend: {
    colors: {
      // Add custom colors
    }
  }
}
```

### Widget Position

Edit [ChatWidget.svelte](src/lib/components/ChatWidget.svelte):

```svelte
<!-- Change from bottom-6 right-6 to your preferred position -->
<div class="fixed bottom-6 right-6 ...">
```

### Widget Size

```svelte
<!-- Default: w-96 h-[600px] -->
<div class="... w-96 h-[600px] ...">
```

## API Integration

The frontend communicates with the backend through REST API:

```typescript
// Send message
await chatAPI.sendMessage(sessionId, message);

// Get history
await chatAPI.getChatHistory(sessionId);

// Create session
await chatAPI.createSession();
```

## Development

### Useful Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run check

# Type checking with watch
npm run check:watch
```

### File Organization

- **Components:** Reusable UI components go in `src/lib/components/`
- **API Logic:** API clients in `src/lib/api/`
- **State:** Svelte stores in `src/lib/stores/`
- **Routes:** Pages in `src/routes/`

## Styling

### Tailwind Classes Used

- **Layout:** `flex`, `fixed`, `grid`
- **Spacing:** `p-4`, `space-y-4`, `gap-4`
- **Colors:** `bg-blue-600`, `text-white`
- **Borders:** `rounded-lg`, `border`
- **Animations:** `animate-bounce`, `animate-pulse`

### Custom Animations

```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Performance

- Lazy loading of chat widget
- Efficient re-rendering with Svelte
- Optimized bundle size
- Fast HMR in development

## Troubleshooting

**Chat widget not showing:**

- Check if component is imported in +layout.svelte
- Verify no CSS conflicts with z-index

**API connection errors:**

- Verify backend is running
- Check PUBLIC_API_URL in .env
- Check browser console for CORS errors

**Session not persisting:**

- Check browser localStorage is enabled
- Verify session store implementation
- Check browser privacy settings

**Messages not updating:**

- Check API response format
- Verify sessionId is valid
- Check browser network tab for failed requests
