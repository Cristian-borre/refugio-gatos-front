<template>
  <transition name="fade">
    <div v-if="visible" class="modal-overlay" @click.self="cerrar">
      <div class="modal-container" role="dialog" aria-modal="true">
        <header class="modal-header">
          <h2>{{ modo === 'crear' ? 'Agregar Gato' : 'Editar Gato' }}</h2>
          <button class="close-btn" @click="cerrar" aria-label="Cerrar modal">&times;</button>
        </header>

        <form @submit.prevent="guardar" class="modal-form">
          <label>
            Nombre:
            <input v-model="form.nombre" type="text" required autocomplete="off" />
          </label>

          <label>
            Edad (años):
            <input v-model.number="form.edad" type="number" min="0" required />
          </label>

          <label>
            Raza:
            <input v-model="form.raza" type="text" autocomplete="off" />
          </label>

          <label>
            Collar:
            <input v-model="form.collar" type="text" required autocomplete="off" />
          </label>

          <label>
            Estado:
            <select v-model="form.estado" required>
              <option value="" disabled>Selecciona estado</option>
              <option value="disponible">Disponible</option>
              <option value="adoptado">Adoptado</option>
            </select>
          </label>

          <footer class="modal-footer">
            <button type="submit" class="btn-guardar">
              {{ modo === 'crear' ? 'Agregar' : 'Guardar' }}
            </button>
            <button type="button" class="btn-cancelar" @click="cerrar">Cancelar</button>
          </footer>
        </form>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

interface Gato {
  id?: number
  nombre: string
  edad: number
  raza: string
  collar: string
  estado: string
}

const props = defineProps<{
  visible: boolean
  modo: 'crear' | 'editar'
  gato: Gato | null
}>()

const emit = defineEmits(['guardado', 'cerrar', 'error'])

const form = reactive<Gato>({
  nombre: '',
  edad: 0,
  raza: '',
  collar: '',
  estado: '',
})

watch(
  () => props.gato,
  (nuevo) => {
    if (nuevo) {
      Object.assign(form, nuevo)
    } else {
      form.nombre = ''
      form.edad = 0
      form.raza = ''
      form.collar = ''
      form.estado = ''
    }
  },
  { immediate: true },
)

const cerrar = () => {
  emit('cerrar')
}

const guardar = () => {
  if (!form.nombre || form.edad < 0 || !form.collar || !form.estado) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'warning',
      title: 'Por favor completa todos los campos correctamente.',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    })
    return
  }

  try {
    emit('guardado', { ...form })
  } catch (error) {
    emit('error', 'Error al guardar el gato')
  }
}
</script>

<style scoped src="@/assets/ModalGato.css"></style>
