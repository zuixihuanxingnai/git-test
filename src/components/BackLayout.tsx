import React, { useState } from 'react';
import {
  PieChartOutlined,
  MessageOutlined,
  UserOutlined,
  BellOutlined,
  RobotFilled,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Button } from 'antd';
import '@/styles/admin/back.scss';
import robot from '@/assets/images/机器人.png';
const { Header, Content,  Sider } = Layout;
import Navbar from './Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
   //getItem('数据统计', '1', <RobotFilled />),
  getItem('数据统计', '/back/dashbord', <PieChartOutlined />),
  getItem('知识文章', '/back/knowledge', <MessageOutlined />),
  getItem('咨询管理', '/back/consultations', <BellOutlined />),
  getItem('情绪日志', '/back/emotions', <UserOutlined />),
  
];

const BackLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
   const navigate = useNavigate()
  const { pathname } = useLocation()
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' ,position:'relative'}} className="back-layout" >
     
     
     
     <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} theme="light" width={264} style={{height:'100%',position:'sticky',top:'0',zIndex:'100'}}>
        
        <div className="brand">
          <img src={robot} alt="机器人" style={{ width: 50, height: 50, marginRight: 30 }} />
          <div  className="info-card" >
          {!collapsed && <h1 className="brand-title">心理健康助手</h1>}
          {!collapsed && <p className="brand-subtitle" style={{ marginLeft: 30 }}>管理后台</p>}
        </div>
        </div>
        <div className="demo-logo-vertical" />
        <Menu theme="light" defaultSelectedKeys={[pathname]} mode="inline" items={items}  onClick={({ key }) => navigate(key)} />
      </Sider>
      <Layout>
        <Header   style={{ padding: 0, background: colorBgContainer ,position:'sticky',top:'0',zIndex:'100'}}>
         <div style={{ display: 'flex', alignItems: 'center' }}><Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
             

              
            }}
          />
          <Navbar /></div>
          
        </Header>
        <Content style={{  margin: '0 16px',
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden', }}>
          <Breadcrumb style={{ margin: '16px 0' }}  />
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default BackLayout