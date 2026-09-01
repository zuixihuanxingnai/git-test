import request from '@/utils/request'
import type { PageParams, PageResult } from '@/types'

// ---------- 用户 ----------
export function register(data: { username: string; password: string }) {
  return request.post('/user/add', data)
}

// ---------- AI 对话 ----------
export interface SessionData {
  sessionId: string
  status: string
  sessionTitle: string
}

export function startConversation(data: { initialMessage: string; sessionTitle?: string }) {
  return request.post<SessionData>('/psychological-chat/session/start', data)
}

export function getSessionList(params: PageParams) {
  return request.get<PageResult<SessionData>>('/psychological-chat/sessions', { params })
}

export function deleteSession(sessionId: string) {
  return request.delete(`/psychological-chat/sessions/${sessionId}`)
}

export function getSessionDetail(sessionId: string) {
  return request.get(`/psychological-chat/sessions/${sessionId}/messages`)
}

export function getEmotionAnalysis(sessionId: string) {
  return request.get(`/psychological-chat/session/${sessionId}/emotion`)
}

// ---------- 情绪日记 ----------
export function addEmotionDiary(data: { moodScore: number; content: string }) {
  return request.post('/emotion-diary', data)
}

// ---------- 知识库 ----------
export function getKnowledgeList(params: PageParams) {
  return request.get('/knowledge/article/page', { params })
}

export function getKnowledgeDetail(id: string) {
  return request.get(`/knowledge/article/${id}`)
}