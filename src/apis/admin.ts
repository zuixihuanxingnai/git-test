import request from '@/utils/request'
import type { PageParams, PageResult } from '@/types'

// ---------- 登录 ----------
export function login(data: { username: string; password: string }) {
  return request.post('/user/login', data)
}

export function loginout() {
  return request.post('/user/logout')
}

// ---------- 知识管理 ----------
export function createTree() {
  return request.get('/knowledge/category/tree')
}

export function articlePage(params: PageParams) {
  return request.get('/knowledge/article/page', { params })
}

export function uploadFile(file: File, businessInfo: { id: string }) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('businessType', 'ARTICLE')
  formData.append('businessId', businessInfo.id)
  formData.append('businessField', 'cover')
  return request.post('/file/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export function createArticle(data: any) {
  return request.post('/knowledge/article', data)
}

export function getArticleDetail(id: string) {
  return request.get(`/knowledge/article/${id}`)
}

export function updateArticle(id: string, data: any) {
  return request.put(`/knowledge/article/${id}`, data)
}

export function changeArticleStatus(id: string, data: { status: number }) {
  return request.put(`/knowledge/article/${id}/status`, data)
}

export function deleteArticle(id: string) {
  return request.delete(`/knowledge/article/${id}`)
}

// ---------- 咨询管理 ----------
export function getConsultationsList(params: PageParams) {
  return request.get('/psychological-chat/sessions', { params })
}

export function getSessionDetail(id: string) {
  return request.get(`/psychological-chat/sessions/${id}/messages`)
}
// ---------- 情绪管理 ----------
export function getEmotionsList(params: PageParams) {
  return request.get('/emotion-diary/admin/page', { params })
}

export function deleteEmotion(id: string) {
  return request.delete(`/emotion-diary/admin/${id}`)
}

// ---------- 仪表盘 ----------
export function getAllDetail() {
  return request.get('/data-analytics/overview')
}