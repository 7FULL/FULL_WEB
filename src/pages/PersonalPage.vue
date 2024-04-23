<template>
  <q-page>
    <p>Clientes</p>
    <div class="grid tmpl-3 row-gap-xs col-gap-xs q-pa-xl">
      <q-btn @click="añaCliente" class="q-pa-md" color="primary" icon="add" label="Añadir cliente" />

      <q-card v-for="cliente in clients" :key="cliente.id" class="q-pa-md">
        <q-card-section>
          <q-item>
            <q-item-section class="text-h4">{{ cliente.name }}</q-item-section>
            <q-item-section side>
              <q-btn icon="edit" @click="editarCliente(cliente.id)" class="q-mb-md" color="secondary" />
              <q-btn icon="delete" @click="deleteCliente(cliente)" color="negative" />
            </q-item-section>
          </q-item>
        </q-card-section>
      </q-card>
    </div>

    <q-separator />

    <p>Empleados</p>
    <div class="grid tmpl-3 row-gap-xs col-gap-xs q-pa-xl">
      <q-btn @click="añaEmpleado" class="q-pa-md" color="primary" icon="add" label="Añadir empleado" />

      <q-card v-for="employee in employees" :key="employee.id" class="q-pa-md">
        <q-card-section>
          <q-item>
            <q-item-section class="text-h4">{{ employee.name }}</q-item-section>
            <q-item-section side>
              <q-btn icon="edit" @click="editarEmpleado(employee.id)" class="q-mb-md" color="secondary" />
              <q-btn icon="delete" @click="deleteEmployee(employee)" color="negative" />
            </q-item-section>
          </q-item>
        </q-card-section>
      </q-card>
    </div>

    <q-dialog v-model="editandoCliente">
      <q-card class="q-pa-md">
        <q-card-section>
          <p class="text-h6 text-center">Editar cliente</p>
        </q-card-section>
        <q-form @submit.prevent="editCliente(clienteSeleccionado)">
          <q-input v-model="clienteSeleccionado.name" label="Nombre" />
          <q-input v-model="clienteSeleccionado.surname" label="Apellidos" />
          <q-input v-model="clienteSeleccionado.username" label="Username" />
          <q-input type="email" v-model="clienteSeleccionado.email" label="Email" />
          <q-input type="tel" v-model="clienteSeleccionado.phone" label="Teléfono" />
        </q-form>
        <q-card-actions align="right" class="q-mt-md">
          <q-btn label="Cancelar" color="negative" @click="editandoCliente = false" />
          <q-btn label="Guardar" color="primary" @click="editCliente(clienteSeleccionado)" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="editandoEmpleado">
      <q-card class="q-pa-md">
        <q-card-section>
          <p class="text-h6 text-center">Editar empleado</p>
        </q-card-section>
        <q-form @submit.prevent="editEmployee(empleadoSeleccionado)">
          <q-input v-model="empleadoSeleccionado.name" label="Nombre" />
          <q-input v-model="empleadoSeleccionado.surname" label="Apellidos" />
          <q-input v-model="empleadoSeleccionado.username" label="Username" />
          <q-input type="email" v-model="empleadoSeleccionado.email" label="Email" />
          <q-input type="tel" v-model="empleadoSeleccionado.phone" label="Teléfono" />
        </q-form>
        <q-card-actions align="right" class="q-mt-md">
          <q-btn label="Cancelar" color="negative" @click="editandoEmpleado = false" />
          <q-btn label="Guardar" color="primary" @click="editEmployee(empleadoSeleccionado)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import {userDataStore} from "stores/userData";
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {useQuasar} from "quasar";

const $q = useQuasar();
const router = useRouter();
const userStore = userDataStore();
const clients = ref([])
const employees = ref([])

const editandoCliente = ref(false)
const editandoEmpleado = ref(false)

const clienteSeleccionado = ref({})
const empleadoSeleccionado = ref({})

const basicAuthAdmin = 'Basic ' + btoa("admin" + ':' + "admin");

onMounted(() => {
  if (userStore.userData.role.toLowerCase() !== 'admin') {
    // SI no es admin mandamos al inicio con una notificación
    router.push('/')
    $q.notify({
      color: 'negative',
      position: 'top',
      message: 'No tienes permisos para acceder a esta página',
      icon: 'report_problem'
    })
  } else {
    fetch("http://127.0.0.1:8080/api/admin/getClients",{
        headers: {
          'Authorization': basicAuthAdmin,
        },
      }
    ).then(response => response.json())
      .then(data => {
        if (data.code === 200) {
          clients.value = data.data
        } else {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Error al obtener los clientes',
            icon: 'report_problem'
          })
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    fetch("http://127.0.0.1:8080/api/admin/getEmployees",{
        headers: {
          'Authorization': basicAuthAdmin,
        },
    }).then(response => response.json())
      .then(data => {
        if (data.code === 200) {
          employees.value = data.data
        } else {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Error al obtener los empleados',
            icon: 'report_problem'
          })
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
})

const editarCliente = (clienteID) => {
  const clienteAux = clients.value.find(c => c.id === clienteID)
  clienteSeleccionado.value = {...clienteAux}
  editandoCliente.value = true
}

const editarEmpleado = (empleadoID) => {
  const empleadoAux = employees.value.find(e => e.id === empleadoID)

  empleadoSeleccionado.value = {...empleadoAux}
  editandoEmpleado.value = true
}

const añaCliente = () => {
  clienteSeleccionado.value = {}
  editandoCliente.value = true
}

const añaEmpleado = () => {
  empleadoSeleccionado.value = {}
  editandoEmpleado.value = true
}

// Funciones para editar, eliminar y crear clientes y empleados
function editCliente(cliente) {
  cliente.role = "CLIENT"

  fetch("http://127.0.0.1:8080/api/admin/addClient", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': basicAuthAdmin,
    },
    body: JSON.stringify(cliente),
  }).then(response => response.json())
    .then(data => {
      if (data.code === 200) {
        $q.notify({
          color: 'positive',
          position: 'top',
          message: 'Cliente editado correctamente',
          icon: 'check'
        })
        //Si la id del cliente ya existe, lo editamos, si no, lo añadimos
        if (clients.value.find(c => c.id === cliente.id)) {
          clients.value = clients.value.map(c => {
            if (c.id === cliente.id) {
              return cliente
            }
            return c
          })
        } else {
          clients.value.push(cliente)
        }

        editandoCliente.value = false
      } else {
        $q.notify({
          color: 'negative',
          position: 'top',
          message: 'Error al editar el cliente',
          icon: 'report_problem'
        })
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      $q.notify({
        color: 'negative',
        position: 'top',
        message: 'Error al editar el cliente',
        icon: 'report_problem'
      })
    });
}

function deleteCliente(cliente) {
  fetch("http://127.0.0.1:8080/api/admin/deleteClient/" + cliente.id, {
    method: 'DELETE',
    headers: {
      'Authorization': basicAuthAdmin,
    },
  }).then(response => response.json())
    .then(data => {
      if (data.code === 200) {
        $q.notify({
          color: 'positive',
          position: 'top',
          message: 'Cliente eliminado correctamente',
          icon: 'check'
        })
        clients.value = clients.value.filter(c => c.id !== cliente.id)
      } else {
        $q.notify({
          color: 'negative',
          position: 'top',
          message: 'Error al eliminar el cliente',
          icon: 'report_problem'
        })
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      $q.notify({
        color: 'negative',
        position: 'top',
        message: 'Error al eliminar el cliente',
        icon: 'report_problem'
      })
    });
}

function editEmployee(employee) {
  employee.role = "EMPLOYEE"

  fetch("http://127.0.0.1:8080/api/admin/addEmployee", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': basicAuthAdmin,
    },
    body: JSON.stringify(employee),
  }).then(response => response.json())
    .then(data => {
      if (data.code === 200) {
        $q.notify({
          color: 'positive',
          position: 'top',
          message: 'Empleado editado correctamente',
          icon: 'check'
        })
        //Si la id del empleado ya existe, lo editamos, si no, lo añadimos
        if (employees.value.find(e => e.id === employee.id)) {
          employees.value = employees.value.map(e => {
            if (e.id === employee.id) {
              return employee
            }
            return e
          })
        } else {
          employees.value.push(employee)
        }
        editandoEmpleado.value = false
      } else {
        $q.notify({
          color: 'negative',
          position: 'top',
          message: 'Error al editar el empleado',
          icon: 'report_problem'
        })
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      $q.notify({
        color: 'negative',
        position: 'top',
        message: 'Error al editar el empleado',
        icon: 'report_problem'
      })
    });
}

function deleteEmployee(employee) {
  fetch("http://127.0.0.1:8080/api/admin/deleteEmployee/" + employee.id, {
    method: 'DELETE',
    headers: {
      'Authorization': basicAuthAdmin,
    },
  }).then(response => response.json())
    .then(data => {
      if (data.code === 200) {
        $q.notify({
          color: 'positive',
          position: 'top',
          message: 'Empleado eliminado correctamente',
          icon: 'check'
        })
        employees.value = employees.value.filter(e => e.id !== employee.id)
      } else {
        $q.notify({
          color: 'negative',
          position: 'top',
          message: 'Error al eliminar el empleado',
          icon: 'report_problem'
        })
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      $q.notify({
        color: 'negative',
        position: 'top',
        message: 'Error al eliminar el empleado',
        icon: 'report_problem'
      })
    });
}

</script>

<style scoped></style>
