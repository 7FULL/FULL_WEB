<template>
  <q-page class="q-pa-md">
    <div v-if="estaEnProyecto">
        <div>
          <q-btn flat icon="arrow_back" @click="estaEnProyecto = false" />
        </div>
      <q-item>
        <q-item-section>
          <q-input v-model="filter" label="Buscar tareas" debounce="300" class="q-mb-md" />
        </q-item-section>
      </q-item>

      <q-list bordered class="rounded-borders" v-if="filteredTasks.length > 0">
        <q-item v-for="task in filteredTasks" :key="task.id" clickable v-ripple>
          <q-item-section>
            <q-item-label>{{ task.name }}</q-item-label>
            <q-item-label caption>{{ task.description }}</q-item-label>
            <q-item-label caption>Fecha de Creación: {{ task.creationDate }}</q-item-label>
            <q-item-label caption>Fecha Límite: {{ task.deadline }}</q-item-label>
            <q-item-label caption>Estado: {{ getStatusLabel(task.status) }}</q-item-label>
            <q-item-label caption>Proyecto: {{ task.projectId }}</q-item-label>
            <q-linear-progress :value="calculateProgress(task.creationDate, task.deadline)" color="green"
                               class="full-width q-mt-md" />
          </q-item-section>
          <q-item-section side top>
            <q-btn flat icon="edit" @click="openEditDialog(task)" />
            <q-btn flat icon="delete" @click="deleteTask(task.id)" />
          </q-item-section>
        </q-item>
      </q-list>
      <q-card v-else class="rounded-borders">
        <q-card-section class="text-h6 text-center">No hay tareas disponibles</q-card-section>
      </q-card>
      <q-page-sticky position="bottom-left" :offset="[18, 18]">
        <q-fab square class="q-mt-md bg-primary" color="primary" label="Añadir nueva tarea" @click="anadirTarea" />
      </q-page-sticky>
    </div>

    <div v-else>
      <div class="grid tmpl-3 q-mt-lg col-gap-xs row-gap-xs">
        <q-card v-for="project in projects" :key="project.id" class="rounded-borders">
          <q-card-section>
            <q-item clickable v-ripple>
              <q-item-section @click="entrarEnProyecto(project.nombre)">
                <q-item-label>{{ project.nombre }}</q-item-label>
                <q-item-label caption>{{ project.descripcion }}</q-item-label>
              </q-item-section>
              <q-item-section side top>
                <q-btn flat icon="edit" @click="editarProyecto(project.nombre)" />
                <q-btn flat icon="delete" @click="eliminarProyecto(project.id)" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <p>{{ obtenerTextoTareasProyecto(project.nombre) }}</p>
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
      </div>

      <q-page-sticky position="bottom-left" :offset="[18, 18]">
        <q-fab outline square class="q-mt-md" color="primary" label="Añadir nuevo proyecto"
               @click="creandoNuevoProyecto = !creandoNuevoProyecto" />
      </q-page-sticky>
    </div>

    <q-dialog v-model="creandoNuevoProyecto">
      <q-card class="q-pa-md wmd">
        <q-form @submit.prevent="anadirProyecto">
          <q-input filled v-model="nuevoProyecto.nombre" label="Nombre del Proyecto" class="q-mb-md" />
          <q-input type="textarea" filled v-model="nuevoProyecto.descripcion" label="Descripción del Proyecto"
                   class="q-mb-md" />
          <q-btn color="positive" label="Crear Proyecto" type="submit" :disable="!nuevoProyecto.nombre || !nuevoProyecto.descripcion" />
        </q-form>
      </q-card>
    </q-dialog>
    <q-dialog v-model="dialog">
      <q-card class="q-pa-md wmd">
        <q-form @submit.prevent="addTask">
          <q-input filled v-model="newTask.name" label="Nombre de la tarea" class="q-mb-md"/>
          <q-input filled v-model="newTask.description" label="Descripción" type="textarea" class="q-pb-md" />
          <q-input filled v-model="newTask.deadline" mask="####-##-##" label="Fecha límite" placeholder="YYYY-MM-DD"
                   class="q-pb-md">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="newTask.deadline" mask="YYYY-MM-DD" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-select filled v-model="newTask.status" :options="statusOptions" label="Estado de la tarea" class="q-pb-md" />
          <q-select filled v-model="newTask.projectId" :options="projectOptions" label="Proyecto" class="q-pb-md" />
          <q-btn type="submit" color="primary" :disable="!newTask.name || !newTask.description || !newTask.deadline || !newTask.projectId || !newTask.status">{{
            estaEditando ? 'Guardar Cambios' : 'Añadir Tarea'
            }}</q-btn>
        </q-form>
      </q-card>
    </q-dialog>
    <q-dialog v-model="editProyect">
      <q-card class="q-pa-md wmd">
        <q-input filled v-model="formularioProyecto.nombre" label="Nombre del Proyecto" class="q-mb-md" />
        <q-input type="textarea" filled v-model="formularioProyecto.descripcion" label="Descripción del Proyecto"
                 class="q-mb-md" />
        <q-btn color="positive" label="Guardar Cambios" @click="guardarCambios" />
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import {ref, watch, computed, onMounted} from 'vue';
import {useQuasar} from "quasar";

const $q = useQuasar();

const editProyect = ref(false);
const projects = ref([]);
const tasks = ref([]);
const dialog = ref(false);
const filter = ref('');
const sortOrder = ref();
const statusOptions = [
  { label: 'En proceso', value: 'En proceso' },
  { label: 'Pendiente', value: 'Pendiente' },
  { label: 'Completada', value: 'Completada' }
];
const estaEnProyecto = ref(false);
const estaEditando = ref(false);

const newTask = ref({
  name: '',
  description: '',
  creationDate: new Date().toISOString().substr(0, 10),
  deadline: new Date().toISOString().substr(0, 10),
  status: statusOptions[0].value,
  projectId: null
});

const projectOptions = computed(() => projects.value.map(p => ({ label: p.nombre, value: p.id })));

function addTask() {
  if (newTask.value.projectId.label != undefined){
    newTask.value.projectId = newTask.value.projectId.label;
  }

  // Lo mismo que arriba pero con estado
  if (newTask.value.status.label != undefined){
    newTask.value.status = newTask.value.status.label;
  }

  if (estaEditando.value) {
    const indice = tasks.value.findIndex(t => t.id === newTask.value.id);
    if (indice !== -1) {
      tasks.value[indice] = { ...newTask.value };
      $q.notify({
        type: 'positive',
        message: 'Tarea actualizada'
      });
    }
    estaEditando.value = false;
  } else {
    const id = tasks.value.length ? Math.max(...tasks.value.map(t => t.id)) + 1 : 1;
    tasks.value.push({ ...newTask.value, id });
    newTask.value = {
      name: '',
      description: '',
      creationDate: new Date().toISOString(),
      deadline: new Date().toISOString(),
      status: statusOptions[0].value
    };

    // Notificamos al usuario que la tarea ha sido añadida
    $q.notify({
      type: 'positive',
      message: 'Tarea añadida correctamente'
    });
  }

  localStorage.setItem('tasks', JSON.stringify(tasks.value));

  dialog.value = false;
}

function openEditDialog(task) {
  dialog.value = true;
  estaEditando.value = true;
  // Actualizamos el valor de la tarea a editar
  newTask.value = { ...task };
}

function deleteTask(id) {
  tasks.value = tasks.value.filter(t => t.id !== id);

  localStorage.setItem('tasks', JSON.stringify(tasks.value));
}

function getStatusLabel(value) {
  const option = statusOptions.find(option => option.value === value);
  return option ? option.label : 'Desconocido';
}

function calculateProgress(startDate, deadline) {
  const start = new Date(startDate).getTime();
  const end = new Date(deadline).getTime();
  const now = new Date().getTime();
  const progress = now > end ? 1 : (now - start) / (end - start);
  return Math.min(Math.max(progress, 0), 1);
}

const filteredTasks = computed(() => {
  // Primero, filtramos las tareas que pertenecen al proyecto seleccionado
  const tasksInProject = tasks.value.filter(t => t.projectId === proyectoSeleccionado.value);

  // Luego, filtramos las tareas que coinciden con el texto de búsqueda
  const tasksFiltered = tasksInProject.filter(t => t.name.toLowerCase().includes(filter.value.toLowerCase()));

  // Finalmente, ordenamos las tareas según el criterio seleccionado
  return tasksFiltered.sort((a, b) => {
    if (sortOrder.value === 'Nombre') {
      return a.name.localeCompare(b.name);
    } else if (sortOrder.value === 'Fecha de expiracion') {
      return new Date(a.deadline) - new Date(b.deadline);
    }
  });
});

const proyectoSeleccionado = ref();
const formularioProyecto = ref({ id: null, nombre: '', descripcion: '' });
const nuevoProyecto = ref({ nombre: '', descripcion: '' });
const creandoNuevoProyecto = ref(false);

watch(proyectoSeleccionado, nuevoValor => {
  const proyecto = projects.value.find(p => p.id === nuevoValor);
  formularioProyecto.value = proyecto ? { ...proyecto } : { id: null, nombre: '', descripcion: '' };
});

const guardarCambios = () => {
  const indice = projects.value.findIndex(p => p.id === formularioProyecto.value.id);
  if (indice !== -1) {
    projects.value[indice] = { ...formularioProyecto.value };
    $q.notify({
      type: 'positive',
      message: 'Proyecto actualizado'
    });
  }
  proyectoSeleccionado.value = null;

  localStorage.setItem('projects', JSON.stringify(projects.value));

  editProyect.value = false;
};

const anadirTarea = () => {
  dialog.value = true;

  // Asignamos el nombre del proyecto seleccionado a la nueva tarea
  let aux = "";

  projects.value.forEach(p => {
    if(p.id == proyectoSeleccionado.value){
      aux = p.nombre;
    }
  });

  // Asignamos el nombre del proyecto seleccionado a la nueva tarea
  newTask.value.projectId = aux
};

const anadirProyecto = () => {
  if (!nuevoProyecto.value.nombre) {
    $q.notify({
      type: 'warning',
      message: 'El nombre del proyecto es requerido'
    });
    return;
  }

  const nuevoId = projects.value.length > 0 ? Math.max(...projects.value.map(p => p.id)) + 1 : 1;
  projects.value.push({
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

  localStorage.setItem('projects', JSON.stringify(projects.value));
};

const eliminarProyecto = id => {
  projects.value = projects.value.filter(p => p.id !== id);
  $q.notify({
    type: 'negative',
    message: 'Proyecto eliminado correctamente'
  });

  localStorage.setItem('projects', JSON.stringify(projects.value));
};

const editarProyecto = id => {
  editProyect.value = true;
  proyectoSeleccionado.value = id;
};

const entrarEnProyecto = id => {
  proyectoSeleccionado.value = id;
  estaEnProyecto.value = true;
};

function obtenerTextoTareasProyecto(id) {
  // Primero obtenemos todas las tareas que pertenecen al proyecto
  const tareasProyecto = tasks.value.filter(t => t.projectId === id);

  // Luego, contamos cuántas tareas completadas hay
  const tareasCompletadas = tareasProyecto.filter(t => t.status === 'Completada').length;

  // Finalmente, devolvemos un mensaje con el número de tareas completadas y el total de tareas
  return `Tareas completadas: ${tareasCompletadas} / ${tareasProyecto.length}`;
}

onMounted(() => {
  tasks.value = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
  projects.value = localStorage.getItem('projects') ? JSON.parse(localStorage.getItem('projects')) : [];
});
</script>

<style>
.full-width {
  width: 100%;
}

.rounded-borders {
  border-radius: 4px;
}
</style>
