<script setup>
import ReloadPrompt from './components/ReloadPrompt.vue'
import TodoList from './components/TodoList.vue'

/* Push Notification */
import { useWebNotification } from '@vueuse/core'
import { onMounted } from 'vue'

const options = {
  title: 'Hello, world from VueUse!',
  dir: 'auto',
  lang: 'en',
  renotify: true,
  tag: 'test',
}

const {
  isSupported,
  show
} = useWebNotification(options)

onMounted(() => {
	// Create Broadcast Channel and listen to messages sent to it
	const broadcast = new BroadcastChannel('sw-update-channel');
	
	// listen from service worker
	broadcast.onmessage = (event) => {
	  if (event.data && event.data.type === 'CRITICAL_SW_UPDATE') {
	    // Show "update to refresh" banner to the user.
	    const payload = event.data.payload;

      // Push Notification
      const options = {
        title: 'Push Notification',
        body: event.data.payload.message,
        dir: 'auto',
        lang: 'en',
        renotify: true,
        tag: 'test',
      }
      
      const { show } = useWebNotification(options)
      
	    // Log the payload to the console
	    console.log(payload);
	    show();
	  }
	};
});

</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
    <h1>PWA VUE TODO LIST</h1>
  </div>
  <ReloadPrompt />
  <br>
  <TodoList />
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
