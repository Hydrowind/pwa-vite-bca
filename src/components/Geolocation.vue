<script setup>
import { ref } from "vue";

const status = ref("");
const mapLink = ref("");
const mapString = ref("");

function geoFindMe() {
  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    status.value = "";
    mapLink.value = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    mapString.value = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
  }

  function error() {
    status.value = "Unable to retrieve your location";
  }

  if (!navigator.geolocation) {
    status.value = "Geolocation is not supported by your browser";
  } else {
    status.value = "Locating…";
    navigator.geolocation.getCurrentPosition(success, error);
  }
}
</script>

<template>
  <div class="card">
    <button type="button" @click="geoFindMe">Show my location</button>
  </div>

  <p>{{ status }}</p>
  <a :href="mapLink">{{ mapString }}</a>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>