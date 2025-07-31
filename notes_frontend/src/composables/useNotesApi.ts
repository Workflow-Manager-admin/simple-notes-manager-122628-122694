import { ref } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || '/api/notes'

export interface Note {
  id: string
  title: string
  content: string
  updatedAt: string
  createdAt: string
}

function handleError(e: unknown) {
  // You might want to handle/log errors centrally
  // For now, just rethrow
  throw e
}

// PUBLIC_INTERFACE
export function useNotesApi() {
  /** This is a public function. A composable providing methods for CRUD and search operations on notes. */
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Helper for fetch calls (add backend integration as applicable)
  async function fetchWrapper(path: string, options?: RequestInit) {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${API_URL}${path}`, options)
      if (!res.ok) throw new Error(await res.text())
      return await res.json()
    } catch (e) {
      if (e instanceof Error) {
        error.value = e.message || 'Unknown error'
      } else {
        error.value = 'Unknown error'
      }
      handleError(e)
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  async function listNotes(search: string = ''): Promise<Note[]> {
    /** List all notes. Search if query provided. */
    // Backend expected: GET /?search=...
    return await fetchWrapper(search ? `?search=${encodeURIComponent(search)}` : '') || []
  }

  // PUBLIC_INTERFACE
  async function createNote(note: { title: string; content: string }): Promise<Note> {
    /** Create a new note. */
    // Backend expected: POST /
    return await fetchWrapper('', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    })
  }

  // PUBLIC_INTERFACE
  async function updateNote(note: Note): Promise<Note> {
    /** Update a note by id. */
    // Backend expected: PUT /:id
    return await fetchWrapper(`/${note.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    })
  }

  // PUBLIC_INTERFACE
  async function deleteNote(id: string): Promise<void> {
    /** Delete a note by id. */
    // Backend expected: DELETE /:id
    await fetchWrapper(`/${id}`, { method: 'DELETE' })
  }

  // PUBLIC_INTERFACE
  async function getNote(id: string): Promise<Note> {
    /** Get note details by id. */
    // Backend expected: GET /:id
    return await fetchWrapper(`/${id}`)
  }

  return {
    loading,
    error,
    listNotes,
    createNote,
    updateNote,
    deleteNote,
    getNote,
  }
}
