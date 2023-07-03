<template>
  <div>
    <!-- Titulo y botón -->
    <div class="d-flex justify-content-between">
      <div>
        <h1>Usuarios</h1>
      </div>
      <div>
        <button class="btn btn-primary btn-sm" @click="openModal">Agregar Usuario</button>
      </div>
    </div>
    <!-- Lista de usuarios -->
    <div class="mt-4">
      <table class="table">
        <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Nombre</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th scope="row">1</th>
          <td>Mark</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>

</template>

<script>
import AddUser from "./AddUser";

export default {
  name: "Users",
  methods: {
    openModal() {
      this.$FModal.show(
        {
          component: AddUser,
          // clickToClose: false,
          // escToClose: false,
          placement: 'center top',
        },
      )
    }
  }
}
</script>

<style scoped>

</style>
