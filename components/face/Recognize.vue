<template>
  <div>
    <div class="mb-2">
      <button class="btn btn-primary btn-sm" @click="fOpenCamera(!openCamera)">
        {{ openCamera ? 'Cerrar Cámara' : 'Encender Camara' }}
      </button>
    </div>
    <!--   Camará y Imágenes  -->
    <div class="text-center">
      <video id="live-video"
             class="d-none"
             width="320"
             height="250"
             autoplay v-if="openCamera"></video>
      <canvas
        style="width: 50%; height: 50%"
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
  </div>
</template>

<script>
export default {
  name: "Recognize",
  data() {
    return {
      openCamera: false,
      fps: 30,
      recognition: '',
      withOptions: [0, 1, 2, 3]
    }
  },
  async beforeMount () {
    const self = this
    await self.$store.dispatch('face/getAll')
      .then(() => self.$store.dispatch('face/getFaceMatcher'))
  },
  methods: {
    async fOpenCamera(stateCamere) {
      let self = this
      this.openCamera = stateCamere
      if (this.openCamera) {
        await this.$store.dispatch('camera/startCamera')
          .then((stream) => {
            const videoDiv = document.getElementById("live-video")
            const canvasDiv = document.getElementById("live-canvas")
            const canvasCtx = canvasDiv.getContext("2d")
            videoDiv.srcObject = stream

            // with FPS sampling
            self.interval = setInterval(async () => {
              canvasCtx.drawImage(videoDiv, 0, 0, 320, 247)
              const detections = await self.$store.dispatch('face/getFaceDetections', canvasDiv)
              if (detections.length) {
                detections.map(async item => {
                  // const shifted = item.forSize(canvasDiv.width, canvasDiv.height)
                  // await self.$store.dispatch('face/drawLandmarks', {canvasDiv, landmarks: item.unshiftedLandmarks})
                  const bestMatch = await self.$store.dispatch('face/recognize', item.descriptor)
                  self.recognition = `${bestMatch.toString()}!`
                  // self.recognition = `${bestMatch.toString().substring(0,5)}!`
                  await self.$store.dispatch('face/drawDetection', {
                    canvasDiv,
                    canvasCtx,
                    detection: item.detection,
                    recognition: self.recognition
                  })
                })
              } else {
                self.recognition = ''
              }
            }, self.fps / 1000)
          })
      } else {
        await this.$store.dispatch('camera/stopCamera')
      }
    },
  }
}
</script>

<style scoped>

</style>
