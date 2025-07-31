<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNotesApi, type Note } from '@/composables/useNotesApi'
import NotesSidebar from '@/components/NotesSidebar.vue'
import NoteEditor from '@/components/NoteEditor.vue'

// State
const notes = ref<Note[]>([])
const selectedNoteId = ref<string | null>(null)
const creatingNew = ref(false)
const searchQuery = ref('')
const { loading, error, listNotes, createNote, updateNote, deleteNote } = useNotesApi()

const currentNote = ref<Note | null>(null)
const isNewNote = ref(false)
const statusMsg = ref('')

// PUBLIC_INTERFACE
async function fetchNotes(q = '') {
  notes.value = await listNotes(q)
  if (notes.value.length > 0 && !selectedNoteId.value && !creatingNew.value) {
    // Select first note by default
    selectNote(notes.value[0])
  }
}
onMounted(() => fetchNotes())

// PUBLIC_INTERFACE
function selectNote(note: Note) {
  selectedNoteId.value = note.id
  currentNote.value = note
  creatingNew.value = false
  isNewNote.value = false
  statusMsg.value = ''
}

// PUBLIC_INTERFACE
function startNewNote() {
  creatingNew.value = true
  isNewNote.value = true
  selectedNoteId.value = null
  currentNote.value = {
    id: '',
    title: '',
    content: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  statusMsg.value = ''
}

// PUBLIC_INTERFACE
async function handleSave(note: Note) {
  try {
    if (isNewNote.value) {
      const newNote = await createNote({ title: note.title, content: note.content })
      statusMsg.value = 'Note created'
      await fetchNotes()
      selectNote(newNote)
      isNewNote.value = false
      creatingNew.value = false
    } else if (note.id) {
      const updated = await updateNote(note)
      statusMsg.value = 'Note updated'
      // Update in local array
      await fetchNotes()
      selectNote(updated)
    }
  } catch {
    statusMsg.value = 'Error saving note'
  }
}

// PUBLIC_INTERFACE
async function handleDelete(noteId: string) {
  try {
    await deleteNote(noteId)
    statusMsg.value = 'Note deleted'
    await fetchNotes()
    // Select another note if possible
    if (notes.value.length > 0) selectNote(notes.value[0])
    else {
      currentNote.value = null
      selectedNoteId.value = null
    }
  } catch {
    statusMsg.value = 'Error deleting note'
  }
}

// PUBLIC_INTERFACE
function handleSearch(q: string) {
  searchQuery.value = q
  fetchNotes(q)
  currentNote.value = null
  selectedNoteId.value = null
  creatingNew.value = false
}

// PUBLIC_INTERFACE
function handleCancel() {
  // Discard edit/new
  if (notes.value.length > 0) selectNote(notes.value[0])
  else {
    currentNote.value = null
    selectedNoteId.value = null
    creatingNew.value = false
  }
}
</script>

<template>
  <div class="notes-app-root">
    <NotesSidebar
      :notes="notes"
      :loading="loading"
      :selected-id="selectedNoteId"
      @select="selectNote"
      @search="handleSearch"
      @new="startNewNote"
    />
    <main class="main-area">
      <div v-if="error" class="error-msg">{{ error }}</div>
      <div v-if="statusMsg" class="status-msg">{{ statusMsg }}</div>
      <NoteEditor
        v-model="currentNote"
        :is-new="isNewNote"
        @save="handleSave"
        @delete="handleDelete"
        @cancel="handleCancel"
      />
    </main>
  </div>
</template>

<style scoped>
.notes-app-root {
  display: flex;
  min-height: 100vh;
  background: var(--color-background, #fafafa);
}
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.error-msg {
  color: #c62828;
  background: #ffebee;
  padding: 0.7em 1.1em;
  border-radius: 4px;
  margin: 1em;
  font-size: 1.08em;
}
.status-msg {
  color: #388e3c;
  background: #e8f5e9;
  padding: 0.7em 1.1em;
  border-radius: 4px;
  margin: 1em;
  font-size: 1.08em;
}
@media (max-width: 650px) {
  .notes-app-root {
    flex-direction: column;
  }
  .main-area {
    min-width: 100vw;
    padding: 0;
  }
}
</style>
