<template>
    <q-page padding>
      <!-- <h1 class="text-center">FACTURAS</h1> -->

      <q-tabs v-model="tab" dense>
        <!-- Las tabs -->
        <q-tab name="todas" label="TODAS" />
        <q-tab name="emitidas" label="EMITIDAS" />
        <q-tab name="recibidas" label="RECIBIDAS" />
      </q-tabs>

      <q-separator spaced />

      <q-tab-panels v-model="tab">
        <q-tab-panel name="todas">
          <q-item>
            <q-item-section>
              <q-btn color="primary" label="Añadir Factura" @click="toggleCompraDialog" />
            </q-item-section>
            <q-item-section></q-item-section>
            <q-item-section class="q-mx-xl q-px-xl">
              <q-select v-model="filtroFacturaTodas" :options="opcionesFiltroFactura" label="Filtrar por Estado"
                        class="q-mb-md" />
            </q-item-section>
          </q-item>

          <q-list bordered v-if="facturasTodas.length > 0">
            <q-item v-for="factura in facturasTodas" :key="factura.id" clickable v-ripple @click="editarFactura(factura.id)">
              <q-item-section>Expiration date: {{ formatearFecha(factura.expirationDate) }}</q-item-section>
              <q-item-section>Concepto: {{ factura.name }}</q-item-section> <!-- Mostrar el nombre del cliente -->
              <q-item-section>Cantidad: {{ factura.price }}€</q-item-section>
              <q-item-section><q-btn color="negative" @click="borrarFactura(factura)">Borrar factura</q-btn></q-item-section>
              <q-item-section side></q-item-section>
              <q-item-section side></q-item-section>
              <q-item-section side></q-item-section>
              <q-item-section side></q-item-section>
              <q-item-section side>
                <!-- Si la compra tiene paid en true mostramos un texto de "Pagado" si no esta en true comprobamos si expirationDate es mayor a la fecha actual -->
                <q-badge :color="factura.paid ? 'green' : (new Date(factura.expirationDate) > new Date() ? 'orange' : 'red')">
                  {{ factura.paid ? 'Pagado' : (new Date(factura.expirationDate) > new Date() ? 'Pendiente' : 'Vencido') }}
                </q-badge>
              </q-item-section>
            </q-item>
          </q-list>
          <q-card v-else class="q-mb-xl">
            <q-card-section class="text-h6 text-center">No hay facturas que cumplan tus requisitos de busqueda</q-card-section>
          </q-card>
        </q-tab-panel>

        <q-tab-panel name="emitidas">
          <q-item>
            <q-item-section>
              <q-btn color="primary" label="Añadir factura a emitir" @click="toggleCompraDialog(true)" />
            </q-item-section>
            <q-item-section></q-item-section>
            <q-item-section class="q-mx-xl q-px-xl">
              <q-select v-model="filtroFacturaEmitida" :options="opcionesFiltroFactura" label="Filtrar por Estado"
                        class="q-mb-md" />
            </q-item-section>
          </q-item>

          <q-list bordered v-if="facturasEmitidas.length > 0">
            <q-item v-for="factura in facturasEmitidas" :key="factura.id" clickable v-ripple @click="editarFactura(factura.id)">
              <q-item-section>Expiration date: {{ formatearFecha(factura.expirationDate) }}</q-item-section>
              <q-item-section>Concepto: {{ factura.name }}</q-item-section> <!-- Mostrar el nombre del cliente -->
              <q-item-section>Cantidad: {{ factura.price }}€</q-item-section>
              <q-item-section><q-btn color="negative" @click="borrarFactura(factura)">Borrar factura</q-btn></q-item-section>
              <q-item-section side></q-item-section>
              <q-item-section side></q-item-section>
              <q-item-section side></q-item-section>
              <q-item-section side></q-item-section>
              <q-item-section side>
                <!-- Si la compra tiene paid en true mostramos un texto de "Pagado" si no esta en true comprobamos si expirationDate es mayor a la fecha actual -->
                <q-badge :color="factura.paid ? 'green' : (new Date(factura.expirationDate) > new Date() ? 'orange' : 'red')">
                  {{ factura.paid ? 'Pagado' : (new Date(factura.expirationDate) > new Date() ? 'Pendiente' : 'Vencido') }}
                </q-badge>
              </q-item-section>
            </q-item>
          </q-list>
          <q-card v-else class="q-mb-xl">
            <q-card-section class="text-h6 text-center">No hay facturas que cumplan tus requisitos de busqueda</q-card-section>
          </q-card>
        </q-tab-panel>

        <q-tab-panel name="recibidas">
          <q-item>
            <q-item-section>
              <q-btn color="primary" label="Añadir factura a recibir" @click="toggleCompraDialog(false)" />
            </q-item-section>
            <q-item-section></q-item-section>
            <q-item-section class="q-mx-xl q-px-xl">
              <q-select v-model="filtroFacturaRecibida" :options="opcionesFiltroFactura" label="Filtrar por Estado"
                        class="q-mb-md" />
            </q-item-section>
          </q-item>

          <q-list bordered v-if="facturasRecibidas.length > 0">
            <q-item v-for="factura in facturasRecibidas" :key="factura.id" clickable v-ripple @click="editarFactura(factura.id)">
              <q-item-section>Expiration date: {{ formatearFecha(factura.expirationDate) }}</q-item-section>
                <q-item-section>Concepto: {{ factura.name }}</q-item-section> <!-- Mostrar el nombre del cliente -->
                <q-item-section>Cantidad: {{ factura.price }}€</q-item-section>
                <q-item-section><q-btn color="negative" @click="borrarFactura(factura)">Borrar factura</q-btn></q-item-section>
                <q-item-section side></q-item-section>
                <q-item-section side></q-item-section>
                <q-item-section side></q-item-section>
                <q-item-section side></q-item-section>
                <q-item-section side>
                  <!-- Si la compra tiene paid en true mostramos un texto de "Pagado" si no esta en true comprobamos si expirationDate es mayor a la fecha actual -->
                  <q-badge :color="factura.paid ? 'green' : (new Date(factura.expirationDate) > new Date() ? 'orange' : 'red')">
                    {{ factura.paid ? 'Pagado' : (new Date(factura.expirationDate) > new Date() ? 'Pendiente' : 'Vencido') }}
                  </q-badge>
                </q-item-section>
            </q-item>
          </q-list>
          <q-card v-else class="q-mb-xl">
            <q-card-section class="text-h6 text-center">No hay facturas que cumplan tus requisitos de busqueda</q-card-section>
          </q-card>
        </q-tab-panel>
      </q-tab-panels>
      <!-- Diálogo para Añadir/Editar Compra -->
      <q-dialog v-model="compraDialog">
        <q-card class="q-pa-md wsm">
          <q-card-section>
            <q-form class="q-gutter-md" @submit.prevent="guardarFactura">
              <q-input filled v-model="conceptoPago" label="Concepto" required placeholder="Concepto de la factura" />
              <q-input filled v-model="baseImponible" label="Base Imponible" type="text" placeholder="0.00€"
                       :rules="[val => val > 0 || 'Debe ser mayor a 0']" />
              <q-input filled mask="####-##-##" v-model="fechaFactura" label="Fecha de vencimiento de la factura" placeholder="YYYY-MM-DD">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-date v-model="fechaFactura" mask="YYYY-MM-DD" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-select v-model="nombreCliente" :options="clientes" label="Nombre del Cliente" class="q-mb-md" />
              <q-select v-model="sent" :options="sentSelect" label="Estado de la Factura" class="q-mb-md" />
              <q-item>
                <q-item-section>IVA (21%)</q-item-section>
                <q-item-section side>{{ ivaCalculado }}€</q-item-section>
              </q-item>
              <div>Total: {{ total }}€</div>
              <q-btn label="Guardar Factura" color="primary" type="submit" />
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-page>
</template>

<script setup>
import {computed, onMounted, ref, watchEffect} from "vue";
import {userDataStore} from "stores/userData";
import {useQuasar} from "quasar";

const userStore = userDataStore();
const tab = ref("todas");

const baseImponible = ref(0);
const fechaFactura = ref(''); // Inicializar la fecha de la factura
const nombreCliente = ref('');
let facturaActualId = "";
const facturas = ref([]);
const facturasEmitidas = computed(() => {
  let aux = facturas.value.filter(f => {
    return f.sent === true;
  })

  // Filtrar por estado de la factura
  if (filtroFacturaEmitida.value.value === 'Todas' || filtroFacturaEmitida.value.value === undefined) {
    return aux;
  } else {
    return aux.filter(f => {
      return estadoFactura(f) === filtroFacturaEmitida.value.value
    });
  }
});
const facturasRecibidas = computed(() => {
  let aux = facturas.value.filter(f => {
    return f.sent === false;
  })

  // Filtrar por estado de la factura
  if (filtroFacturaRecibida.value.value === 'Todas' || filtroFacturaRecibida.value.value === undefined) {
    return aux;
  } else {
    return aux.filter(f => {
      return estadoFactura(f) === filtroFacturaRecibida.value.value
    });
  }
});
const facturasTodas = computed(() => {
  // Filtrar por estado de la factura
  if (filtroFacturaTodas.value.value === 'Todas' || filtroFacturaTodas.value.value === undefined) {
    return facturas.value;
  } else {
    return facturas.value.filter(f => {
      return estadoFactura(f) === filtroFacturaTodas.value.value
    });
  }
});

const conceptoPago = ref('');

const sent = ref("Emitida")
const sentSelect = [
  { label: 'Emitida', value: "Emitida" },
  { label: 'Recibida', value: "Recibida" }
];

const filtroFacturaRecibida = ref('Todas');
const filtroFacturaEmitida = ref('Todas');
const filtroFacturaTodas = ref('Todas');
const opcionesFiltroFactura = [
  { label: 'Todas', value: 'Todas' },
  { label: 'Pendientes', value: 'Pendiente' },
  { label: 'Vencidas', value: 'Vencido' },
  { label: 'Pagadas', value: 'Pagado' }
];

const clientes = userStore.userData.clients.map(c => {
  return { label: c.name, value: c.name }
});

const $q = useQuasar()
function showNotif(msg, color = "gray-4") {
  $q.notify({
    message: msg,
    color: color,
    position: "top",
    timeout: 1500,
    progress: true,
  });
}

if (userStore.logged){
  nombreCliente.value = clientes[0].value;
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString();
}

const ivaCalculado = computed(() => (baseImponible.value * 0.21).toFixed(2));
const total = computed(() => (baseImponible.value + Number(ivaCalculado.value)).toFixed(2));

onMounted(() => {
  facturas.value = userStore.userData.bills;
});

function estadoFactura(factura) {
  if (factura.paid) {
    return 'Pagado';
  } else if (new Date(factura.expirationDate) > new Date()) {
    return 'Pendiente';
  } else {
    return 'Vencido';
  }
}

const basicAuth = 'Basic ' + btoa("user" + ':' + "user");

function borrarFactura(factura) {
  compraDialog.value = false;

  fetch("http://127.0.0.1:8080/api/admin/deleteBill/" + factura.id, {
      headers: {
        'Authorization': basicAuth,
        'Content-Type': 'application/json'
      },
      method: 'DELETE',
    }
  ).then(response => response.json())
    .then(data => {
      if (data.code == 200) {
        console.log("Factura borrada correctamente");
        showNotif("Factura borrada correctamente", "green-4");
        userStore.userData.bills = userStore.userData.bills.filter(f => f.id !== factura.id);
        facturas.value = userStore.userData.bills;
      } else {
        console.log("Error al borrar la factura");
        showNotif("Error al borrar la factura", "red-4");
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      showNotif("Error al borrar la factura", "red-4");
    });

  compraDialog.value = false;
}

function guardarFactura() {
  let cliente = userStore.userData.clients.find(c => {

    if (nombreCliente.value.value !== undefined) {
      if (c.name === nombreCliente.value.value) {
        return c;
      }
    }else{
      if (c.name === nombreCliente.value) {
        return c;
      }
    }
  });
  let bill = {
    emissionDate: new Date(),
    expirationDate: new Date(fechaFactura.value),
    price: total.value,
    paid: false,
    sent: sent.value === "Emitida",
    clientID: cliente.id,
    employeeID: userStore.userData.id,
    name: conceptoPago.value
  }

  if (facturaActualId !== ""){
    console.log("Editando factura");
    bill.id = facturaActualId;
  }

  let billRequest = {
    employee: userStore.userData,
    client: cliente,
    bill: bill
  }

  fetch("http://127.0.0.1:8080/api/bill/addBill", {
      headers: {
        'Authorization': basicAuth,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(billRequest),
    }
  ).then(response => response.json())
    .then(data => {
      if (data.code == 200) {
        console.log("Factura guardada correctamente");
        showNotif("Factura guardada correctamente", "green-4");

        // Si estamos editando una factura la actualizamos si no la añadimos
        if (facturaActualId !== ""){
          let index = userStore.userData.bills.findIndex(f => f.id === facturaActualId);
          userStore.userData.bills[index] = bill;
        }else{
          userStore.userData.bills.push(bill);
        }
        facturas.value = userStore.userData.bills;

        compraDialog.value = false;

        //Limpiamos los campos
        conceptoPago.value = '';
        baseImponible.value = 0;
        fechaFactura.value = '';
        nombreCliente.value = '';
        sent.value = "Emitida";
        facturaActualId = "";
      } else {
        console.log("Error al guardar la factura");
        showNotif("Error al guardar la factura", "red-4");
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      showNotif("Error al guardar la factura", "red-4");
    });
}

const compraDialog = ref(false);

function editarFactura(id) {
  facturaActualId = id;

  let factura = facturas.value.find(f => f.id === id);

  let clientName = userStore.userData.clients.find(c => c.id === factura.clientID).name;
  let sent2 = factura.sent ? "Emitida" : "Recibida";

  conceptoPago.value = factura.name;
  baseImponible.value = factura.price;
  fechaFactura.value = factura.expirationDate;
  nombreCliente.value = clientName;
  sent.value = sent2;

  compraDialog.value = true;
}

const toggleCompraDialog = (emitida = false) => {
  compraDialog.value = true;

  if (emitida) {
    sent.value = "Emitida";
  }else{
    sent.value = "Recibida";
  }
};
</script>


<style scoped>

</style>
