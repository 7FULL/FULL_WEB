<template>
  <q-page class="padding_cero">
    <div class="q-pa-md grid" v-if="streams.length > 0">
      <div
        v-for="(stream, index) in streams"
        :key="index"
        cols="12"
        md="4"
        sm="6"
      >
        <router-link :to="'/streaming/' + stream.name">
          <q-card class="bg-secondary redondito">
            <q-card-section class="text-center">
              <q-avatar>
                <img
                  :src="stream.photoUrl"
                  alt="Stream Image"
                  class="q-mb-md"
                />
              </q-avatar>
              <div class="text-h6 xx-large">{{ stream.name.split("-0101-")[0] }}</div>
            </q-card-section>
          </q-card>
        </router-link>
      </div>
    </div>
    <div class="text-center q-pa-md absolute-center" v-else-if="loading">
      <q-spinner-gears size="100px" color="secondary" />
    </div>
    <div class="text-center q-pa-md absolute-center" v-else>
      <q-card class="wfc bg-secondary">
        <q-card-section class="text-center">
          <div class="text-h6 xx-large">
            {{ $t("noStreamings") }}
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";

const streams = ref([]);

const loading = ref(true);

//Lo hacemos en el mounted para que se ejecute cuando se cargue el DOM
onMounted(async () => {
  await fetch("http://localhost:8080/stat")
    .then((response) => response.text())
    .then(async (data) => {
      // Procesar los datos XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const streamElements = xmlDoc.getElementsByTagName("stream");

      if (streamElements.length > 0){
        // Recorrer los elementos de stream
        for (let i = 0; i < streamElements.length; i++) {
          const name =
            streamElements[i].getElementsByTagName("name")[0].textContent;

          let aux = "src/assets/img/logoUserDefault.png";

          streams.value.push({ name, photoUrl: aux });

          loading.value = false;
        }
      }else{
        setTimeout(() => {
          loading.value = false;
        }, 1000);
      }
    })
    .catch((error) => {
      console.log("Error:", error);

      loading.value = false;
    });
});

</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 10px;
}

.padding_cero {
  padding-top: 0px;
}

.xx-large {
  font-size: xx-large;
}

.redondito{
  border-radius: 10px;
}
</style>
