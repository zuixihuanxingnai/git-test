import { Form, Input, Select, Button, Row, Col } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'

interface FormField {
  comp: 'input' | 'select'
  label: string
  prop: string
  placeholder: string
  options?: { label: string; value: number | string }[]
}

interface Props {
  formItem: FormField[]
  onSearch: (values: Record<string, any>) => void
}

const TabSearch = ({ formItem, onSearch }: Props) => {
  const [form] = Form.useForm()

  const handleSearch = () => {
    onSearch(form.getFieldsValue())
  }

  const handleReset = () => {
    form.resetFields()
    onSearch({})
  }

  return (
    <Form form={form} layout="inline">
      <Row gutter={24} style={{ width: '100%' }}>
        {formItem.map((item) => (
          <Col xs={24} sm={12} md={8} lg={6} xl={6} key={item.prop}>
            <Form.Item label={item.label} name={item.prop} style={{ width: '100%' }}>
              {item.comp === 'input' ? (
                <Input placeholder={item.placeholder} />
              ) : (
                <Select placeholder={item.placeholder} options={item.options} allowClear />
              )}
            </Form.Item>
          </Col>
        ))}
        <Col>
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            查询
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset} style={{ marginLeft: 8 }}>
            重置
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

export default TabSearch