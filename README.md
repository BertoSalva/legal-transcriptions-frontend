# Khanyisa Legal Transcriptions Frontend

A ready-to-run React + Vite frontend using the charcoal, ivory and soft bronze legal transcription theme.

## Requirements

- Node.js 18+
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite URL shown in your terminal, usually:

```bash
http://localhost:5173
```

## Build for production

```bash
npm run build
npm run preview
```

## Connect to your .NET 8 backend

Create a `.env` file in the project root:

```bash
VITE_API_BASE_URL=https://transcription-backend-weathered-resonance-4933.fly.dev
```

The upload UI is already prepared in `src/App.jsx` inside `ClientPortal`. Uncomment the `fetch` block once your JWT login and transcription endpoint are ready.

## Main files

- `src/App.jsx` - full React frontend
- `src/styles.css` - complete custom styling
- `package.json` - dependencies and scripts
