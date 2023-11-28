<script setup>
import { ref, computed } from 'vue'
defineProps();

const logBox = ref("");

function log(message) {
  logBox.value += message + "\n";
}

async function scan() {
  log("<INFO>User clicked scan button");

  try {
    const ndef = new window.NDEFReader();
    await ndef.scan();
    log("<INFO> Scan started");

    ndef.addEventListener("readingerror", () => {
      log("<ERROR> Cannot read data from the NFC tag. Try another one?");
    });

    // ndef.addEventListener("reading", ({ message, serialNumber }: any) => {
    //   log(`<INFO> Serial Number: ${serialNumber}`);
    //   log(`<INFO> Records: (${message.records.length})`);
    // });

    ndef.addEventListener("reading", (reading) => {
      log(`<INFO> Reading: ${reading}`);
      console.log(reading)
    });
  } catch (error) {
    log("<ERROR>" + error);
  }
}

async function write() {
  log("<INFOR> User clicked write button");

  try {
    const ndef = new window.NDEFReader();
    await ndef.write("Hello world!");
    log("<INFO> Message written");
  } catch (error) {
    log("<ERROR> " + error);
  }
}

const computedLogs = computed(() => {
  return !("NDEFReader" in window)
    ? "<ERROR> Web NFC is not available. Use Chrome on Android."
    : logBox.value;
});
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="scan">Scan</button>
    <button type="button" @click="write">Write</button>
  </div>

  <div>
    <pre name="logs" id="logs" cols="30" rows="10">
      {{ computedLogs }}
    </pre>
  </div>
  
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>