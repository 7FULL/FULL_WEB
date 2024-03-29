<template>
  <q-dialog v-model="isOpenF" @hide="closeModal" persistent>
    <q-card class="w30 q-mt-sm">
      <q-card-section>
        <q-icon
          name="close"
          size="2rem"
          class="float-right cursor-pointer"
          @click="closeModal"
        />
        <q-tab-panels v-model="activeTab" animated class="wxl">
          <q-tab-panel name="login" class="q-pt-xs q-pb-xs">
            <h2 class="text-h6 q-mt-xs">{{ t("loginTab") }}</h2>
            <q-form @submit="login">
              <q-input v-model="loginData.username" :label="t('user')" required />
              <q-input
                v-model="loginData.password"
                :label="t('password')"
                :type="showEyeLogin ? 'password' : 'text'"
                required
                minlength="7"
              >
                <template v-slot:append>
                  <q-icon
                    :name="showEyeLogin ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showEyeLogin = !showEyeLogin"
                  />
                </template>
              </q-input>
              <q-item side inset-separator v-ripple class="q-mt-sm">
                <q-item-section>
                  <a href="#" class="text-primary" @click="restorePasswordPopUp"
                    >{{ t("notRememberPassword") }}</a
                  >
                </q-item-section>
              </q-item>
              <q-item class="pl-0">
                <q-checkbox
                  v-model="loginData.remember"
                  :label="t('rememberMe')"
                  class="flex"
                />
              </q-item>
              <GoogleLogin :callback="googleLogged" />
              <q-card-actions>
                <q-btn
                  color="primary"
                  :label="t('confirm')"
                  type="submit"
                  class="wxl"
                />
              </q-card-actions>
            </q-form>
          </q-tab-panel>
          <q-tab-panel name="register" class="q-pt-xs q-pb-xs">
            <h2 class="text-h6 q-mt-xs">{{ t("register") }}</h2>
            <q-form @submit="register">
              <q-input
                v-model="registerData.username"
                :label="t('name')"
                required
              />
              <q-input
                v-model="registerData.email"
                :label="t('email')"
                type="email"
                required
              />
              <q-input
                v-model="registerData.password"
                :label="t('password')"
                :type="showEye ? 'password' : 'text'"
                required
                minlength="7"
              >
                <template v-slot:append>
                  <q-icon
                    :name="showEye ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showEye = !showEye"
                  />
                </template>
              </q-input>
              <q-input
                v-model="registerData.confirmPassword"
                :label="t('confirmPassword')"
                :type="showEyeConfirm ? 'password' : 'text'"
                required
                minlength="7"
              >
                <template v-slot:append>
                  <q-icon
                    :name="showEyeConfirm ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showEyeConfirm = !showEyeConfirm"
                  />
                </template>
              </q-input>
              <q-input
                v-model="registerData.phone"
                :label="t('phoneNumber')"
                type="tel"
                required
                class="q-mb-md"
              />
              <Checkbox v-model="registerData.captcha" />
              <q-checkbox
                v-model="registerData.agree"
                :false-value="null"
                required
                class="q-mt-sm"
              >
                {{ t("agree") }}
              </q-checkbox>
              <GoogleLogin :callback="googleRegistered" />
              <q-card-actions>
                <q-btn
                  color="primary"
                  :label="t('confirm')"
                  type="submit"
                  class="wxl"
                />
              </q-card-actions>
            </q-form>
          </q-tab-panel>
        </q-tab-panels>

        <div class="text-center">
          <q-tabs inline-label v-model="activeTab">
            <q-tab
              v-for="tab in tabs"
              :key="tab.name"
              :name="tab.name"
              :label="tab.label"
              :color="activeTab == tab.name ? 'primary' : 'white'"
              :text-color="activeTab == tab.name ? 'white' : 'primary'"
            />
          </q-tabs>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <EmailVerification @verified="emailVerified" :isOpen="isVerifying" />

  <ErrorPopUp
    :error="error.message"
    :open="error.type"
    @closed="clearError"
  ></ErrorPopUp>

  <!-- PopUp para el has olvidado la contraseña -->
  <PopUp
    :open="restorePassword"
    :title="t('restorePasswordTitle')"
    :msg="t('restorePasswordMSG')"
    :persistent="true"
    :cancel="false"
    :input="false"
  ></PopUp>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { Checkbox } from "vue-recaptcha";
import ErrorPopUp from "./ErrorPopUp.vue";
import EmailVerification from "./EmailVerification.vue";
import { userDataStore } from "../stores/userData.js";
import { useQuasar } from "quasar";
import { decodeCredential } from "vue3-google-login";
import PopUp from "./PopUp.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const showEyeConfirm = ref(true);

const basicAuth = 'Basic ' + btoa("user" + ':' + "user");

const showEye = ref(true);

const showEyeLogin = ref(true);

const userStore = userDataStore();

const restorePassword = ref(false);

const restorePasswordPopUp = () => {
  if (loginData.value.username == "") {
    showNotif(
      t("restorePasswordErrorNoUsername"),
      "red-5"
    );
    return;
  }

  fetch(
    "http://localhost:8080/api/employee/forgotPassword?email=" +
      loginData.value.username,
    {
      method: "GET",
      headers: {
        'Authorization': basicAuth,
      },
    }
  )
    .then((response) => response.json())
    .then(async (data) => {
      console.log(data);
      if (data.code == 200 || data.code == 404) {
        restorePassword.value = true;
      } else {
        error.value.type = true;
        error.value.message =
          t("serverErrorMSG");
      }
    })
    .catch((exception) => {
      console.log(exception);
      error.value.type = true;
      error.value.message =
        t("serverErrorMSG");
    });

  restorePassword.value = true;
};

onMounted(() => {
  if (localStorage.getItem("username")) {
    let name = localStorage.getItem("username");

    // Para que siga recordando
    loginData.value.remember = true;

    logged(name);
  }
});

const tabs = [
  {
    name: "login",
    label: t("loginTab"),
  },
  {
    name: "register",
    label: t("register"),
  },
];

const emailVerified = () => {
  userData.value.emailVerified = true;
  userStore.userData = userData.value;
  showNotif(t("emailVerifiedMSG"));
};

const googleLogged = (response) => {
  const player = decodeCredential(response.credential);

  logged(player.email);
};

const googleRegistered = (response) => {
  const player = decodeCredential(response.credential);

  registerData.value.username = player.name;
  registerData.value.email = player.email;
  registerData.value.password = player.sub;
  registerData.value.confirmPassword = player.sub;
  registerData.value.phone = "000000000";

  register();
};

const isVerifying = ref(false);

const isOpenF = ref(false);

const props = defineProps(["isOpen"]);

const emit = defineEmits(["closeModal", "logged"]);

const activeTab = ref("login");

const error = ref({
  type: 0, // 1 -> login, 2 -> register
  message: "",
});

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

const loginData = ref({
  username: "",
  password: "",
  token: "",
  remember: false,
});

const registerData = ref({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  agree: null,
  captcha: "",
});

const userData = ref({
  clients: [],
  bills: [],
  email: "",
  phone: "",
  username: "",
});

const clearError = () => {
  error.value.type = false;
  error.value.message = "";
};

watch(
  () => props.isOpen,
  (newVal) => {
    isOpenF.value = newVal;
  }
);

function captchaV3() {
  return new Promise((resolve, reject) => {
    grecaptcha.ready(function () {
      grecaptcha
        .execute("6Lc099EmAAAAAI_Ra6YRJ35X0FjthvtuXyH0X8E9", {
          action: "submit",
        })
        .then(function (token) {
          resolve(token); // Resuelve la promesa después de asignar el token
        })
        .catch(function (error) {
          reject(error); // Rechaza la promesa si ocurre un error
        });
    });
  });
}

const closeModal = () => {
  emit("closeModal");
  switchTab("login");
};

const logged = async (name = "") => {
  if (name != "") {
    userData.value.username = name;
  }

  let id = "";

  if (userData.value.username != "") {
    id = userData.value.username;
  } else {
    id = userData.value.email;
  }

  // En caso de que el usuario haya clickeado en recuerdame guardamos su nombre de usuario en el local storage
  if (loginData.value.remember) {
    localStorage.setItem("username", userData.value.username);
  } else {
    localStorage.removeItem("username");
  }

  //Obtener los datos que nos faltan de la base de datos
  await fetch("http://127.0.0.1:8080/api/employee/getEmployee?username=" + id, {
    headers: {
      'Authorization': basicAuth,
    },
  })
    .then((response) => response.json())
    .then(async (data) => {
      console.log(data);

      if (data.code == 200) {
        userData.value.id = data.data.id;
        userData.value.password = "********";
        userData.value.role = data.data.role;
        userData.value.surname = data.data.surname;
        userData.value.name = data.data.name;
        userData.value.bills = data.data.bills;
        userData.value.clients = data.data.clients;
        userData.value.email = data.data.email;
        userData.value.phone = data.data.phone;
        userData.value.username = data.data.username;
        userData.value.appointments = data.data.appointments;

        userStore.userData = userData.value;

        userStore.logged = true;

        showNotif(t("welcomeBack") + userData.value.username);
        emit("logged");
      } else if (data.status == 404) {
        error.value.type = true;
        error.value.message = data.result;
      } else {
        error.value.type = true;
        error.value.message =
          t("serverErrorMSG");
      }
    })
    .catch((exception) => {
      console.log(exception);
      error.value.type = true;
      error.value.message =
        t("serverErrorMSG");
    });
};

const switchTab = (tab) => {
  activeTab.value = tab;
};

// Hay que hacerla asíncrona para poder esperar al token

const login = async (e) => {
  e.preventDefault();

  //Limpiamos los datos del usuario
  userData.value.name = "";
  userData.value.email = "";
  userData.value.phone = "";
  userData.value.description = "";
  userData.value.profile = "src/assets/img/logoUserDefault.png";

  isVerifying.value = false;

  const token = await captchaV3();
  loginData.value.token = token;

  userData.value.username = loginData.value.username;

  fetch("http://localhost:8080/api/employee/login", {
    method: "POST",
    headers: {
      'Authorization': basicAuth,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData.value),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.code == 200 || data.code == 401) {
        if (data.code == 200) {
          closeModal();
          logged();
        } else {
          //Usuario incorrecto
          error.value.type = true;
          error.value.message = t("userOrPasswordError");
        }
        //Captcha no válido o caducado
      } else if (data.code == 498) {
        error.value.type = true;
        error.value.message = t("recaptachaIncalid");
      } else {
        error.value.type = true;
        error.value.message =
          t("bbddErrorMSG");
      }
    })
    .catch((exception) => {
      console.log(exception);
      error.value.type = true;
      error.value.message =
        t("serverErrorMSG");
    });

  // Resetear el formulario
  loginData.value.username = "";
  loginData.value.password = "";
  loginData.value.token = "";
};

const register = async (e) => {
  try {
    e.preventDefault();
  } catch (error) {}

  if (registerData.value.password != registerData.value.confirmPassword) {
    error.value.type = true;
    error.value.message = t("passwordNotMatch");
  } else if (registerData.value.agree == true && registerData.value.captcha) {
    if (!registerData.value.username.includes("@")) {
      userData.value.name = registerData.value.username;
    } else {
      userData.value.email = registerData.value.email;
    }

    await fetch("http://127.0.0.1:5000/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData.value),
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        if (data.status == 200) {
          closeModal();
          logged();
        } else if (data.status == 409) {
          error.value.type = true;
          error.value.message =
            t("userAlreadyExists");
        } else {
          error.value.type = true;
          error.value.message =
            t("bbddErrorMSG");
        }
      })
      .catch((exception) => {
        console.log(exception);
        error.value.type = true;
        error.value.message =
          t("serverErrorMSG");
      });
  } else {
    if (!registerData.value.captcha) {
      error.value.type = true;
      error.value.message = t("captchaError")
    } else {
      error.value.type = true;
      error.value.message = t("agreeError")
    }
  }

  // Resetear el formulario
  registerData.value.username = "";
  registerData.value.email = "";
  registerData.value.password = "";
  registerData.value.confirmPassword = "";
  registerData.value.phone = "";
  registerData.value.agree = null;
};
</script>

<style scoped></style>
