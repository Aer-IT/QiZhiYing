const state = {
    userInfo: {
        avatarUrl: '',
        nickName: '',
        mobile: '',
        gender: 0,
        history: [],
        reserveInfo: [],
        _id:'',
        points:0
    }
}

const mutations = {
    // 更新用户信息
    UPDATE_USER_INFO(state, payload) {
        state.userInfo = {
            ...state.userInfo,
            ...payload
        }
    },
    
   
}

const actions = {
    // 更新用户信息
    updateUserInfo({ commit }, payload) {
        commit('UPDATE_USER_INFO', payload)
    },
    // 退出登录
    logout({ commit }) {
        commit('CLEAR_USER_INFO')
    }
}

const getters = {
    userInfo: state => state.userInfo,
    isLogin: state => !!state.userInfo.nickName
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
} 