<template>
  <div class="container">
    <div class="header">
      <h1>Refugio de Gatos</h1>
      <div class="top-bar">
        <input
          v-model="busqueda"
          type="text"
          placeholder="Buscar por nombre..."
          class="input-busqueda"
        />
        <button @click="abrirModalCrear">Agregar Gato</button>
      </div>
    </div>

    <div v-if="loading" class="loading">Cargando gatitos adorables...</div>

    <table v-else class="tabla-gatos">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Edad</th>
          <th>Raza</th>
          <th>Collar</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="gato in gatos" :key="gato.id">
          <td>{{ gato.nombre }}</td>
          <td>{{ gato.edad }} años</td>
          <td>{{ gato.raza }}</td>
          <td>{{ gato.collar }}</td>
          <td>
            <span :class="['estado', gato.estado.toLowerCase()]">
              {{ gato.estado }}
            </span>
          </td>
          <td class="acciones">
            <button class="btn-editar" @click="abrirModalEditar(gato)">Editar</button>
            <button class="btn-eliminar" @click="eliminarGato(gato.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="paginacion">
      <button @click="cambiarPagina(paginaActual - 1)" :disabled="paginaActual === 1">
        Anterior
      </button>
      <span>Página {{ paginaActual }} de {{ totalPaginas }}</span>
      <button @click="cambiarPagina(paginaActual + 1)" :disabled="paginaActual === totalPaginas">
        Siguiente
      </button>
    </div>

    <ModalGato
      :visible="modalVisible"
      :modo="modoModal"
      :gato="gatoEditar"
      @guardado="guardado"
      @cerrar="cerrarModal"
      @error="errorModal"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import ModalGato from '@/components/ModalGato.vue'
import api from '@/services/api'
import Swal from 'sweetalert2'

interface Gato {
  id: number
  nombre: string
  edad: number
  raza: string
  collar: string
  estado: string
}

const gatos = ref<Gato[]>([])
const paginaActual = ref(1)
const totalPaginas = ref(1)
const loading = ref(false)
const elementosPorPagina = 10
const busqueda = ref('')

const modalVisible = ref(false)
const modoModal = ref<'crear' | 'editar'>('crear')
const gatoEditar = ref<Gato | null>(null)

const obtenerGatos = async (pagina: number) => {
  loading.value = true
  try {
    const res = await api.get('/gatos', {
      params: {
        page: pagina,
        limit: elementosPorPagina,
        busqueda: busqueda.value.trim(),
      },
    })
    gatos.value = res.data.data
    totalPaginas.value = res.data.last_page || 1
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

watch(busqueda, () => {
  paginaActual.value = 1
  obtenerGatos(1)
})

const cambiarPagina = (nueva: number) => {
  if (nueva >= 1 && nueva <= totalPaginas.value) {
    paginaActual.value = nueva
    obtenerGatos(nueva)
  }
}

const abrirModalCrear = () => {
  modoModal.value = 'crear'
  gatoEditar.value = null
  modalVisible.value = true
}

const abrirModalEditar = (gato: Gato) => {
  modoModal.value = 'editar'
  gatoEditar.value = gato
  modalVisible.value = true
}

const cerrarModal = () => {
  modalVisible.value = false
}

const guardado = async (gato: any) => {
  try {
    if (modoModal.value === 'crear') {
      await api.post('/gatos', gato)
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Gato agregado con éxito',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      })
    } else {
      await api.put(`/gatos/${gato.id}`, gato)
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Gato editado con éxito',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      })
    }
    cerrarModal()
    obtenerGatos(paginaActual.value)
  } catch (e) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Error al guardar el gato',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    })
    console.error(e)
  }
}

const errorModal = (msg: string) => {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'error',
    title: msg,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  })
}

const eliminarGato = async (id: number) => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
  })

  if (result.isConfirmed) {
    try {
      await api.delete(`/gatos/${id}`)
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Gato eliminado',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      })
      obtenerGatos(paginaActual.value)
    } catch (e) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Error al eliminar',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      })
      console.error(e)
    }
  }
}

onMounted(() => {
  obtenerGatos(paginaActual.value)
})
</script>

<style scoped src="@/assets/GatosView.css"></style>
