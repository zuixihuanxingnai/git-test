import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Dropdown, Avatar, Modal, message } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined } from '@ant-design/icons'


import { loginout } from '@/apis/admin'
import avatarImg from '@/assets/images/li.jpg'
import '@/styles/admin/navbar.scss'
// 页面标题映射 — 对应 Vue 路由 meta.title
const titleMap: Record<string, string> = {
  '/back/dashbord': '数据统计',
  '/back/knowledge': '知识文章',
  '/back/consultations': '咨询管理',
  '/back/emotions': '情绪日志',
}

const Navbar = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
 
  const title = titleMap[pathname] || '后台管理'

  const handleLogout = () => {
    Modal.confirm({
      title: '提示',
      content: '确定退出登录吗？',
      onOk: async () => {
        await loginout()
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        navigate('/auth/login')
      },
    })
  }

  return (
    <div className="navbar">
      <div className="flex-box">
        <p className="page-title">{title}</p>
      </div>

      <div className="navbar-right">
        <Dropdown
          menu={{
            items: [{ key: 'logout', icon: <LogoutOutlined />, label: '退出登录' }],
            onClick: ({ key }) => key === 'logout' && handleLogout(),
          }}
        >
          <div className="user-trigger">
            <Avatar size="small" src={avatarImg} />
            <span className="user-name">李家满</span>
          </div>
        </Dropdown>
      </div>
    </div>
  )
}

export default Navbar