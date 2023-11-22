<template>
    <div class="grid">
        <div class="grid-cols-3">
            <input type="file" class="file-input file-input-bordered w-full max-w-xs"  @change="handleImageUpload"/>
        </div>
        <div class="md:container">
            <input type="number" v-model="selectedImageId" placeholder="Enter Image ID" class="input input-bordered w-full max-w-xs" />
        </div>
        <!-- <input type="number" v-model="selectedImageId" placeholder="Enter Image ID" /> -->
        <button @click="loadImageById" class="btn btn-accent">Load Image</button>
        <!-- <img v-if="imageUrl" :src="imageUrl" alt="Stored Image" /> -->
    </div>
    <div class="grid">
        <div class="grid-cols-1">
            <img v-if="imageUrl" :src="imageUrl" alt="Stored Image" class="max-w-sm rounded-lg shadow-2xl" />
        </div>
    </div>
</template>

<script>
    import { openDB } from 'idb';

    export default {
      data() {
        return {
          imageUrl: null,
          selectedImageId: null,
        };
      },
      methods: {
        async handleImageUpload(event) {
          const file = event.target.files[0];
          if (file) {
            try {
              const db = await openDB('pwaDB', 1, {
                upgrade(db) {
                  db.createObjectStore('images', { keyPath: 'id', autoIncrement: true });
                },
              });
              const reader = new FileReader();
              reader.onload = async () => {
                const imageData = reader.result;
                const transaction = db.transaction('images', 'readwrite');
                const imageStore = transaction.objectStore('images');
                const imageObject = { data: imageData, mimeType: file.type };
                const imageId = await imageStore.add(imageObject);
                console.log(`Image added with ID: ${imageId}`);
              };
              reader.readAsDataURL(file);
            } catch (error) {
              console.error('Error:', error.message);
            }
          }
        },
        async loadImageById() {
          if (!this.selectedImageId) {
            console.error('Please enter a valid Image ID.');
            return;
          }
          try {
            const db = await openDB('pwaDB', 1);
            const transaction = db.transaction('images', 'readonly');
            const imageStore = transaction.objectStore('images');
            const selectedImage = await imageStore.get(Number(this.selectedImageId));
            if (selectedImage) {
              this.imageUrl = selectedImage.data;
            } else {
              console.error('Image not found with ID:', this.selectedImageId);
            }
          } catch (error) {
            console.error('Error:', error.message);
          }
        },
      },
    };
</script>