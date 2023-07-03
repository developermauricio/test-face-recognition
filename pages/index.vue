<template>
  <div class="container mt-5">
    <div class="row">
      <!-- Video Evento -->
      <div class="col-12 col-lg-8 col-md-8">
        <button @click="train" class="btn btn-primary btn-sm">Entrenar</button>
      </div>
      <!-- Usuarios -->
      <div class="col-12 col-lg-4 col-md-4">
        <Users/>
      </div>
    </div>

    <!-- VIDEO CAMARA DETECTAR-->
    <Recognize/>
    <!-- Usuarios para entrenar-->
<!--    <div v-show="true">-->
<!--      <div v-for="user in users" :key="user.name">-->
<!--        <div v-for="(photo, index) in photoF(user.images_face)" :key="index">-->
<!--&lt;!&ndash;          {{ $config.urlDigitalOcean + photo }}&ndash;&gt;-->
<!--&lt;!&ndash;                    <img :id="user.name + index" :src="$config.urlDigitalOcean + photo" crossOrigin='anonymous'>&ndash;&gt;-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      users: [],
      faces: []
    }
  },
  methods: {
    photoF(photo) {
      return JSON.parse(photo)
    },
    async train() {
      const self = this

      await Promise.all(self.users.map(async (user) => {
        let photos = JSON.parse(user.images_face)
        const descriptors = []
        await Promise.all(photos.map(async (photo, index) => {
          const photoId = `${user.name}${index}`;
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = this.$config.urlDigitalOcean + photo;
          img.id = photoId
          img.width = 320;
          // img.height = 224;

          // const img = document.getElementById(photoId)
          const detections = await self.$store.dispatch('face/getFaceDetections', img)
          detections.forEach(d => {
            descriptors.push({
              path: photo,
              descriptor: d.descriptor
            })
          })
        }))

        self.faces.push({
          user: user.name,
          descriptors: descriptors
        })
      }))
      console.log('FACES ',self.faces)
      await self.$store.dispatch('face/saveFaces', self.faces)
        .catch(e => {
          console.error(e)
        })
    },
    getUsers() {
      this.$axios.get('api/get-users').then(resp => {
        this.users = resp.data.data
      }).catch(e => {
        console.log(e)
      })
    },
  },

  async mounted() {
    let self = this
    await self.$store.dispatch('face/load')
    this.getUsers()
  }
}
</script>
