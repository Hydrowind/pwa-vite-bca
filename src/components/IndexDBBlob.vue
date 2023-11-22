<template>
    <div>
      <p>Data added: {{ addedData }}</p>
      <p>Data updated: {{ updatedData }}</p>
      <p>Data deleted: {{ deletedData }}</p>
      <button @click="addData">Add Data</button>
      <button @click="readData">Read Data</button>
      <button @click="updateData">Update Data</button>
      <button @click="deleteData">Delete Data</button>
      <ul>
        <li v-for="customer in customers" :key="customer.ssn">
          {{ customer.name }} - {{ customer.email }}
        </li>
      </ul>
      <img src="#">
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const dbName = "the_name";
  const customerToAdd = { ssn: "666-66-6666", name: "Alice", age: 28, email: "alice@example.com" };
  const keyToUpdate = "666-66-6666";
  const updatedCustomerData = { ssn: "666-66-6666", name: "Alice Updated", age: 30, email: "alice.updated@example.com" };
  const keyToDelete = "666-66-6666";
  
  const addedData = ref(null);
  const updatedData = ref(null);
  const deletedData = ref(null);
  const customers = ref([]);
  
  const addData = () => {
    const request = indexedDB.open(dbName, 2);
  
    request.onerror = (event) => {
      console.error("Error opening database:", event.target.error);
    };
  
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
  
      const objectStore = db.createObjectStore("images", { keyPath: "id" });
      objectStore.createIndex("id", "id", { unique: true });
      objectStore.createIndex("blob", "blob", { unique: false });
    //   objectStore.createIndex("email", "email", { unique: true });
    };
  
    request.onsuccess = (event) => {
        const myRequest = new Request("https://placehold.co/600x400");
        const myImage = document.querySelector("img");

        fetch(myRequest)
        .then((response) => response.blob())
        .then((myBlob) => {
            const db = event.target.result;
        
            const addTransaction = db.transaction("images", "readwrite");
            const customerObjectStore = addTransaction.objectStore("images");
      
          //   const myImage = document.querySelector("img");
      
            let responseBlob;
            let addRequest;
            // myImage.src = objectURL;
            console.log(myBlob);
            console.log("---");
            responseBlob = {
                id: 1,
                blob: myBlob
            };
            console.log(responseBlob);
            const objectURL = URL.createObjectURL(myBlob);
            myImage.src = myBlob;
            addRequest = customerObjectStore.add(responseBlob);

            console.log(objectURL);

            
            addRequest.onsuccess = (event) => {
              console.log("Data added successfully");
              addedData.value = "Yes";
            };
        
            addRequest.onerror = (event) => {
              console.error("Error adding data", event.target.error);
              addedData.value = "No";
            };
        
            addTransaction.oncomplete = () => {
              console.log("Add transaction completed");
              db.close();
            };
        });
  
    };
  };
  
  const readData = () => {
    const request = indexedDB.open(dbName, 2);
    const myImage = document.querySelector("img");
  
    request.onerror = (event) => {
      console.error("Error opening database:", event.target.error);
    };
  
    request.onsuccess = (event) => {
      const db = event.target.result;
  
      const readTransaction = db.transaction("images", "readonly");
      const customerObjectStore = readTransaction.objectStore("images");
  
      const customersCursor = customerObjectStore.openCursor();
  
      customersCursor.onsuccess = (event) => {
        const cursor = event.target.result;
  
        if (cursor) {
          // customers.value.push(cursor.value);
          console.log('customers.value:', customers.value)
          customers.value.splice(cursor.value.index, 1, cursor.value);
          myImage.src = customers.value;
          cursor.continue();
        } else {
          console.log("Data read successfully");

          // customers.value.splice(0, customers.value.length);
          db.close();
        }
      };

  
      customersCursor.onerror = (event) => {
        console.error("Error reading data", event.target.error);
        db.close();
      };
    };
  };
  
  const updateData = () => {
    const request = indexedDB.open(dbName, 2);
  
    request.onerror = (event) => {
      console.error("Error opening database:", event.target.error);
    };
  
    request.onsuccess = (event) => {
      const db = event.target.result;
  
      const updateTransaction = db.transaction("customers", "readwrite");
      const customerObjectStore = updateTransaction.objectStore("customers");
  
      const updateRequest = customerObjectStore.put(updatedCustomerData);
  
      updateRequest.onsuccess = (event) => {
        console.log("Data updated successfully");
        updatedData.value = "Yes";
      };
  
      updateRequest.onerror = (event) => {
        console.error("Error updating data", event.target.error);
        updatedData.value = "No";
      };
  
      updateTransaction.oncomplete = () => {
        console.log("Update transaction completed");
        db.close();
      };
    };
  };
  
  const deleteData = () => {
    const request = indexedDB.open(dbName, 2);
  
    request.onerror = (event) => {
      console.error("Error opening database:", event.target.error);
    };
  
    request.onsuccess = (event) => {
      const db = event.target.result;
  
      const deleteTransaction = db.transaction("customers", "readwrite");
      const deleteObjectStore = deleteTransaction.objectStore("customers");
  
      const deleteRequest = deleteObjectStore.delete(keyToDelete);
  
      deleteRequest.onsuccess = (event) => {
        console.log("Data deleted successfully");
        deletedData.value = "Yes";
      };
  
      deleteRequest.onerror = (event) => {
        console.error("Error deleting data", event.target.error);
        deletedData.value = "No";
      };
  
      deleteTransaction.oncomplete = () => {
        console.log("Delete transaction completed");
        db.close();
      };
    };
  };
  </script>