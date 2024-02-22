<template>
  <q-page class="q-pa-md">
    <q-img class="full-width" loading="lazy"
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/67ee966503a61745c0ce64ec83fec583bb846b8ba31b8abb28bad351cb715d67"
      ratio="16/9" />

    <div class="q-mt-md">
      <q-select label="Selecciona un proyecto" filled v-model="proyectoSeleccionado" :options="opcionesProyectos"
        emit-value map-options @input="actualizarFormulario" />
    </div>

    <div v-if="proyectoSeleccionado" class="q-mt-md">
      <q-input filled v-model="formularioProyecto.nombre" label="Nombre del Proyecto" class="q-mb-md" />
      <q-input type="textarea" filled v-model="formularioProyecto.descripcion" label="Descripción del Proyecto"
        class="q-mb-md" />
      <q-btn color="positive" label="Guardar Cambios" @click="guardarCambios" />
    </div>

    <q-btn flat class="q-mt-md" color="primary" label="Añadir nuevo proyecto"
      @click="creandoNuevoProyecto = !creandoNuevoProyecto" />

    <div v-if="creandoNuevoProyecto" class="q-mt-md">
      <q-input filled v-model="nuevoProyecto.nombre" label="Nombre del Proyecto" class="q-mb-md" />
      <q-input type="textarea" filled v-model="nuevoProyecto.descripcion" label="Descripción del Proyecto"
        class="q-mb-md" />
      <q-btn color="positive" label="Crear Proyecto" @click="anadirProyecto" />
    </div>

    <div class="text-h5 q-mt-md">Miembros del Equipo</div>
    <q-list bordered class="q-mt-md">
      <q-item v-for="miembro in miembrosEquipo" :key="miembro.nombre" clickable>
        <q-checkbox v-model="miembro.seleccionado" left dense />
        <q-avatar>{{ miembro.avatar }}</q-avatar>
        <q-item-section>
          <q-item-label>{{ miembro.nombre }}</q-item-label>
          <q-item-label caption>{{ miembro.rol }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const proyectos = ref([
  { id: 1, nombre: 'Proyecto 1', descripcion: 'Descripción del Proyecto 1' },
  { id: 2, nombre: 'Proyecto 2', descripcion: 'Descripción del Proyecto 2' },
]);

const miembrosEquipo = ref([
  { nombre: 'Usuario 1', rol: 'Desarrollador', avatar: '😃', seleccionado: false },
  { nombre: 'Usuario 2', rol: 'Diseñador', avatar: '🎨', seleccionado: false },
  { nombre: 'Usuario 3', rol: 'Gerente de Proyecto', avatar: '📅', seleccionado: false },
  { nombre: 'Usuario 4', rol: 'Analista de Datos', avatar: '📊', seleccionado: false },
  { nombre: 'Usuario 5', rol: 'Especialista SEO', avatar: '🔍', seleccionado: false },
]);


const proyectoSeleccionado = ref(null);
const formularioProyecto = ref({ id: null, nombre: '', descripcion: '' });
const nuevoProyecto = ref({ nombre: '', descripcion: '' });
const creandoNuevoProyecto = ref(false);

const opcionesProyectos = computed(() => proyectos.value.map(p => ({ label: p.nombre, value: p.id })));

watch(proyectoSeleccionado, nuevoValor => {
  const proyecto = proyectos.value.find(p => p.id === nuevoValor);
  formularioProyecto.value = proyecto ? { ...proyecto } : { id: null, nombre: '', descripcion: '' };
});

const guardarCambios = () => {
  const indice = proyectos.value.findIndex(p => p.id === formularioProyecto.value.id);
  if (indice !== -1) {
    proyectos.value[indice] = { ...formularioProyecto.value };
    $q.notify({
      type: 'positive',
      message: 'Proyecto actualizado'
    });
  }
  proyectoSeleccionado.value = null;
};

const anadirProyecto = () => {
  if (!nuevoProyecto.value.nombre) {
    $q.notify({
      type: 'warning',
      message: 'El nombre del proyecto es requerido'
    });
    return;
  }

  const nuevoId = proyectos.value.length > 0 ? Math.max(...proyectos.value.map(p => p.id)) + 1 : 1;
  proyectos.value.push({
    id: nuevoId,
    nombre: nuevoProyecto.value.nombre,
    descripcion: nuevoProyecto.value.descripcion,
  });

  $q.notify({
    type: 'positive',
    message: 'Proyecto añadido correctamente'
  });

  nuevoProyecto.value = { nombre: '', descripcion: '' };
  creandoNuevoProyecto.value = false;
};
</script>

<style>
.full-width {
  max-width: 100%;
  border-radius: 8px;
}
</style>
