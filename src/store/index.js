import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
Vue.use(Vuex);
const debug = process.env.NODE_ENV !== 'production';
const store = new Vuex.Store({
  state: {
    nodeId: '',
    administrativeId: ''
  },
  mutations: {
    // 考点数据
    SET_EXAM_NODE_ID: (state, code) => {
      state.nodeId = code;
    },
    // 考点数据
    SET_EXAM_ADMINISTRATIVE_ID: (state, code) => {
      state.administrativeId = code;
    }
  },
  actions: {

  },
  getters: {
    nodeId: state => state.nodeId,
    administrativeId: state => state.administrativeId,
    area: state => state.nodeId + state.administrativeId
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
});

export default store;
