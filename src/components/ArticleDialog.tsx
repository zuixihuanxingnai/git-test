import { useState, useEffect } from 'react'
import { Modal, Form, Input, Select, Button, Upload, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { uploadFile, createArticle, updateArticle } from '@/apis/admin'
import { fileBaseUrl } from '@/config'
import RichTextEditor from './RichTextEditor'
import type { UploadFile, UploadProps } from 'antd'

interface Props {
  visible: boolean
  onClose: () => void
  onSuccess: () => void
  categories: { label: string; value: number }[]
  currentArticle: any
}

const ArticleDialog = ({ visible, onClose, onSuccess, categories, currentArticle }: Props) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [editorContent, setEditorContent] = useState('')
  const [businessId, setBusinessId] = useState<string | null>(null)

  const isEdit = !!currentArticle?.id

  // 编辑时回填数据
  useEffect(() => {
    if (currentArticle?.id) {
      form.setFieldsValue(currentArticle)
      setEditorContent(currentArticle.content || '')
      setBusinessId(currentArticle.id)
      if (currentArticle.coverImage) {
        setImageUrl(`${fileBaseUrl}${currentArticle.coverImage}`)
      }
    } else {
      form.resetFields()
      setEditorContent('')
      setImageUrl('')
      setBusinessId(null)
    }
  }, [currentArticle, visible])

  // 图片上传
  const handleUpload = async (options: any) => {
    const { file } = options
    const isImage = file.type?.startsWith('image/')
    const isLt5M = file.size / 1024 / 1024 < 5
    if (!isImage) { message.error('只能上传图片'); return }
    if (!isLt5M) { message.error('图片不能超过5MB'); return }

    const id = crypto.randomUUID()
    setBusinessId(id)
    const res = await uploadFile(file, { id })
    console.log(res)
    const url = `${fileBaseUrl}${res.filePath}`
    setImageUrl(url)
    form.setFieldValue('coverImage', res.filePath)
  }

  // 提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      const submitData = { ...values, content: editorContent }
      if (isEdit) {
        await updateArticle(businessId!, submitData)
      } else {
        submitData.id = businessId
        await createArticle(submitData)
      }
      message.success(isEdit ? '更新成功' : '创建成功')
      onSuccess()
      onClose()
    } catch {
      // 校验失败不处理
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={isEdit ? '编辑文章' : '新增文章'}
      open={visible}
      onCancel={onClose}
      width="50%"
      footer={[
        <Button key="cancel" onClick={onClose}>取消</Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          {isEdit ? '更新' : '提交'}
        </Button>,
      ]}
     
    >
      <Form form={form} layout="vertical">
        <Form.Item label="文章标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
          <Input placeholder="请输入文章标题" maxLength={200} showCount />
        </Form.Item>
        <Form.Item label="文章分类" name="categoryId" rules={[{ required: true, message: '请选择分类' }]}>
          <Select placeholder="请选择文章分类" options={categories} />
        </Form.Item>
        <Form.Item label="文章摘要" name="summary">
          <Input.TextArea placeholder="请输入文章摘要" maxLength={1000} rows={4} />
        </Form.Item>
        <Form.Item label="标签" name="tags">
          <Input placeholder="请输入标签,多个用逗号分隔" />
        </Form.Item>
        <Form.Item label="封面图片">
          <div>
            <Upload
              listType="picture-card"
              showUploadList={false}
              customRequest={handleUpload}
              accept="image/*"
            >
              {imageUrl ? (
                <img src={imageUrl} alt="封面" style={{ width: '100%' }} />
              ) : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传</div>
                </div>
              )}
            </Upload>
            {imageUrl && (
              <Button
                type="link"
                danger
                onClick={() => {
                  setImageUrl('')
                  form.setFieldValue('coverImage', '')
                }}
              >
                移除封面
              </Button>
            )}
          </div>
        </Form.Item>
        <Form.Item label="文章内容">
          <RichTextEditor value={editorContent} onChange={setEditorContent} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ArticleDialog