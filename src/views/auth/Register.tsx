import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Select, message } from 'antd'
import { register } from '@/apis/fronted'
import '@/styles/auth/register.scss'

const Register = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: any) => {
    if (values.password !== values.confirmPassword) {
      message.error('两次密码不一致')
      return
    }
    setLoading(true)
    try {
      await register(values)
      message.success('注册成功')
      navigate('/auth/login')
    } catch {
      // 错误已由 request 拦截器处理
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="title">
        <div className="title-text">
          <h2>创建您的账户</h2>
          <p>请填写注册信息</p>
        </div>
      </div>

      <div className="form-container">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input size="large" placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item label="邮箱" name="email">
            <Input size="large" placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item label="昵称" name="nickname">
            <Input size="large" placeholder="请输入昵称" />
          </Form.Item>

          <Form.Item label="手机号" name="phone"
            rules={[{ required: true, message: '请输入手机号' }]}
          >
            <Input size="large" placeholder="请输入手机号" 
            />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password size="large" placeholder="请输入密码" />
          </Form.Item>

          <Form.Item
            label="确认密码"
            name="confirmPassword"
            rules={[{ required: true, message: '请确认密码' }]}
          >
            <Input.Password size="large" placeholder="请再次输入密码" />
          </Form.Item>

          <Button
            size="large"
            type="primary"
            htmlType="submit"
            loading={loading}
            block
          >
            注册
          </Button>
        </Form>
      </div>
    </div>
  )
}

export default Register