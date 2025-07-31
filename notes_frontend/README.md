# Notes Frontend

A minimal single-page Vue 3 web app for managing notes, featuring:
- Create, edit, delete, list, and search notes (CRUD).
- Modern split-pane layout: sidebar for all notes & search, main area for note editor.
- Minimal, light theme with color palette:
  - **Primary**: #1976D2
  - **Secondary**: #424242
  - **Accent**: #FFC107

## Usage

1. Copy `.env.example` to `.env` and set `VITE_API_URL` to your notes backend endpoint (e.g., `http://localhost:5000/api/notes`).
2. Install dependencies: `npm install`
3. Launch: `npm run dev`
4. Open the app in your browser.

The UI will try to communicate with the backend listed in your `VITE_API_URL`. If backend isn't present, requests fail gracefully.

## Features

- **Notes Sidebar**: List all notes, search, and create new note.
- **Note Editor**: View, edit, create, or delete the selected note.
- **Simple SPA**: All pages in one clean standalone interface.
- **Minimal State Libraries**: Uses Vue's composition API and Pinia.

## Development

- Vue 3 (Composition API), Vite, TypeScript.
- Use the color palette for global CSS variables (see `App.vue`).
- Further styling edits can be made by changing colors using CSS variables.

## Environment Variables

- `VITE_API_URL`: URL for the notes backend (required for real operation).

> For backend API, see notes_database container docs.

## License

MIT
