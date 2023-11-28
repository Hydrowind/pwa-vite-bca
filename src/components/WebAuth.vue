<script setup>
import { client, parsers } from "@passwordless-id/webauthn";
import { ref } from "vue";

const username = ref(null);
const isRegistered = ref(false);
const isAuthenticated = ref(false);
const isRoaming = ref(false);
const registrationData = ref(null);
const authenticationData = ref(null);

async function checkIsRegistered() {
  console.log(
    username.value + " => " + !!window.localStorage.getItem(username.value)
  );
  isRegistered.value = !!window.localStorage.getItem(username.value);
}
async function register() {
  let res = await client.register(username.value, window.crypto.randomUUID(), {
    // authType: this.isRoaming ? "roaming" : "auto",
    authenticatorType: isRoaming.value ? "roaming" : "auto",
  });
  console.debug(res);

  const parsed = parsers.parseRegistration(res);
  console.log(parsed);

  window.localStorage.setItem(username.value, parsed.credential.id);
  isAuthenticated.value = true;
  registrationData.value = parsed;

  // this.$buefy.toast.open({
  //   message: "Registered!",
  //   type: "is-success",
  // });
  console.log("Registered");

  await checkIsRegistered();
}
async function login() {
  let credentialId = window.localStorage.getItem(username.value);
  let res = await client.authenticate(
    credentialId ? [credentialId] : [],
    window.crypto.randomUUID(),
    { authenticatorType: isRoaming.value ? "roaming" : "auto" }
  );
  console.debug(res);

  const parsed = parsers.parseAuthentication(res);
  console.log(parsed);

  isAuthenticated.value = true;
  authenticationData.value = parsed;

  // this.$buefy.toast.open({
  //   message: "Signed in!",
  //   type: "is-success",
  // });

  console.log("Signed in!");
}
async function logout() {
  isAuthenticated.value = false;
  // this.$buefy.toast.open({
  //   message: "Signed out!",
  //   type: "is-success",
  // });
  console.log("Signed out!");
  authenticationData.value = null;
  registrationData.value = null;
}
</script>

<template>
  <template v-if="!isAuthenticated">
    <!-- <b-field> -->
    <input
      v-model="username"
      placeholder="Username"
      @input="checkIsRegistered()"
      autocomplete="webauthn username"
      type="text"
    />
    <!-- </b-field> -->
    <!-- <b-field> -->
    <input type="checkbox" v-model="isRoaming" />
    <p>Use roaming authenticator (phone, usb key...)</p>
    <!-- </b-field> -->
    <div>
      <button @click="register()" :disabled="!username">Register device</button>
      <button @click="login()" :disabled="!isRegistered">Authenticate</button>
    </div>
  </template>
  <template v-if="isAuthenticated">
    <p>{{ "Hello " + username + "!" }}</p>
    <section
      v-if="registrationData && !authenticationData"
      style="text-align: left"
    >
      <p><b>Credential ID:</b> {{ registrationData.credential.id }}</p>
      <p>
        <b>Public Key:</b>
        {{ registrationData.credential.publicKey.substring(0, 32) }}...
      </p>
      <p><b>Algorithm:</b> {{ registrationData.credential.algorithm }}</p>
      <p>
        <b>Authenticator Name:</b> {{ registrationData.authenticator.name }}
      </p>
    </section>
    <section v-if="authenticationData" style="text-align: left">
      <p><b>Credential ID:</b> {{ authenticationData.credentialId }}</p>
      <p>
        <b>Signature:</b> {{ authenticationData.signature.substring(0, 32) }}...
      </p>
    </section>
    <div>
      <button @click="logout()">Sign Out</button>
    </div>
  </template>
</template>