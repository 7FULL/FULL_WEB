<template>
  <div class="mg-auto text-center w30">
    <h1 class="text-h6">Reserva tu cartel de publicidad</h1>
    <div class="q-pa-md">
      <q-select
        v-model="cartel"
        :options="carteles"
        label="Selecciona un cartel"
        emit-value
        map-options
        class="q-mb-xl"
      />
      <div class="flex">
        <q-uploader
          :url="url"
          accept="image/*"
          label="Select a photo"
          color="primary"
        >
          <template v-slot:header="scope">
            <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
              <q-btn v-if="scope.queuedFiles.length > 0" icon="clear_all" @click="scope.removeQueuedFiles" round dense flat >
                <q-tooltip>Clear All</q-tooltip>
              </q-btn>
              <q-btn v-if="scope.uploadedFiles.length > 0" icon="done_all" @click="scope.removeUploadedFiles" round dense flat >
                <q-tooltip>Remove Uploaded Files</q-tooltip>
              </q-btn>
              <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
              <div class="col">
                <div class="q-uploader__title">Sube tus archivos</div>
                <div class="q-uploader__subtitle">{{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}</div>
              </div>
              <q-btn v-if="scope.canAddFiles" type="a" icon="add_box" @click="scope.pickFiles" round dense flat>
                <q-uploader-add-trigger />
                <q-tooltip>Pick Files</q-tooltip>
              </q-btn>
              <q-btn v-if="scope.canUpload" icon="cloud_upload" @click="upload(scope)" round dense flat >
                <q-tooltip>Upload Files</q-tooltip>
              </q-btn>

              <q-btn v-if="scope.isUploading" icon="clear" @click="scope.abort" round dense flat >
                <q-tooltip>Abort Upload</q-tooltip>
              </q-btn>
            </div>
          </template>
        </q-uploader>
        <img :src="carteles[0].img">
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'
import { userDataStore } from "../stores/userData.js";
import { useQuasar } from "quasar";

const userStore = userDataStore()
const carteles = ref([{
  value: 'cartel1',
  label: 'Cartel 1',
  img: "../assets/img/cartel1.jpg"
}, {
  value: 'cartel2',
  label: 'Cartel 2',
  img: "../assets/img/cartel2.jpg"
}, {
  value: 'cartel3',
  label: 'Cartel 3',
  img: "../assets/img/cartel3.jpg"
}, {
  value: 'cartel4',
  label: 'Cartel 4',
  img: "../assets/img/cartel4.jpg"
}, {
  value: 'cartel5',
  label: 'Cartel 5',
  img: "../assets/img/cartel5.jpg"
}
])
const cartel = ref('cartel1')
const url = computed(() => {
  return `http://localhost:5000/api/publi/${cartel.value}`
})

const $q = useQuasar();

function showNotif(msg, color = "gray-4") {
  $q.notify({
    message: msg,
    color: color,
    position: "top",
    timeout: 1500,
    progress: true,
  });
}

const upload = (scope) => {
  scope.upload()

  //We wait until scope.isUploading is false
  const interval = setInterval(() => {
    if (!scope.isUploading) {
      clearInterval(interval)
      uploaded()
      scope.reset()

      showNotif("Files uploaded successfully", "green-4")
    }
  }, 100)
}

const uploaded = () => {
  submitForm()
}

const submitForm = () => {
  const json = {
    cartel: cartel.value,
    purchaseDate: new Date().toISOString(),
    user: userStore.userData,
  }

  fetch('http://localhost:5000/api/publiJson/'+cartel.value, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(json),
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error))
}

</script>
