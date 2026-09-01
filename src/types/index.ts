// API 响应类型
export interface ApiResponse<T = any> {
  code: string
  msg: string
  data: T
}

// 分页参数
export interface PageParams {
  currentPage: number
  size: number
}

// 分页结果
export interface PageResult<T> {
  records: T[]
  total: number
  size: number
  current: number
}

// 用户信息
export interface UserInfo {
  id: number
  username: string
  userType: 1 | 2  // 1=普通用户, 2=管理员
  avatar?: string
}