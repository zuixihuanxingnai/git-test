import { Outlet } from 'react-router-dom'
import robotUrl from '@/assets/images/robot-fill.png'
import '@/styles/auth/index.scss'

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="left-section">
        <div className="content">
          <h2 className="title">心理AI助手</h2>
          <p className="text">
            每个深夜，每个焦虑的时刻，我们都在这里。不必独自承受，让心与心的连接温暖您的每一天
          </p>
          <div className="robot">
            <img src={robotUrl} alt="心理AI助手" style={{ width: 90, height: 90 }} />
          </div>
        </div>
      </div>
      <div className="right-section">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout