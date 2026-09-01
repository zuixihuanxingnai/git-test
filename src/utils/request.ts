import axios from 'axios'
import { message } from 'antd'

const request = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

// 请求拦截器 — 加 token
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['token'] = token
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器 — 统一处理返回值
request.interceptors.response.use(
  (response) => {
    const { data, config } = response
    if (data.code === '200') {
      return data.data  // 只返回 data 层，跟 Vue 版一致
    }
    // code 不为 200 的处理
    if (data.code === '-1') {
      if (!config.url?.includes('/login')) {
        message.error(data.msg || '登录过期，请重新登录')
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        window.location.href = '/auth/login'
      }
    }
    message.error(data.msg || '请求失败')
    return Promise.reject(data.msg || '网络错误')
  },
  (error) => Promise.reject(error)
)

export default request