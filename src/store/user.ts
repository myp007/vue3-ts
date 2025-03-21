import { defineStore } from 'pinia'

interface UserState {
  token: string | null
  userInfo: {
    uid: string
    email: string // 邮箱号
    downloadUrl:string
  } | null
  roleInfo:{
    nickName:string,
    roleId:string,
    avatar:string,
  } | null
  hasBindGameAccount: boolean // 是否已绑定游戏账号
}

export const useUserStore = defineStore('user', {
  state: (): UserState => {
    // 检查localStorage是否有游戏账号绑定信息
    let userInfo = null 
    let roleInfo = null
    let userInfostr = localStorage.getItem('userInfo') || ''
    let roleInfostr =  localStorage.getItem('roleInfo') || ''
    let hasBindGame = false
    // 如果已登录，设置用户信息
    const token = localStorage.getItem('token')
    if (token) {
      userInfo =JSON.parse(userInfostr)
      roleInfo = JSON.parse(roleInfostr)
      // 如果有绑定游戏账号，添加到用户信息中
      if ( roleInfo) {
        hasBindGame = roleInfo.roleId ? true : false
      }
    }
    return {
      token,
      userInfo,
      roleInfo,
      hasBindGameAccount: hasBindGame
    }
  },
  
  actions: {
    // 设置token
    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
    },
    
    // 设置用户信息
    setUserInfo(userInfo: UserState['userInfo']) {
      this.userInfo = userInfo

      if(userInfo)
      localStorage.setItem('userInfo',JSON.stringify(userInfo) )
    },
    setRoleInfo(roleInfo: UserState['roleInfo']) {
      this.roleInfo = roleInfo
      // 如果有游戏账号信息，设置绑定状态
      if (roleInfo) {
        this.hasBindGameAccount = roleInfo.roleId ? true : false
        localStorage.setItem('roleInfo', JSON.stringify(roleInfo))
      }
    },
    // 绑定游戏账号
    bindGameAccount(gameAccount: { roleId: string; nickName: string;avatar:string }) {
      if (gameAccount) {
        this.roleInfo = {
          ...gameAccount,
        }
        
        this.hasBindGameAccount = gameAccount.roleId ? true : false
        localStorage.setItem('roleInfo', JSON.stringify(gameAccount))
      }
    },
    
    // 解绑游戏账号
    unbindGameAccount() {
      if (this.roleInfo) {
        this.roleInfo = null
        this.hasBindGameAccount = false
      }
    },
    
    // 退出登录
    logout() {
      this.token = null
      this.userInfo = null
      this.hasBindGameAccount = false
      localStorage.removeItem('token')
    }
  },
  
  getters: {
    // 是否已登录
    isLoggedIn: (state) => !!state.token,
    // 获取用户信息
    getUserInfo: (state) => state.userInfo
  }
}) 