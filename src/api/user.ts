import request from '@/utils/request'

interface LoginParams {
  email: string;
  password: string;
}

// 登录接口
export function passwordLogin(data: LoginParams) {
  return request({
    url: '/shop/passwordLogin',
    method: 'post',
    data
  })
}
export function login(data: {
  email: string; 
  code:string
}) {
  return request({
    url: '/shop/login',
    method: 'post',
    data
  })
}
// 发送验证码
export function sendVerifyCode(data: {
  email: string; 
  method:string
}) {
  return request({
    url: '/shop/user/sendEmailCode',
    method: 'post',
    data
  })
}

// 注册接口
export function register(data: { 
  email: string; 
  password: string; 
  confirmPassword: string;
  code: string;
}) {
  return request({
    url: '/shop/register',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/shop/user/userInfo',
    method: 'post'
  })
}
export function updatePwd(data: { 
  password: string; 
}) {
  return request({
    url: '/shop/user/alertPassword',
    method: 'post',
    data
  })
}
export function getGoodsList(data: { 
  page: number; 
  pageSize:number;
}) {
  return request({
    url: '/shop/goods/goodsList',
    method: 'get',
    params:data
  })
}
// 退出登录
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
} 