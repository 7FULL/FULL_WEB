<template>
  <q-page class="q-pa-md">
    <q-toolbar>
      <q-toolbar-title>Balance de Ventas y Compras</q-toolbar-title>
    </q-toolbar>

    <!-- Selector de Año -->
    <div class="q-mt-md q-mb-md">
      <q-select filled v-model="anioSeleccionado" :options="opcionesAnios" label="Seleccione el año"
        @input="actualizarGrafico" />
    </div>

    <!-- Gráfico de Ventas y Compras -->
    <div>
      <canvas id="balanceChart"></canvas>
    </div>
  </q-page>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// Ejemplo de datos simulados, reemplaza con la lógica de obtención de datos reales
const ventas = ref([
  // { fecha: '2024-01-15', total: 100 },
  // { fecha: '2024-02-15', total: 150 },
  // Asume datos similares para 'compras'
]);
const compras = ref([
  // { fecha: '2024-01-20', costo: 80 },
  // { fecha: '2024-02-25', costo: 120 },
  // Asume datos similares para 'ventas'
]);

const anioSeleccionado = ref(new Date().getFullYear());
const opcionesAnios = ref([
  // Opciones de años para el selector, por ejemplo:
  2022, 2023, 2024
].map(year => ({ label: year.toString(), value: year })));

const calcularTotalesPorMes = (items, year) => {
  const totales = Array(12).fill(0);
  items.forEach(item => {
    const fecha = new Date(item.fecha);
    if (fecha.getFullYear() === year) {
      const mes = fecha.getMonth();
      totales[mes] += item.total || item.costo;
    }
  });
  return totales;
};

const actualizarGrafico = () => {
  const dataVentas = calcularTotalesPorMes(ventas.value, anioSeleccionado.value);
  const dataCompras = calcularTotalesPorMes(compras.value, anioSeleccionado.value);

  const data = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [
      {
        label: 'Ventas',
        backgroundColor: 'rgb(54, 162, 235)',
        data: dataVentas,
      },
      {
        label: 'Compras',
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
  actualizarGrafico();
});
</script>
