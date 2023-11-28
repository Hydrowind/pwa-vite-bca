<script setup>

import { ref, watchEffect } from 'vue'
import { useDevicesList, useUserMedia } from '@vueuse/core'

const currentCamera = ref('')
const { videoInputs: cameras } = useDevicesList({
  requestPermissions: true,
  onUpdated() {
    if (!cameras.value.find(i => i.deviceId === currentCamera.value))
      currentCamera.value = cameras.value[0]?.deviceId
  },
})

const video = ref()
const { stream, enabled } = useUserMedia({
  constraints: { video: { deviceId: currentCamera } },
})

watchEffect(() => {
  if (video.value)
    video.value.srcObject = stream.value
})

const inputName = ref('');
const inputDescription = ref('');
const postTodo = () => {
    fetch('https://65571112bd4bcef8b611fb73.mockapi.io/bca/todo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: inputName.value,
            description: inputDescription.value
        }),
    }).then(res => console.log(res))
    .catch(err => console.log(err));
}

</script>



<template>
  <div>
    <v-dialog width="500">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" text="Open Dialog"> </v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Add List">
            <v-card-text>
                <v-container fluid>
                    <v-text-field label="To Do" hide-details="auto" variant="outlined" v-model="inputName"></v-text-field>
                    <br>
                    
                    <v-textarea
                        name="description"
                        variant="outlined"
                        label="Description"
                        auto-grow
                        model-value=""
                        v-model="inputDescription"
                    ></v-textarea>

                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="6">
                                <v-file-input
                                    accept="image/*"
                                    label="Image input"
                                ></v-file-input>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-btn @click="enabled = !enabled"> {{ enabled ? "Stop" : "Start" }} </v-btn>
                            </v-col>
                        </v-row>
                    </v-container>

                    <v-container>
                        <video ref="video" muted autoplay controls class="h-100 w-auto" />
                    </v-container>
                </v-container>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                    text="Cancel"
                    @click="isActive.value = false"
                ></v-btn>
                <v-btn
                    text="Submit"
                    @click="postTodo"
                ></v-btn>
            </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
  </div>
</template>