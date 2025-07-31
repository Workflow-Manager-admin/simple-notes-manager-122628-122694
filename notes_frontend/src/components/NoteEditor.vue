<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from 'vue'
import type { Note } from '@/composables/useNotesApi'

const emits = defineEmits(['save', 'delete', 'cancel'])
const props = defineProps<{
  modelValue: Note | null,
  isNew: boolean
}>()

// Local editable note (copies fields to avoid mutating the parent model)
const localNote = ref<Note | null>(null)

// Watch modelValue for changes or when switching notes
watch(() => props.modelValue, (note) => {
  localNote.value = note ? { ...note } : null
}, { immediate: true })

// PUBLIC_INTERFACE
function onSave() {
  if (!localNote.value) return
  emits('save', { ...localNote.value })
}

// PUBLIC_INTERFACE
function onDelete() {
  if (localNote.value) emits('delete', localNote.value.id)
}

// PUBLIC_INTERFACE
function onCancel() {
  emits('cancel')
}
</script>

<template>
  <section v-if="localNote" class="editor">
    <header>
      <input v-model="localNote.title" type="text" placeholder="Note Title" class="editor-title" maxlength="80" />
    </header>
    <textarea
      v-model="localNote.content"
      rows="14"
      placeholder="Type your note here..."
      class="editor-content"
    />
    <div class="actions">
      <button class="primary" @click="onSave">
        {{ isNew ? 'Create' : 'Save' }}
      </button>
      <button v-if="!isNew" class="secondary" @click="onDelete">
        Delete
      </button>
      <button class="ghost" @click="onCancel">
        Cancel
      </button>
    </div>
  </section>
  <section v-else class="empty-state">
    <h2>Select or create a note</h2>
    <p>Notes are autosaved. Click <b>+ New</b> to add your first note.</p>
  </section>
</template>

<style scoped>
.editor {
  display: flex;
  flex-direction: column;
  padding: 2.5rem 1.3rem;
  min-height: 94vh;
}
header {
  margin-bottom: 1.2em;
}
.editor-title {
  width: 100%;
  font-size: 1.3em;
  font-weight: 600;
  border: none;
  border-bottom: 2px solid var(--primary, #1976D2);
  background: transparent;
  padding: 0.3em 0;
  outline: none;
  margin-bottom: 0.7em;
  color: #232323;
}
.editor-title:focus {
  border-bottom: 2px solid var(--accent, #FFC107);
}
.editor-content {
  width: 100%;
  height: 320px;
  font-size: 1.06em;
  font-family: inherit;
  border: 1px solid #e0e0e0;
  border-radius: 3.5px;
  padding: 0.85em;
  margin-bottom: 1.8em;
  outline: none;
  background: #faf5eb;
  color: #282828;
  resize: vertical;
}
.editor-content:focus {
  border: 1.5px solid var(--primary, #1976D2);
}
.actions {
  display: flex;
  gap: 0.9em;
}
button.primary {
  background: var(--primary, #1976D2);
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1em;
  padding: 0.38em 1.16em;
  font-weight: 600;
  cursor: pointer;
}
button.primary:hover {
  background: #1357ad;
}
button.secondary {
  background: var(--secondary, #424242);
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.38em 1.16em;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
}
button.secondary:hover {
  filter: brightness(1.11);
}
button.ghost {
  background: none;
  border: 1.5px solid #bdbdbd;
  color: #757575;
  border-radius: 4px;
  padding: 0.35em 1em;
  font-size: 1em;
  cursor: pointer;
}
button.ghost:hover {
  background: #eeeeee;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 85vh;
  color: #bdbdbd;
  text-align: center;
}
.empty-state h2 {
  font-weight: 600;
  font-size: 1.15em;
  margin-bottom: 0.5em;
}
@media (max-width: 650px) {
  .editor, .empty-state {
    padding: 1.2rem 0.3rem;
    min-height: 91vh;
  }
  .editor-content {
    height: 180px;
  }
}
</style>
