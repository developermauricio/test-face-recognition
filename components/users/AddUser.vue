<template>
  <div class="container p-4 px-5">
    <h3>Agregar Usuario</h3>
    <div class="row mt-5">
      <!-- Tomar Fotografías -->
      <div class="col-12 col-lg-12 col-md-12">
        <div class="form-group">
          <label class="form-check-label">Nombre</label>
          <input v-model="name" type="text" class="form-control">
        </div>
        <h4>Video</h4>
        <!--  Botón encender cámara   -->
        <div class="mb-2">
          <button class="btn btn-primary btn-sm" @click="fOpenCamera(!openCamera)">
            {{ openCamera ? 'Cerrar Cámara' : 'Encender Camara' }}
          </button>
        </div>
        <!--   Camará y Imágenes  -->
        <div class="text-center">
          <video id="live-video"
                 width="320"
                 height="247"
                 autoplay v-if="openCamera"></video>
          <canvas
            class="d-none"
            v-if="openCamera"
            id="live-canvas"
            width="320"
            height="250"/>
          <!-- Fotos tomadas  -->
          <div v-if="$store.state.user.user.photos.length > 0">
            <div class="d-flex justify-content-center mb-3">
              <div v-for="(photo, index) in $store.state.user.user.photos" :key="index">
                <img class="mr-2" :src="photo.photo" width="100" alt="">
              </div>
            </div>
          </div>
        </div>

        <!--  Botón tomar foto  -->
        <div class="text-center" v-if="openCamera">
          <a href="#" @click="takePhoto" class="btn btn-primary btn-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-camera2"
                 viewBox="0 0 16 16">
              <path d="M5 8c0-1.657 2.343-3 4-3V4a4 4 0 0 0-4 4z"/>
              <path
                d="M12.318 3h2.015C15.253 3 16 3.746 16 4.667v6.666c0 .92-.746 1.667-1.667 1.667h-2.015A5.97 5.97 0 0 1 9 14a5.972 5.972 0 0 1-3.318-1H1.667C.747 13 0 12.254 0 11.333V4.667C0 3.747.746 3 1.667 3H2a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1h.682A5.97 5.97 0 0 1 9 2c1.227 0 2.367.368 3.318 1zM2 4.5a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0zM14 8A5 5 0 1 0 4 8a5 5 0 0 0 10 0z"/>
            </svg>
          </a>
        </div>
        <hr>
        <div class="mt-3">
          <button type="submit" class="btn btn-primary btn-block" @click="addUser">Agregar Usuario</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddUser",
  data() {
    return {
      name: '',
      openCamera: false,
    }
  },
  methods: {
    addUser() {
      this.$axios.post('api/add-user', this.$store.state.user.user).then(resp => {

      }).catch(e => {
        console.log()
      })
    },
    async fOpenCamera(stateCamere) {
      this.openCamera = stateCamere
      if (this.openCamera) {
        await this.$store.dispatch('camera/startCamera')
          .then((stream) => {
            const videoDiv = document.getElementById('live-video')
            videoDiv.srcObject = stream
          })
      } else {
        await this.$store.dispatch('camera/stopCamera')
      }
    },
    async takePhoto() {
      const video = document.getElementById("live-video")
      const canvas = document.getElementById("live-canvas")
      const canvasCtx = canvas.getContext("2d")
      canvasCtx.drawImage(video, 0, 0, 320, 247)
      const photo = canvas.toDataURL("image/jpeg")
      await this.$store.dispatch('user/uploadBase64', {
        photo,
        ext: 'jpeg'
      })
    }
  },
  watch: {
    'name': async function (val)  {
      await this.$store.dispatch('user/addNameUser', val)
    }
  }
}
</script>

<style scoped>

</style>
