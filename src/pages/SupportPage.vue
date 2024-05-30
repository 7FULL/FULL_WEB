<template>
  <q-page class="q-pa-md q-mt-lg">
    <div class="wlg mg-auto">
      <div class="container">
        <div class="hlg chat-container" v-if="inputActive">
          <div v-for="(message, index) in msg" :key="index" class="chat-message">
            <q-chat-message :sent="index%2===0" :name="index%2===0 ? 'Usted' : 'Asistente'" :text="[message]" />
          </div>
        </div>
        <div v-else class="flex flex-center">
          <q-spinner v-if="!inputActive" size="100px" color="secondary" />
        </div>
      </div>
      <div class="input flex flex-center">
        <q-input
          v-model="input"
          placeholder="Pregunta cualquier cosa"
          @keyup.enter="sendMsg"
          dense
          outlined
          clearable
          class="wlg"
          :disable="!inputActive"
        />
        <q-btn @click="sendMsg" label="Send" color="primary" class="q-ml-sm" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import {ref} from "vue";

const id = Math.random();

const msg = ref([]);

const atLeastOne = ref(false);

const input = ref("");
const inputActive = ref(true);

function sendMsg() {
  if (input.value) {
    inputActive.value = false;

    fetch("http://127.0.0.1:5000/api/preguntar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: id,
        pregunta: input.value
      })
    })
      .then(res => res.json())
      .then(data => {
        msg.value = data.result;

        console.log(data.result);

        inputActive.value = true;
        atLeastOne.value = true;
      });

    input.value = "";
  }
}
</script>

<style scoped>
.input {
  position: fixed;
  bottom: 10px;
  left: 24%;
  width: 70%;
  z-index: 1000;
}
.q-page {
  padding-bottom: 100px; /* Añade suficiente espacio para el campo de entrada */
}

.container {
  display: flex;
  flex-direction: column;
  height: 32rem;
  overflow-y: hidden;
}

.chat-container {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
}

</style>
