<template>
  <q-page class="q-pa-md">
    <div class="q-mb-md">
      <q-input filled v-model="newTask.name" label="Nombre de la tarea"
        :rules="[val => !!val || 'El nombre es requerido']" />
      <q-input filled v-model="newTask.description" label="Descripción" type="textarea" class="q-pb-md" />
      <q-input filled v-model="newTask.creationDate" mask="####-##-##" label="Fecha de creación" placeholder="YYYY-MM-DD"
        class="q-pb-md">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-date v-model="newTask.creationDate" mask="YYYY-MM-DD" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
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
      <q-btn color="primary" @click="addTask" :disable="!newTask.name">Añadir Tarea</q-btn>
    </div>

    <q-input v-model="filter" label="Buscar tareas" debounce="300" class="q-mb-md" />
    <q-select v-model="sortOrder" :options="sortOptions" label="Ordenar por" class="q-mb-md"
      @update:model-value="sortTasks" />

    <q-list bordered class="rounded-borders">
      <q-item v-for="task in filteredTasks" :key="task.id" clickable v-ripple>
        <q-item-section>
          <q-item-label>{{ task.name }}</q-item-label>
          <q-item-label caption>{{ task.description }}</q-item-label>
          <q-item-label caption>Fecha de Creación: {{ task.creationDate }}</q-item-label>
          <q-item-label caption>Fecha Límite: {{ task.deadline }}</q-item-label>
          <q-item-label caption>Estado: {{ getStatusLabel(task.status) }}</q-item-label>
          <q-item-label caption>Proyecto: {{ getProjectLabel(task.projectId) }}</q-item-label>
          <q-linear-progress :value="calculateProgress(task.creationDate, task.deadline)" color="green"
            class="full-width" />
        </q-item-section>
        <q-item-section side top>
          <q-btn flat icon="edit" @click="openEditDialog(task)" />
          <q-btn flat icon="delete" @click="deleteTask(task.id)" />
        </q-item-section>
      </q-item>
    </q-list>

    <q-dialog v-model="dialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Editar Tarea</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="taskToEdit.name" label="Nombre de la tarea" />
          <q-input v-model="taskToEdit.description" label="Descripción" type="textarea" />
          <q-input filled v-model="taskToEdit.creationDate" mask="####-##-##" label="Fecha de creación"
            placeholder="YYYY-MM-DD">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="taskToEdit.creationDate" mask="YYYY-MM-DD" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input filled v-model="taskToEdit.deadline" mask="####-##-##" label="Fecha límite" placeholder="YYYY-MM-DD">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="taskToEdit.deadline" mask="YYYY-MM-DD" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-select filled v-model="taskToEdit.status" :options="statusOptions" label="Estado de la tarea" />
          <q-select filled v-model="taskToEdit.projectId" :options="projectOptions" label="Proyecto" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Guardar" color="primary" @click="saveTask" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const projects = ref([
  { id: 1, nombre: 'Proyecto 1' },
  { id: 2, nombre: 'Proyecto 2' },
  // Añadir más proyectos según sea necesario
]);
const tasks = ref(JSON.parse(localStorage.getItem('tasks')) || []);
const newTask = ref({
  name: '', description: '', creationDate: new Date().toISOString().substr(0, 10),
  deadline: new Date().toISOString().substr(0, 10), status: 'inProcess', projectId: null
});
const dialog = ref(false);
const taskToEdit = ref({});
const filter = ref('');
const sortOrder = ref('name');
const statusOptions = [
  { label: 'En proceso', value: 'inProcess' },
  { label: 'Completado', value: 'completed' },
  { label: 'Finalizado', value: 'finalized' }
];
const projectOptions = computed(() => projects.value.map(p => ({ label: p.nombre, value: p.id })));
const sortOptions = [
  { label: 'Nombre', value: 'name' },
  { label: 'Fecha de creación', value: 'creationDate' },
  // Añadir más opciones de ordenación según sea necesario
];

watch(tasks, (newTasks) => {
  localStorage.setItem('tasks', JSON.stringify(newTasks));
}, { deep: true });

function addTask() {
  const id = tasks.value.length ? Math.max(...tasks.value.map(t => t.id)) + 1 : 1;
  tasks.value.push({ ...newTask.value, id });
  newTask.value = { name: '', description: '', creationDate: new Date().toISOString().substr(0, 10), deadline: new Date().toISOString().substr(0, 10), status: 'inProcess', projectId: null };
}

function openEditDialog(task) {
  taskToEdit.value = { ...task };
  dialog.value = true;
}

function saveTask() {
  const index = tasks.value.findIndex(t => t.id === taskToEdit.value.id);
  if (index !== -1) {
    tasks.value[index] = { ...taskToEdit.value };
    dialog.value = false;
  }
}

function deleteTask(id) {
  tasks.value = tasks.value.filter(t => t.id !== id);
}

function getStatusLabel(value) {
  const option = statusOptions.find(option => option.value === value);
  return option ? option.label : 'Desconocido';
}

function getProjectLabel(projectId) {
  const project = projects.value.find(p => p.id === projectId);
  return project ? project.nombre : 'Sin proyecto';
}

function calculateProgress(startDate, deadline) {
  const start = new Date(startDate).getTime();
  const end = new Date(deadline).getTime();
  const now = new Date().getTime();
  const progress = now > end ? 1 : (now - start) / (end - start);
  return Math.min(Math.max(progress, 0), 1);
}

const filteredTasks = computed(() => {
  return tasks.value.filter(task => task.name.toLowerCase().includes(filter.value.toLowerCase())).sort((a, b) => {
    if (sortOrder.value === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortOrder.value === 'creationDate') {
      return new Date(a.creationDate) - new Date(b.creationDate);
    }
    return 0;
  });
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
