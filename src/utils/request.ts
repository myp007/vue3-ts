/*
 * @Author: m
 * @Date: 2025-03-17 14:49:00
 * @LastEditTime: 2025-03-18 16:34:10
 * @Description: 
 * @FilePath: \h5\yuerbao\src\utils\request.ts
 */
import axios from 'axios'
import { showToast } from 'vant';
import { useUserStore } from '@/store/user'

import configInfo from './config'

// 创建axios实例
const request = axios.create({
  baseURL: configInfo.baseUrl,
  timeout: 10000,
})

// 请求拦截器
request.interceptors.request.use(
  (config:any) => {
    // 从本地获取token
    const token = localStorage.getItem('token')
    config.data = {
      ...config.data,
      gameId:configInfo.gameId,
    }
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    return config
  },
  (error:any) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response:any) => {
    // const router = useRouter()
    const userStore = useUserStore()
    const res = response.data
    // 根据自定义错误码判断请求是否成功
    if (response.status === 200 ) {
      // 成功返回数据
      if(res.code == 1){
        return res.data
      }else if(res.code == 1001 || res.code == 1002){
        userStore.logout()
        localStorage.removeItem('token')
        window.location.href = '/login'
        showToast('请重新登录')
      } else{
        showToast(res.msg || '请求错误')
      }
      
    } else {
      // 显示错误提示
      showToast(res.msg || '请求失败')
      return Promise.reject(new Error(res.msg || '请求失败'))
    }
  },
  (error:any) => {
    // 处理HTTP错误状态码
    let message = ''
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message = '未授权，请重新登录'
          // 如果是token过期，可以在这里清除登录状态并跳转到登录页
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求错误，未找到该资源'
          break
        case 500:
          message = '服务器错误'
          break
        default:
          message = `连接错误 ${error.response.status}`
      }
    } else {
      message = '网络异常，请检查您的网络连接'
    }
    
    showToast(message)
    return Promise.reject(error)
  }
)

export default request 