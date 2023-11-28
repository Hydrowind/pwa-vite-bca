<script setup>
import { ref, onMounted } from 'vue';

// Create Broadcast Channel and listen to messages sent to it
const broadcast = new BroadcastChannel('sw-update-channel');
let payload = ref('');

broadcast.onmessage = (event) => {
  if (event.data && event.data.type === 'CRITICAL_SW_UPDATE') {
    // Show "update to refresh" banner to the user.
    payload = event.data.payload;

    // Log the payload to the console
    console.log(payload);
    // show()
  }
};

// Define reactive variables
const title = ref('Fetching Data Example');
const items = ref([]);

// Define a function to fetch data
const fetchData = async () => {
  try {
    
    const response = await fetch('https://pokeapi.co/api/v2/pokemon');
    if (response.ok) {
      const data = await response.json();
      items.value = data.results;

      // POST
      // for(let i of items.value){
      //     const postResponse = await fetch('https://65571112bd4bcef8b611fb73.mockapi.io/bca/test', {
      //         method: 'POST',
      //         headers: {
      //         'Content-Type': 'application/json',
      //         },
      //         body: JSON.stringify({
      //             name: i.name
      //         }),
      //     });
      // }

    } else {
      console.error('Failed to fetch data');
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

// Call fetchData when the component is mounted
// onMounted();
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <v-btn @click="fetchData" variant="elevated">Button</v-btn>
    <!-- <button @click="fetchData"> Fetch </button> -->
    <ul>
      <li v-for="item in items" :key="item.name">{{ item.name }}</li>
    </ul>
  </div>
</template>