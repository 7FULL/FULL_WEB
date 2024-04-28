<template>
  <q-layout view="lHr lpR fFf">
    <q-header class="border">
      <q-toolbar class="bg-primary">
        <div v-if="isLogged">
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="toggleLeftDrawer"
          />
        </div>
        <RouterLink to="/" v-if="!leftDrawerOpen" class="q-mr-sm">
          <q-img
            src="../assets/img/logo_remove.png"
            spinner-color="white"
            style="width: 100px;"
          />
        </RouterLink>

        <div class="fullW">
          <q-input
            class="q-ma-sm wmd mg-auto"
            dark
            dense
            borderless
            :placeholder="$t('inputBuscar')"
            v-model="busqueda"
          >
            <template v-slot:append>
              <q-icon name="search" class="text-white" />
            </template>
          </q-input>
        </div>

        <div class="avatar-container w19 text-center" v-if="!isLogged">
          <q-btn
            color="secondary"
            icon-right="login"
            :label="$t('login')"
            @click="openModal"
          />
        </div>
        <div v-else>
          <q-btn
            v-if="userStore.userData.profile != null"
            round
            @click="viewProfile"
          >
            <q-avatar>
              <img :src="userStore.userData.profile" alt="User Avatar 4" />
            </q-avatar>
            <q-tooltip class="bg-green">{{ t("verPerfil") }}</q-tooltip>
          </q-btn>
          <q-btn v-else round @click="viewProfile">
            <q-avatar>
              <img
                src="../assets/img/logoUserDefault.png"
                alt="User Avatar2"
              />
            </q-avatar>
            <q-tooltip class="bg-green">{{ t("verPerfil") }}</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered v-if="isLogged" class="bg-primary">
      <q-item>
        <q-list>
          <q-toolbar>
            <RouterLink to="/" class="q-mr-sm" v-if="leftDrawerOpen">
              <q-img
                src="../assets/img/logo_remove.png"
                spinner-color="white"
                style="width: 100px;"
              />
            </RouterLink>
          </q-toolbar>
          <q-item-label header />
          <EssentialLink
            v-for="link in linksList"
            :key="link.title"
            v-bind="link"
          />
        </q-list>
      </q-item>

      <div class="hsm"></div>

      <q-separator spaced />
      <q-item-label header class="text-white">{{ $t("config") }}</q-item-label>

      <q-item>
        <q-item-section avatar>
          <q-icon name="language" />
        </q-item-section>
        <q-item-section>
          <div class="wxs">
            <q-btn-dropdown :label="t('languages')" color="secondary">
              <q-list>
                <q-item v-for="lang in languages" :key="lang.value"
                        v-close-popup
                        clickable
                        @click="changeLanguage(lang.value)">
                  <q-item-section>
                    <q-item-label>{{ lang.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section avatar>
          <q-icon :name="dark ? 'dark_mode' : 'light_mode'" />
        </q-item-section>
        <q-item-section>
          <q-toggle
            v-model="dark"
            label="Dark mode"
            color="secondary"
            class="pointer"
            keep-color
            disable
            @click="changeTheme"
          />
            <q-btn
              v-if="isLogged"
              color="secondary"
              :label="$t('logout')"
              icon-right="logout"
              @click="closeSession"
              class="fixed q-mb-md"
              style="bottom: 1%; left: 20%;"
            >
            <q-tooltip class="bg-red">{{ t("logout") }}</q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>
      <q-separator spaced />
    </q-drawer>

    <login
      :isOpen="modalOpen"
      @closeModal="closeModal"
      @logged="logged"
    ></login>

    <q-page-container style="padding-top: 0%">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import login from "../components/LoginComponent.vue";
import { ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { RouterLink, useRouter } from "vue-router";
import { userDataStore } from "stores/userData";
import { useI18n } from "vue-i18n";
import {useQuasar} from "quasar";

const $q = useQuasar()
let language = $q.lang.getLocale()

const dark = ref(true);

$q.dark.set(dark.value);

const changeTheme = () => {
  dark.value = !dark.value;
  $q.dark.set(dark.value);
};

const { t, locale } = useI18n();

const languages = [
  {
    label: "Español",
    value: "es-ES",
  },
  {
    label: "English",
    value: "en-US",
  },
  {
    label: "Français",
    value: "fr-FR",
  },
  {
    label: "Deutsch",
    value: "de-DE",
  }
];

locale.value = language;

const changeLanguage = (lang) => {
  console.log(lang);
  locale.value = lang;
};

const userStore = userDataStore();

const router = useRouter();

const userData = userStore.userData;

const isLogged = ref(false);

const modalOpen = ref(false);

const dropdown = ref(false);

const dropdownLogin = ref(false);

const busqueda = ref("");

const linksList = [
  {
    title: "Advertisment",
    caption: "Quieres poner un anuncio?",
    icon: "view_in_ar",
    link: "/ads",
  },
  {
    title: "Streamings",
    caption: "Mira a tus sreamers favoritos",
    icon: "token",
    link: "/streamings",
  },
  {
    title: "Perfil",
    caption: "Configura tu perfil",
    icon: "person",
    link: "/viewProfile",
  },
];

const leftDrawerOpen = ref(false);

const rightDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value;
};

if (userStore.logged) {
  isLogged.value = true;
}

const emit = defineEmits("closeSession", "logged");

const openModal = () => {
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
};

const closeSession = () => {
  userStore.logged = false;

  userStore.userData = {
    profile: "src/assets/img/logoUserDefault.png",
    name: "",
    email: "",
    phone: "",
    emailVerified: "",
    description: "",
  };

  isLogged.value = false;
  dropdownLogin.value = false;
  dropdown.value = false;

  leftDrawerOpen.value = false;

  if (localStorage.getItem("username") != null) {
    localStorage.removeItem("username");
  }

  router.push({ name: "home" });
  //emit('closeSession');
};

const logged = () => {
  isLogged.value = true;
  userData.value = userStore.userData;
  modalOpen.value = false;
};

const viewProfile = () => {
  router.push({ name: "viewProfile" });
  //emit("profile");
};

//If we arent logged, we redirect to streamings
if (!userStore.logged) {
  router.push({ name: "streamings" });
}
</script>

<style>
.pointer{
  cursor: pointer !important;
}

.pointer *{
  cursor: pointer !important;
}

.border{
  border-bottom: 1px gray solid;
}

.fullW{
  width: 100%;
}
</style>
