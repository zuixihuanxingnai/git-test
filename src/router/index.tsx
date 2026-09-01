import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Spin } from 'antd'

const FrontedLayout = lazy(() => import('@/components/FrontedLayout'))
const BackLayout = lazy(() => import('@/components/BackLayout'))
const AuthLayout = lazy(() => import('@/components/AuthLayout'))
const Home = lazy(() => import('@/views/front/Home'))
const FrontConsultations = lazy(() => import('@/views/front/Consultations'))
const FrontEmotion = lazy(() => import('@/views/front/Emotion'))
const FrontKnowledge = lazy(() => import('@/views/front/Knowledge'))
const ArticleDetail = lazy(() => import('@/views/front/ArticleDetail'))
const Dashboard = lazy(() => import('@/views/admin/Dashboard'))
const KnowledgeManage = lazy(() => import('@/views/admin/Knowledge'))
const ConsultationsManage = lazy(() => import('@/views/admin/Consultations'))
const EmotionsManage = lazy(() => import('@/views/admin/Emotions'))
const Login = lazy(() => import('@/views/auth/Login'))
const Register = lazy(() => import('@/views/auth/Register'))

// 包裹函数：给懒加载组件加 Suspense
const Lazy = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<Spin style={{ display: 'block', margin: '200px auto' }} />}>
    {children}
  </Suspense>
)

const router = createBrowserRouter([
  {
    path: '/back',
    element: <Lazy><BackLayout /></Lazy>,          // ← 加了 Lazy
    children: [
      { index: true, element: <Navigate to="/back/dashbord" replace /> },
      { path: 'dashbord', element: <Lazy><Dashboard /></Lazy> },
      { path: 'knowledge', element: <Lazy><KnowledgeManage /></Lazy> },
      { path: 'consultations', element: <Lazy><ConsultationsManage /></Lazy> },
      { path: 'emotions', element: <Lazy><EmotionsManage /></Lazy> },
    ],
  },
  {
    path: '/auth',
    element: <Lazy><AuthLayout /></Lazy>,
    children: [
      { index: true, element: <Navigate to="/auth/login" replace /> },
      { path: 'login', element: <Lazy><Login /></Lazy> },
      { path: 'register', element: <Lazy><Register /></Lazy> },
    ],
  },
  {
    path: '/',
    element: <Lazy><FrontedLayout /></Lazy>,
    children: [
      { index: true, element: <Lazy><Home /></Lazy> },
      { path: 'consultation', element: <Lazy><FrontConsultations /></Lazy> },
      { path: 'emotion-diary', element: <Lazy><FrontEmotion /></Lazy> },
      { path: 'knowledge', element: <Lazy><FrontKnowledge /></Lazy> },
      { path: 'knowledge/article/:id', element: <Lazy><ArticleDetail /></Lazy> },
    ],
  },
])

export default router