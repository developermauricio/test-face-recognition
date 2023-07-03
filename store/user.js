export const state = () => ({
  user: {
    name: '',
    photos: []
  }

})

export const mutations = {
  addPhotos(state, data) {
    if (data) {
      state.user.photos.push(data)
    }
  },
  addName(state, data) {
    if (data) {
      console.log(data)
      state.user.name = data
    }
  },
}

export const actions = {
  async uploadBase64({commit}, upload) {
    commit('addPhotos', upload)
  },
  async addNameUser({commit}, name){
    commit('addName', name)
  }
}
