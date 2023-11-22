<script setup>
import HelloWorld from './components/HelloWorld.vue'
import ReloadPrompt from './components/ReloadPrompt.vue'
import PokeFetch from './components/PokeFetch.vue'
import IndexedDB from './components/IndexedDB.vue'
import IndexDBBlob from './components/IndexDBBlob.vue'
import Bison from './components/Bison.vue'

</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <ReloadPrompt />
  <!-- <HelloWorld msg="Vite + Vue 8" />
  <PokeFetch /> -->
  <!-- <IndexDBBlob /> -->
  <Bison />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
