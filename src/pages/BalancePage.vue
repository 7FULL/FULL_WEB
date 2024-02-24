<template>
  <q-page class="q-pa-md">
    <q-toolbar>
      <q-toolbar-title>Balance de facturas emitidas y recibidas</q-toolbar-title>
    </q-toolbar>

    <!-- Selector de Año -->
    <div class="q-mt-md q-mb-md">
      <q-select filled v-model="anioSeleccionado" :options="opcionesAnios" label="Seleccione el año"/>
    </div>

    <!-- Gráfico de Ventas y Compras -->
    <div class="q-ma-xl">
      <canvas id="balanceChart"></canvas>
    </div>
  </q-page>
</template>


<script setup>
import {ref, onMounted, computed, watch} from 'vue';
import { Chart, registerables } from 'chart.js';
import {userDataStore} from "stores/userData";
Chart.register(...registerables);

const userStore = userDataStore();

const facturas = ref([]);
const facturasEmitidas = computed(() => {
  let aux = facturas.value.filter(f => {
    return f.sent === true;
  })

  return aux;
});
const facturasRecibidas = computed(() => {
  let aux = facturas.value.filter(f => {
    return f.sent === false;
  })

  return aux;
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

onMounted(() => {
  facturas.value = userStore.userData.bills;
});

const anioSeleccionado = ref(new Date().getFullYear());
const opcionesAnios = ref([
  // Opciones de años para el selector, por ejemplo:
  2023, 2024
].map(year => ({ label: year.toString(), value: year })));

const calcularTotalesPorMes = (items, year) => {
  const totales = Array(12).fill(0);
  items.forEach(item => {
    const fecha = new Date(item.expirationDate);

    if (fecha.getFullYear() === year.value) {
      const mes = fecha.getMonth();
      totales[mes] += item.total || item.price;
    }
  });
  return totales;
};

watch(anioSeleccionado, () => {
  actualizarGrafico();
});

const actualizarGrafico = () => {
  const dataVentas = calcularTotalesPorMes(facturasEmitidas.value, anioSeleccionado.value);
  const dataCompras = calcularTotalesPorMes(facturasRecibidas.value, anioSeleccionado.value);

  const data = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [
      {
        label: 'Dinero en facturas emitidas',
        backgroundColor: 'rgb(54, 162, 235)',
        data: dataVentas,
      },
      {
        label: 'Dinero en facturas recibidas',
        backgroundColor: 'rgb(255, 99, 132)',
        data: dataCompras,
      }
    ]
  };

  const config = {
    type: 'bar',
    data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };

  // Destruye el gráfico anterior antes de crear uno nuevo para evitar superposiciones
  if (window.balanceChartInstance) {
    window.balanceChartInstance.destroy();
  }
  window.balanceChartInstance = new Chart(document.getElementById('balanceChart'), config);
};

onMounted(() => {
  anioSeleccionado.value = opcionesAnios.value[0];
  actualizarGrafico();
});
</script>
