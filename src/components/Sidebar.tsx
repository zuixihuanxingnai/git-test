import { useNavigate, useLocation } from 'react-router-dom'
import { Menu } from 'antd'
import { PieChartOutlined, WechatOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons'
import { useAdminStore } from '@/store/adminStore'
import robotIcon from '@/assets/images/机器人.png'
import '@/styles/admin/sidebar.scss'

// 菜单配置 — 对应 Vue 路由里 back children 的 meta
const menuItems = [
  { key: '/back/dashbord', icon: <PieChartOutlined />, label: '数据统计' },
  { key: '/back/knowledge', icon: <WechatOutlined />, label: '知识文章' },
  { key: '/back/consultations', icon: <MessageOutlined />, label: '咨询管理' },
  { key: '/back/emotions', icon: <UserOutlined />, label: '情绪日志' },
]

const Sidebar = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isCollapse = useAdminStore((s) => s.isCollapse)

  return (
    <div style={{ width: isCollapse ? 80 : 260, transition: 'width 0.3s' ,height:'100%',position:'fixed'}}>
      <Menu
        mode="inline"
        inlineCollapsed={isCollapse}
        selectedKeys={[pathname.startsWith('/back/') ? pathname : '/back/dashbord']}
        onClick={({ key }) => navigate(key)}
        items={menuItems}
        style={{ height: '100%' }}
      />
      {/* 折叠时隐藏 logo 标题 */}
      {isCollapse ? (
        <div style={{ textAlign: 'center', padding: '12px 0' }}>
          <img src={robotIcon} alt="logo" style={{ width: 40, height: 40 }} />
        </div>
      ) : (
        <div className="brand">
          <img src={robotIcon} alt="logo" className="brand-img" />
          <div className="brand-info">
            <h1>心理健康助手</h1>
            <p>管理后台</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar