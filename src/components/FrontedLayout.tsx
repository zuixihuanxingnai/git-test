import { useState, useEffect } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Button, message, Modal } from 'antd'
import { loginout } from '@/apis/admin'
import robotUrl from '@/assets/images/机器人.png'
import '@/styles/front/FrontedLayout.scss'

const FrontedLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) setIsLoggedIn(true)
  }, [])

  const logout = () => {
    Modal.confirm({
      title: '提示',
      content: '确定退出登录吗？',
      onOk: async () => {
        await loginout()
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        message.success('退出登录成功')
        setIsLoggedIn(false)
        navigate('/auth/login')
      },
    })
  }

  return (
    <div className="frontend-layout">
      <div className="navbar-container">
        <div className="brand-section">
          <img src={robotUrl} alt="logo" className="brand-logo" />
          <h1 className="brand-name">AI心理健康助手</h1>
        </div>
        <div className="nav-section">
          <Link to="/" className="nav-link">首页</Link>
          {isLoggedIn && <Link to="/consultation" className="nav-link">AI咨询</Link>}
          {isLoggedIn && <Link to="/emotion-diary" className="nav-link">情绪日记</Link>}   
          <Link to="/knowledge" className="nav-link">知识库</Link>
          {isLoggedIn ? (
            <Button className="logout-btn" onClick={logout}>退出登录</Button>
          ) : (
            <>
              <Link to="/auth/login" className="nav-link">登录</Link>
              <Link to="/auth/register">
                <Button type="primary">注册</Button>
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="main-content">
        <Outlet />   {/* ← 子页面出口，等于 Vue 的 <router-view> */}
      </div>
      <div className="footer-container">
        <div className="footer-bottom">
          <p>&copy; 2026 AI心理健康助手. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default FrontedLayout