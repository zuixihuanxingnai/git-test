import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Input, Button, message, App } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { login } from '@/apis/admin'
import '@/styles/auth/login.scss'

const Login = () => {
  const [form]=Form.useForm()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true)
    try {
      const data = await login(values)
      if (!data.token) {
        message.error('登录失败')
        return
      }
      localStorage.setItem('token', data.token)
      localStorage.setItem('userInfo', JSON.stringify(data.userInfo))

      if (data.userInfo.userType === 2) {
        navigate('/back/dashbord')
      } else {
        navigate('/')
      }
    } catch {
      // 错误已在 request 拦截器里处理
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="title">
        <div className="back-home" onClick={() => navigate('/')}>
          <ArrowLeftOutlined />
          <span>返回首页</span>
        </div>
        <div className="title-text">
          <h2>登录您的账户</h2>
          <p>请输入您的登录信息</p>
        </div>
      </div>

      <div className="form-container">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="用户名或邮箱"
            name="username"
            rules={[{ required: true, message: '请输入用户名或邮箱' }]}
          >
            <Input size="large" placeholder="请输入用户名或邮箱" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password size="large" placeholder="请输入密码" />
          </Form.Item>

          <Button
            className="btn"
            size="large"
            type="primary"
            htmlType="submit"
            loading={loading}
            block
          >
            登录
          </Button>
        </Form>

        <div className="footer">
          <p>还没有账号？<Link to="/auth/register">去注册</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Login