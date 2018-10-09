import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  headers: {
    headers: {
      'Content-Type': 'application/json'
    }
  }
}

const createStore = () => new Vuex.Store({
  state
})

export default createStore