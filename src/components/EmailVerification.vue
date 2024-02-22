<template>
  <PopUp
    :open="isVerifying"
    :msg="$t('notVerifiedMSG')"
    :title="$t('notVerifiedTitle')"
    persistent="true"
    cancel="true"
    @closed="isVerifyingEmail"
  ></PopUp>

  <PopUp
    :open="isVerifyingEmailPopUp"
    :msg="$t('verifyingEmailMSG')"
    :title="$t('verifyingEmailTitle')"
    persistent="true"
    input="true"
    @closed="checkToken"
  ></PopUp>

  <ErrorPopUp
    :error="error.message"
    :open="error.type"
    @closed="clearError"
  ></ErrorPopUp>
</template>

<script setup>
import PopUp from "./PopUp.vue";
import ErrorPopUp from "./ErrorPopUp.vue";
import { ref, watch } from "vue";
import { userDataStore } from "../stores/userData.js";

const userStore = userDataStore();

const verification = ref({
  token: "",
});

const emailPopUp = ref({
  type: 0, // 1 -> login, 2 -> register
  message: "",
});

let userData = userStore.userData;

const emit = defineEmits(["verified"]);

const props = defineProps(["isOpen"]);

watch(
  () => props.isOpen,
  (newVal) => {
    isVerifying.value = newVal;
  }
);

const isVerifying = ref(false);

const isVerifyingEmailPopUp = ref(false);

const isVerifyingEmail = () => {
  userData = userStore.userData;

  verification.value.token = "";
  isVerifying.value = false;
  isVerifyingEmailPopUp.value = true;
  fetch("http://localhost:5000/api/users/registerToken/" + userData.name)
    .then((response) => response.json())
    .then((data) => {
      if (data.status != 200) {
        emailPopUp.value.type = 1;
        emailPopUp.value.message =
          $t("tokenErrorMSG");
      }
    });
};

const error = ref({
  type: 0, // 1 -> login, 2 -> register
  message: "",
});

const checkToken = (userInput) => {
  userInput = {
    token: userInput,
  };

  fetch("http://localhost:5000/api/users/checkToken/" + userData.name, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInput),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status == 200) {
        isVerifying.value = false;
        emit("verified");
      } else if (data.status == 401) {
        error.value.type = true;
        error.value.message = $t('tokenDifferentMSG');
        isVerifying.value = false;
      } else {
        error.value.type = true;
        error.value.message =
          $t("bbddErrorMSG");
      }

      verification.value.token = "";
    })
    .catch((exception) => {
      console.error("Error:", exception);
      error.value.type = true;
      error.value.message =
        $t("serverErrorMSG");
    });
};
</script>
