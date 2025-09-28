<!-- src/views/MembersView.vue -->
<template>
  <div class="members-view">
    <!-- Header de la sección -->
    <div class="section-header">
      <h2>CU-01 — Registrar/Modificar Miembro</h2>
      <button class="btn btn-visible">Acción visible</button>
    </div>

    <!-- Formulario izquierdo -->
    <div class="form-container">
      <div class="form-group">
        <label>Nombre completo</label>
        <input v-model="member.name" type="text" placeholder="Carla Gómez" />
      </div>

      <div class="form-group">
        <label>DNI</label>
        <input v-model="member.dni" type="text" placeholder="30123456" />
      </div>

      <div class="form-group">
        <label>Fecha de nacimiento</label>
        <input v-model="member.birthDate" type="date" />
      </div>

      <div class="form-group">
        <label>Teléfono</label>
        <input v-model="member.phone" type="text" placeholder="+54 11 5555-0001" />
      </div>

      <div class="form-group">
        <label>Email</label>
        <input v-model="member.email" type="email" placeholder="carla@demo.com" />
      </div>

      <div class="form-group">
        <label>Tipo de membresía</label>
        <select v-model="member.membershipType">
          <option value="Mensual">Mensual</option>
          <option value="Anual">Anual</option>
          <option value="Trimestral">Trimestral</option>
        </select>
      </div>

      <div class="form-group">
        <label>Fecha de inicio</label>
        <input v-model="member.startDate" type="date" />
      </div>

      <div class="form-group">
        <label>Foto (URL opcional)</label>
        <input v-model="member.photoUrl" type="url" placeholder="https://..." />
      </div>

      <!-- Botones -->
      <div class="form-actions">
        <button @click="saveMember" class="btn btn-primary">Registrar</button>
        <button @click="updateMember" class="btn btn-secondary">Modificar</button>
        <button @click="deleteMember" class="btn btn-danger">Eliminar</button>
      </div>
    </div>

    <!-- Tabla derecha -->
    <div class="table-container">
      <div class="table-header">
        <h3>Consultar/Imprimir Miembros</h3>
        <div class="search-controls">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Buscar por nombre, DNI..."
            class="search-input"
          />
          <button @click="clearSearch" class="btn btn-sm">Limpiar</button>
          <button @click="printList" class="btn btn-sm">Imprimir listado</button>
        </div>
      </div>

      <table class="members-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>DNI</th>
            <th>Membresía</th>
            <th>Inicio</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in filteredMembers" :key="m.id">
            <td>{{ m.name }}</td>
            <td>{{ m.dni }}</td>
            <td>{{ m.membershipType }}</td>
            <td>{{ m.startDate }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MembersView',
  data() {
    return {
      member: {
        id: null,
        name: '',
        dni: '',
        birthDate: '',
        phone: '',
        email: '',
        membershipType: 'Mensual',
        startDate: '',
        photoUrl: ''
      },
      members: [], // Lista de miembros desde la API
      searchQuery: '',
      editingId: null
    }
  },
  computed: {
    filteredMembers() {
      if (!this.searchQuery) return this.members
      const q = this.searchQuery.toLowerCase()
      return this.members.filter(m => 
        m.name.toLowerCase().includes(q) || 
        m.dni.includes(q)
      )
    }
  },
  async mounted() {
    await this.loadMembers()
  },
  methods: {
    async loadMembers() {
      try {
        const res = await fetch('/api/miembros')
        if (res.ok) {
          this.members = await res.json()
        }
      } catch (error) {
        console.error('Error al cargar miembros:', error)
      }
    },

    async saveMember() {
      try {
        const res = await fetch('/api/miembros', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.member)
        })
        if (res.ok) {
          const newMember = await res.json()
          this.members.push(newMember)
          this.resetForm()
          alert('Miembro registrado con éxito')
        }
      } catch (error) {
        alert('Error al registrar miembro')
      }
    },

    async updateMember() {
      if (!this.editingId) {
        alert('Selecciona un miembro para modificar')
        return
      }
      try {
        const res = await fetch(`/api/miembros/${this.editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.member)
        })
        if (res.ok) {
          const updated = await res.json()
          const index = this.members.findIndex(m => m.id === this.editingId)
          if (index !== -1) this.members.splice(index, 1, updated)
          this.resetForm()
          alert('Miembro actualizado')
        }
      } catch (error) {
        alert('Error al actualizar miembro')
      }
    },

    async deleteMember() {
      if (!this.editingId) {
        alert('Selecciona un miembro para eliminar')
        return
      }
      if (!confirm('¿Estás seguro de eliminar este miembro?')) return

      try {
        const res = await fetch(`/api/miembros/${this.editingId}`, {
          method: 'DELETE'
        })
        if (res.ok) {
          this.members = this.members.filter(m => m.id !== this.editingId)
          this.resetForm()
          alert('Miembro eliminado')
        }
      } catch (error) {
        alert('Error al eliminar miembro')
      }
    },

    resetForm() {
      this.member = {
        id: null,
        name: '',
        dni: '',
        birthDate: '',
        phone: '',
        email: '',
        membershipType: 'Mensual',
        startDate: '',
        photoUrl: ''
      }
      this.editingId = null
    },

    clearSearch() {
      this.searchQuery = ''
    },

    printList() {
      window.print()
    }
  }
}
</script>

<style scoped>
.members-view {
  padding: 2rem;
  background: linear-gradient(90deg, #1e3a8a, #3b82f6);
  min-height: 100vh;
  color: #fff;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
}

.section-header h2 {
  font-size: 1.3rem;
  margin: 0;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.btn-visible {
  background: rgba(255,255,255,0.1);
  color: #fff;
}

.btn-primary {
  background: #16a34a;
  color: white;
}

.btn-secondary {
  background: #3b82f6;
  color: white;
}

.btn-danger {
  background: #dc2626;
  color: white;
}

.btn-sm {
  padding: 0.3rem 0.7rem;
  font-size: 0.85rem;
}

.form-container {
  background: rgba(255,255,255,0.05);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 6px;
  background: rgba(255,255,255,0.05);
  color: #fff;
}

.form-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.table-container {
  background: rgba(255,255,255,0.05);
  padding: 1.5rem;
  border-radius: 12px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.table-header h3 {
  font-size: 1.2rem;
  margin: 0;
}

.search-controls {
  display: flex;
  gap: 0.5rem;
}

.search-input {
  padding: 0.5rem;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 6px;
  background: rgba(255,255,255,0.05);
  color: #fff;
  flex: 1;
}

.members-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.members-table th,
.members-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.members-table th {
  background: rgba(255,255,255,0.05);
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .members-view {
    padding: 1rem;
  }

  .form-container,
  .table-container {
    padding: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .search-controls {
    flex-direction: column;
  }
}
</style>