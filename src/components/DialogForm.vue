<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="1024">
      <template v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props"> Add Another Step </v-btn>
      </template>
      <v-card theme="dark">
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="6" lg="12">
                <h1>Add Step</h1>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" lg="12">
                <h3>To Do*</h3>
                <input label="To Do*" required v-model="title" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" lg="12">
                <h3>Description</h3>
                <textarea label="Description" v-model="description" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" lg="12">
                <h3>Add Image</h3>
                <v-file-input
                  label="File input"
                  prepend-icon=""
                  type="file"
                  name="myImage"
                  accept="image/*"
                  ref="fileImage"
                  @change="handleChange"
                />
              </v-col>
            </v-row>
            <!-- <v-row>
              <v-col cols="12">
                <v-menu transition="scale-transition">
                  <template v-slot:activator="{ props }">
                    <v-btn block v-bind="props"> Choose Image </v-btn>
                  </template>

                  <v-list>
                    <v-list-item
                      v-for="(item, i) in items"
                      :key="i"
                      @click="menuActionClick(item.action)"
                    >
                    {{ i }}
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row> -->
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-container>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
              Close
            </v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="handleSubmit">
              Submit
            </v-btn>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-card theme="dark">
        <v-list v-model="open">
          <v-list-group v-for="item in arrImg" :key="item.id">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" class="step-list">
                <v-row>
                  <v-col cols="10">
                    <p class="title-step">{{ item.title }}</p>
                  </v-col>
                  <v-col cols="1">
                    <!-- <v-icon icon="mdi-pen" @click="editStep(event, item)" /> -->
                    <v-dialog v-model="dialog2" persistent width="1024">
                      <template v-slot:activator="{ props }">
                        <v-icon
                          icon="mdi-pen"
                          v-bind="props"
                          @click="editStep(event, item)"
                        />
                      </template>
                      <v-card>
                        <v-card-text>
                          <v-container>
                            <v-row>
                              <v-col cols="12">
                                <h1>Edit Step</h1>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12">
                                <h3>To Do*</h3>
                                <input required v-model.lazy="title" />
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12">
                                <h3>Description</h3>
                                <textarea
                                  label="Description"
                                  v-model.lazy="description"
                                >
                                </textarea>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12">
                                <h3>Add Image</h3>
                                <v-file-input
                                  label="File input"
                                  prepend-icon=""
                                  type="file"
                                  name="myImage"
                                  accept="image/*"
                                  ref="fileImage"
                                  @change="handleChange"
                                />
                              </v-col>
                            </v-row>
                            <!-- <v-row>
                              <v-col cols="12">
                                <v-menu transition="scale-transition">
                                  <template v-slot:activator="{ props }">
                                    <v-btn block v-bind="props">
                                      Choose Image
                                    </v-btn>
                                  </template>

                                  <v-list>
                                    <v-list-item
                                      v-for="(item, i) in items"
                                      :key="i"
                                      @click="menuActionClick(item.action)"
                                    >
                                      <v-list-item-title>{{
                                        item.title
                                      }}</v-list-item-title>
                                    </v-list-item>
                                  </v-list>
                                </v-menu>
                              </v-col>
                            </v-row> -->
                          </v-container>
                        </v-card-text>
                        <!-- <v-card-actions> -->
                          <v-container>
                            <v-spacer></v-spacer>
                            <v-row>
                              <v-col cols="12">
                                <!-- <v-btn
                                  color="blue-darken-1"
                                  variant="text"
                                  @click="viewImage()"
                                >
                                  View Image
                                </v-btn> -->
                                <p class="subtitle">Previous Image</p>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12">
                                <template v-if="prevImage !== null">
                                  <v-img
                                    :src="getFileImageSrc(prevImage)"
                                    max-height="250"
                                    class="img-list"
                                  />
                                </template>
                              </v-col>
                            </v-row>
                          </v-container>
                        <!-- </v-card-actions> -->
                        <v-card-actions>
                          <v-container>
                            <v-spacer></v-spacer>
                            <v-btn
                              color="blue-darken-1"
                              variant="text"
                              @click="
                                (dialog2 = false),
                                  (title = ''),
                                  (description = ''),
                                  (fileImage = null),
                                  (prevImage = null)
                              "
                            >
                              Close
                            </v-btn>
                            <v-btn
                              color="blue-darken-1"
                              variant="text"
                              @click="handleEdit"
                            >
                              Submit
                            </v-btn>
                          </v-container>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-col>
                  <v-col cols="1">
                    <v-icon
                      icon="mdi-delete"
                      @click="deleteStep(event, item)"
                    />
                  </v-col>
                </v-row>
              </v-list-item>
            </template>
            <v-list-item
              v-for="child in item.details"
              :key="child.id"
              sub-group
            >
              <v-list-item-content>
                <v-img
                  :src="getFileImageSrc(child.fileImage)"
                  max-height="250"
                  class="img-list"
                  v-if="child.fileImage"
                />
                <p class="desc-list">{{ child.description }}</p>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, onMounted, toRefs } from "vue";
import ResepService from "../services/ResepService";

//define variable
const dbName = "RecipesDB";
let items = ref([]);
let title = ref("");
let description = ref("");
let fileImage = ref(null);
let dialog = ref(false);
let dialog2 = ref(false);
let open = ref(false);
items.value = [
  { title: "Choose Image", action: 1 },
  { title: "Open Camera", action: 2 },
];
const arrImg = ref([]);
let detailData = ref([]);
let prevImage = ref(null);
let isNewImage = false;
let isShow = false;

//function check if database exist or not
function databaseExists(dbname, callback) {
  var req = indexedDB.open(dbname);
  var existed = true;
  req.onsuccess = function () {
    req.result.close();
    if (!existed) indexedDB.deleteDatabase(dbname);
    callback(existed);
  };
  req.onupgradeneeded = function () {
    existed = false;
  };
}

//BUTTON/FIELD HANDLER
const menuActionClick = (action) => {
  console.log(action);
  if (action === 1) {
    alert("GALLERY");
  } else {
    alert("CAMERA");
  }
};

// const handleInput = (e) => {
//   if (e.target.name === "title") {
//     title = e.target.value;
//     console.log(e.target.value)
//   } else if (e.target.name === "description") {
//     description = e.target.value;
//   }
// };

const handleChange = (event) => {
  const file = event.target.files[0];
  //isNewImage = false;

  if (file) {
    const reader = new FileReader();

    reader.onload = (loadEvent) => {
      const imageData = loadEvent.target.result;
      const blob = new Blob([imageData], { type: file.type });
      fileImage.value = blob;
    };

    reader.readAsArrayBuffer(file);
    isNewImage = true;
  }
};

//function to add data to indexDB
const addData = (itemAdd) => {
  ResepService.saveStep(itemAdd)
    .then((response) => {
      itemAdd.id = response.id;

      const request = indexedDB.open(dbName, 1);
      console.log(fileImage.value);

      request.onerror = (event) => {
        console.error("Error opening database:", event.target.error);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const objectStore = db.createObjectStore("Step", { keyPath: "id" });
      };

      request.onsuccess = (event) => {
        const db = event.target.result;

        const addTransaction = db.transaction("Step", "readwrite");
        const itemObjectStore = addTransaction.objectStore("Step");

        const addRequest = itemObjectStore.add(itemAdd);

        addRequest.onsuccess = (event) => {
          console.log("Data added successfully");
        };

        addRequest.onerror = (event) => {
          console.error("Error adding data", event.target.error);
        };

        addTransaction.oncomplete = () => {
          console.log("Add transaction completed");
          db.close();
        };

        dialog.value = false;
        readData();
      }
    })
    .catch((e) => {
      console.log(e)
    })
};

const handleSubmit = (event) => {
  const currentTime = new Date();
  const fullTime = currentTime.getTime();
  let dataToAdd = {
    id: fullTime,
    title: title.value,
    details: [
      {
        id: fullTime,
        description: description.value,
        fileImage: isNewImage ? fileImage.value : null,
      },
    ],
  };

  addData(dataToAdd);
};

//function to get data from indexdb
const readData = () => {
  ResepService.getResep()
    .then((response) => {
      console.log(response);
    })
    .catch(e => {
      console.log(e);
    });
  databaseExists(dbName, function (result) {
    if (result === true) {
      const request = indexedDB.open(dbName, 1);

      arrImg.value = [];

      request.onerror = (event) => {
        console.error("Error opening database:", event.target.error);
      };

      request.onsuccess = (event) => {
        const db = event.target.result;

        const readTransaction = db.transaction("Step", "readonly");
        const dataObjectStore = readTransaction.objectStore("Step");

        const datasCursor = dataObjectStore.openCursor();

        datasCursor.onsuccess = (event) => {
          const cursor = event.target.result;

          if (cursor) {
            arrImg.value.push(cursor.value);
            cursor.continue();
          } else {
            console.log("Data read successfully");
            db.close();
          }
        };

        datasCursor.onerror = (event) => {
          console.error("Error reading data", event.target.error);
          db.close();
        };
      };
    } else {
      console.log("DB NOT EXIST");
    }
  });
};

//edit function
// const viewImage = () => {
//   isShow = !isShow;
//   console.log("SHOW", isShow);
// };

const editStep = (event, item) => {
  prevImage = null;
  //open = false;
  title = item.title;
  description = item.details[0].description;
  console.log(item.details[0].fileImage);
  prevImage = item.details[0].fileImage;
  detailData = item;
};

const editData = (itemEdit) => {
  ResepService.updateStep(itemEdit.id, itemEdit)
    .then(() => {
      console.log("update success")
    })
    .catch(() => {
      console.log("update gagal")
    })
    .finally(() => {
      const request = indexedDB.open(dbName, 1);

      request.onerror = (event) => {
        console.error("Error opening database:", event.target.error);
      };

      request.onsuccess = (event) => {
        const db = event.target.result;

        const updateTransaction = db.transaction("Step", "readwrite");
        const dataObjectStore = updateTransaction.objectStore("Step");

        const updateRequest = dataObjectStore.put(itemEdit);

        updateRequest.onsuccess = (event) => {
          console.log(itemEdit);
          console.log("Data updated successfully: ");
        };

        updateRequest.onerror = (event) => {
          console.error("Error updating data", event.target.error);
        };

        updateTransaction.oncomplete = () => {
          console.log("Update transaction completed");
          db.close();
        };

        window.location.reload();
      };
    })

};

const handleEdit = (event) => {
  let dataToEdit = {
    id: detailData.id,
    title: title,
    details: [
      {
        id: detailData.details[0].id,
        description: description,
        fileImage: isNewImage ? fileImage.value : prevImage,
      },
    ],
  };

  editData(dataToEdit);
};

// delete function
const deleteData = (item) => {
  const keyToDelete = item.id;

  ResepService.deleteStep(keyToDelete)
    .then(() => {
      console.log("DELETE SUCCESS")
    })
    .catch((e) => {
      console.log("failed to delete")
    })
    .finally(() => {
      const request = indexedDB.open(dbName, 1);

      request.onerror = (event) => {
        console.error("Error opening database:", event.target.error);
      };

      request.onsuccess = (event) => {
        const db = event.target.result;

        const deleteTransaction = db.transaction("Step", "readwrite");
        const deleteObjectStore = deleteTransaction.objectStore("Step");

        const deleteRequest = deleteObjectStore.delete(keyToDelete);
        console.log("Deleting: " + keyToDelete)

        deleteRequest.onsuccess = (event) => {
          console.log("Data deleted successfully");
        };

        deleteRequest.onerror = (event) => {
          console.error("Error deleting data", event.target.error);
        };

        deleteTransaction.oncomplete = () => {
          console.log("Delete transaction completed");
          db.close();
        };

        window.location.reload();
      };
    })
};

const deleteStep = (event, item) => {
  open = false;
  deleteData(item);
};

//render blob
const getFileImageSrc = (fileImageRef) => {
  return URL.createObjectURL(fileImageRef);
};

//show data if exist on db
onMounted(readData);
</script>

<style>
@import "../style.css";
</style>
