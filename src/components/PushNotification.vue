
  
  <script setup>
  import { useWebNotification } from '@vueuse/core'
  
  const options = {
    title: 'Hello, world from VueUse!',
    body: 'Hai',
    dir: 'auto',
    lang: 'en',
    renotify: true,
    tag: 'test',
  }
  
  const {
    isSupported,
    show,
    onClick,
    onShow,
    onError,
    onClose,
  } = useWebNotification(options)
  
  onClick((evt => {
    console.log("onclick")
  }))
  onShow((evt => {
    console.log(evt.data.payload.message);
    console.log("onshow")
  }))
  onError((evt => {
    console.log("onerror")
  }))
  onClose((evt => {
    console.log("onclose")
  }))
  
</script>

<template>
  <div>
    <div>
      <p>
        Supported: {{isSupported}}
      </p>
    </div>

    <div v-if="isSupported">
      <button @click="show()">
        Show Notification
      </button>
    </div>
    <div v-else>
      The Notification Web API is not supported in your browser.
    </div>
  </div>
</template>