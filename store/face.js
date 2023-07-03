import * as faceapi from 'face-api.js'

export const state = () => ({
  loading: false,
  loaded: false,
  faces: [],
  faceMatcher: null,
  detections: {
    scoreThreshold: 0.5,
    inputSize: 320,
    boxColor: 'blue',
    textColor: 'red',
    lineWidth: 1,
    fontSize: 20,
    fontStyle: 'Georgia'
  },
  descriptors: {
    withDistance: false
  },
  recognizeOptions: {
    useTiny: true
  }
})

export const mutations = {
  loading(state) {
    state.loading = true
  },
  load(state) {
    state.loading = false
    state.loaded = true
  },
  setFaces(state, faces) {
    state.faces = faces
  },
  setFaceMatcher(state, matcher) {
    state.faceMatcher = matcher
  }
}

export const actions = {
  async getAll({commit, state}) {
    const data = await this.$axios.$get('/api/get-faces-all')
    commit('setFaces', data)
  },
  getFaceMatcher({commit, state}) {
    const labeledDescriptors = []
    state.faces.forEach((face) => {
      const descriptors = face.descriptors.map((desc) => {
        if (desc.descriptor) {
          const descArray = []
          for (const i in desc.descriptor) {
            descArray.push(parseFloat(desc.descriptor[i]))
          }
          return new Float32Array(descArray)
        }
      })
      if (descriptors.length) {
        labeledDescriptors.push(
          new faceapi.LabeledFaceDescriptors(
            face.user,
            descriptors
          ))
      }
    })
    const matcher = new faceapi.FaceMatcher(labeledDescriptors)
    commit('setFaceMatcher', matcher)
    console.log('MATCHER ', matcher)
    return matcher
  },
  async getFaceDetections({commit, state}, canvasDiv) {
    // console.log(canvasDiv)
    let detections = await faceapi
      .detectAllFaces(canvasDiv, new faceapi.TinyFaceDetectorOptions({inputSize: 416, scoreThreshold: 0.4}))
      .withFaceLandmarks(state.recognizeOptions.useTiny)
      .withFaceDescriptors()
    // console.log(detections)
    return detections
  },

  async recognize({commit, state}, faceDescriptor) {
    const bestMatch = await state.faceMatcher.findBestMatch(faceDescriptor)
    return bestMatch
  },

  drawLandmarks({commit, state}, {canvasDiv, landmarks}) {
    // faceapi.draw.drawFaceLandmarks()
    faceapi.draw.drawFaceLandmarks(canvasDiv, landmarks, {drawLines: true})
  },

  drawDetection({commit, state}, {canvasDiv, canvasCtx, detection, recognition}) {

    if (recognition.includes('unknown')) {
      name = 'No existe'
    }else{
      name = recognition.toString(state.descriptors.withDistance)
    }

    console.log('NAME ', name)
    const box = detection.box || detection.detection.box
    // draw box
    canvasCtx.strokeStyle = state.detections.boxColor
    canvasCtx.lineWidth = state.detections.lineWidth
    canvasCtx.strokeRect(box.x, box.y, box.width, box.height)

    // draw text
    const padText = 2 + state.detections.lineWidth
    canvasCtx.fillStyle = state.detections.textColor
    canvasCtx.font = state.detections.fontSize + 'px ' + state.detections.fontStyle
    canvasCtx.fillText(name, box.x + padText, box.y + box.height + padText + (state.detections.fontSize * 0.6))
    // const boxesWithText = [
    //   new faceapi.Box(new faceapi.Rect(detection.box.x, detection.box.y, detection.box.width, detection.box.height), recognition)
    // ]
    // faceapi.draw.drawDetections(canvasDiv, boxesWithText)
  },

  async saveFaces({commit}, faces) {
    const {data} = await this.$axios.post('api/face-save', faces)
    commit('setFaces', data)
  },

  async load({commit, state}) {
    if (!state.loading && !state.loaded) {
      commit('loading')
      return Promise.all([
        faceapi.loadFaceRecognitionModel('/data/models'),
        faceapi.loadFaceLandmarkTinyModel('/data/models'),
        faceapi.loadTinyFaceDetectorModel('/data/models')
      ])
        .then(() => {
          commit('load')
        })
    }
  }
}
