<template>
  <router-link :to="link">
    <q-item clickable>
      <q-item-section v-if="icon" avatar>
        <q-icon :name="icon" color="white"/>
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-white">{{ title }}</q-item-label>
        <q-item-label caption class="text-white">{{ caption }}</q-item-label>
      </q-item-section>
    </q-item>
  </router-link>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "EssentialLink",
  props: {
    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: "",
    },

    link: {
      type: String,
      default: "#",
    },

    icon: {
      type: String,
      default: "",
    },
  },
});
</script>
