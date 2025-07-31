<script setup lang="ts">
import NotesMainView from './views/NotesMainView.vue'
</script>

<template>
  <NotesMainView />
</template>

<style>
:root {
  --primary: #1976D2;
  --secondary: #424242;
  --accent: #FFC107;
  --background: #fff;
}
body {
  background: var(--background, #fff);
  color: #1a1a1a;
}
</style>
