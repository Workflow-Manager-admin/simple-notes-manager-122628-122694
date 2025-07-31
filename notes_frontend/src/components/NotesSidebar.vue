<script setup lang="ts">
import { ref, defineEmits, defineProps } from 'vue'
import type { Note } from '@/composables/useNotesApi'

const emits = defineEmits(['select', 'search', 'new'])
defineProps<{
  notes: Note[],
  loading: boolean,
  selectedId: string | null,
}>()

const searchQuery = ref('')

function onSearch() {
  emits('search', searchQuery.value)
}
function onSelect(note: Note) {
  emits('select', note)
}
function onNew() {
  emits('new')
}

// Keyboard enter triggers search
function handleKey(e: KeyboardEvent) {
  if (e.key === 'Enter') onSearch()
}
</script>

<template>
  <aside class="sidebar">
    <header>
      <h2>Notes</h2>
      <button @click="onNew" class="accent">+ New</button>
    </header>
    <input
      v-model="searchQuery"
      type="text"
      :placeholder="'Search...'"
      @keyup="handleKey"
      aria-label="Search notes"
    />
    <ul class="notes-list" :class="{loading}">
      <li
        v-for="note in notes"
        :key="note.id"
        :class="{ active: note.id === selectedId }"
        @click="onSelect(note)"
        tabindex="0"
      >
        <div class="note-title">{{ note.title || '(Untitled)' }}</div>
        <div class="note-meta">{{ new Date(note.updatedAt).toLocaleString() }}</div>
      </li>
      <li v-if="notes.length === 0 && !loading" class="no-notes">No notes found.</li>
    </ul>
  </aside>
</template>

<style scoped>
.sidebar {
  background: #fff;
  border-right: 1px solid var(--secondary, #424242);
  min-width: 260px;
  max-width: 320px;
  padding: 0 0.75rem;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.2rem 0 0.75rem;
}
h2 {
  color: var(--primary, #1976D2);
  font-size: 1.3rem;
  margin: 0;
}
button.accent {
  background: var(--accent, #FFC107);
  color: #212121;
  border: none;
  border-radius: 3px;
  padding: 0.3em 0.9em;
  font-size: 1em;
  cursor: pointer;
  font-weight: 600;
  transition: filter 0.1s;
}
button.accent:hover {
  filter: brightness(0.92);
}
input[type="text"] {
  width: 100%;
  margin-bottom: 1em;
  padding: 0.5em 0.7em;
  border: 1px solid #ddd;
  border-radius: 2.5px;
  background: #f8f8f8;
  color: #313131;
  outline: none;
  font-size: 1em;
  transition: border 0.14s;
}
input[type="text"]:focus {
  border: 1.5px solid var(--primary, #1976D2);
}
.notes-list {
  flex: 1;
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin: 0;
}
.notes-list li {
  cursor: pointer;
  padding: 0.8em 0.5em;
  margin-bottom: 0.1em;
  border-radius: 4px;
  background: transparent;
  transition: background 0.13s;
  display: flex;
  flex-direction: column;
}
.notes-list li.active, .notes-list li:hover {
  background: #e3f2fd;
}
.note-title {
  font-weight: 500;
  color: var(--primary, #1976D2);
  font-size: 1.05em;
}
.note-meta {
  font-size: 0.77em;
  color: #9e9e9e;
}
.no-notes {
  padding: 1em 0.5em;
  text-align: center;
  color: #888;
  font-style: italic;
}
.loading {
  opacity: 0.68;
  pointer-events: none;
}
@media (max-width: 650px) {
  .sidebar {
    min-width: 170px;
    max-width: 100vw;
    padding: 0 0.5rem;
  }
  header {
    padding-top: 0.9rem;
  }
}
</style>
