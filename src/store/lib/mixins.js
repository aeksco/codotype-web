import _ from 'lodash'

// // // //
// Adds a Collection to a Vuex module

export const COLLECTION_GETTERS = {
  collection: state => {
    return state.collection
  },
  fetching: state => {
    return state.fetching
  }
}

export const COLLECTION_MUTATIONS = {
  collection (state, collection) {
    state.collection = collection
  },
  fetching (state, isFetching) {
    state.fetching = isFetching
  }
}

export const COLLECTION_STATE = {
  collection: [],
  fetching: false
}

// // // //
// Adds a SelectedModel definition to a Vuex module

export const SELECT_MODEL_ACTIONS = {
  selectModel: ({ commit, state }, model_id) => {
    let model = _.find(state.collection, { _id: model_id })
    commit('selectedModel', model)
  },
  clearSelected: ({ commit }) => {
    commit('selectedModel', {})
  }
}

export const SELECT_MODEL_GETTERS = {
  selectedModel: state => {
    return state.selectedModel
  }
}

export const SELECT_MODEL_MUTATIONS = {
  selectedModel (state, model) {
    state.selectedModel = model
  }
}

export const SELECT_MODEL_STATE = {
  selectedModel: {}
}

// // // //
// NEW_MODEL mixins

export const NEW_MODEL_ACTIONS = {
  resetNewModel: ({ commit }) => {
    return commit('newModel', {})
  }
}

export const NEW_MODEL_GETTERS = {
  newModel: state => {
    return state.newModel
  }
}

export const NEW_MODEL_MUTATIONS = {
  newModel (state, newModel) {
    state.newModel = newModel
  }
}

export const NEW_MODEL_STATE = {
  newModel: {}
}
