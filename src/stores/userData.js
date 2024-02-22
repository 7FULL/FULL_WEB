import { defineStore } from "pinia";

export const userDataStore = defineStore("userDataStore", () => {
  let logged = false;

  const userData = {
    id: "",
    name: "",
    surname: "",
    username: "",
    password: "",
    email: "",
    phone: "",
    clients: [],
    bills: [],
    role: "",
    appointments: [],
  };

  const resetData = () => {
    userData.id = "";
    userData.clients = [];
    userData.bills = [];
    userData.username = "";
    userData.email = "";
    userData.phone = "";

    logged = false;
  };

  return {
    logged,
    userData,
    resetData,
  };
});
