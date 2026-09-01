import { useEffect, useState } from 'react'
import { Table, Button, Tag, Modal, message } from 'antd'
import PageHeade from '@/components/PageHeade'
import TabSearch from '@/components/TabSearch'
import ArticleDialog from '@/components/ArticleDialog'
import { articlePage, createTree, changeArticleStatus, deleteArticle, getArticleDetail } from '@/apis/admin'
import type { ColumnsType } from 'antd/es/table'

const Knowledge = () => {
  const [list, setList] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 })
  const [categories, setCategories] = useState<{ label: string; value: number }[]>([])
  const [categoryMap, setCategoryMap] = useState<Record<number, string>>({})
  const [visible, setVisible] = useState(false)
  const [currentArticle, setCurrentArticle] = useState<any>({})
  const [searchParams, setSearchParams] = useState<any>({})

  useEffect(() => {
    createTree().then((res: any) => {
      const map: Record<number, string> = {}
      const opts = res.map((item) => { 
        map[item.id] = item.categoryName
        return { label: item.categoryName, value: item.id }
      })
      setCategories(opts)
      setCategoryMap(map)
      fetchList({})
    })
  }, [])

  const fetchList = async (extraParams: any = {}) => {
 
    setLoading(true)
  // 优先用传入的pageNum/pageSize，兜底当前分页state
  const currentPage = extraParams.pageNum ?? pagination.current
  const pageSize = extraParams.pageSize ?? pagination.pageSize
  console.log(currentPage, pageSize)
  const query = { 
     currentPage, 
     size: pageSize, 
    ...searchParams, 
    ...extraParams 
  }
  console.log(query)
  const res = await articlePage(query)
console.log('API 响应:', res)
const { records, total } = res
  setList([...records])
  console.log(records)
  setPagination(p => ({ ...p, total }))
  setLoading(false)
}

  const handleEdit = async (row?: any) => {
    if (row?.id) {
      const detail = await getArticleDetail(row.id)
      setCurrentArticle(detail)
    } else {
      setCurrentArticle({})
    }
    setVisible(true)
  }

  const handleStatus = (row: any, status: number) => {
    const action = status === 1 ? '发布' : '下线'
    Modal.confirm({
      title: `确认${action}文章 ${row.title} 吗？`,
      onOk: async () => {
        await changeArticleStatus(row.id, { status })
        message.success(`${action}成功`)
        fetchList()
      },
    })
  }

  const handleDelete = (row: any) => {
    Modal.confirm({
      title: `确认删除文章 ${row.title} 吗？`,
      okType: 'danger',
      onOk: async () => {
        await deleteArticle(row.id)
        message.success('删除成功')
        fetchList()
      },
    })
  }

  const searchFields = [
    { comp: 'input' as const, label: '文章标题', prop: 'title', placeholder: '请输入文章标题' },
    {
      comp: 'select' as const, label: '文章分类', prop: 'categoryId', placeholder: '请选择文章分类',
      options: categories,
    },
    {
      comp: 'select' as const, label: '状态', prop: 'status', placeholder: '请选择状态',
      options: [{ label: '草稿', value: 0 }, { label: '已发布', value: 1 }, { label: '已删除', value: 2 }],
    },
  ]

  const columns: ColumnsType<any> = [
    { title: '文章标题', dataIndex: 'title', width: 200, fixed: 'left' },
    { title: '文章分类', width: 150, render: (_, r) => categoryMap[r.categoryId] || '-' },
    { title: '作者', dataIndex: 'authorName', width: 120 },
    { title: '阅读量', dataIndex: 'readCount', width: 100 },
    { title: '发布时间', dataIndex: 'createdAt', width: 180 },
    {
      title: '状态', dataIndex: 'status', width: 100,
      render: (s: number) => {
        const map: Record<number, { color: string; text: string }> = {
          0: { color: 'yellow', text: '草稿' },
          1: { color: 'green', text: '已发布' },
          2: { color: 'red', text: '已删除' },
        }
        return <Tag color={map[s]?.color}>{map[s]?.text}</Tag>
      },
    },
    {
      title: '操作', fixed: 'right', width: 280,
      render: (_, r) => (
        <>
          <Button type="link" onClick={() => handleEdit(r)}>编辑</Button>
          {(r.status === 0 || r.status === 2) && (
            <Button type="link" onClick={() => handleStatus(r, 1)}>发布</Button>
          )}
          {r.status === 1 && (
            <Button type="link" onClick={() => handleStatus(r, 0)}>下线</Button>
          )}
          <Button type="link" danger onClick={() => handleDelete(r)}>删除</Button>
        </>
      ),
    },
  ]

  return (
    <div className="knowledge-container">
      <PageHeade title="知识文章">
        <Button type="primary" onClick={() => handleEdit()}>新增</Button>
      </PageHeade>
      <TabSearch formItem={searchFields} onSearch={(v) => { setSearchParams(v); setPagination(p => ({...p, current: 1})); fetchList({ ...v, pageNum: 1 }) }} />
      <Table
        dataSource={list}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => { setPagination((p) => ({ ...p, current: page })); 
            fetchList({ pageNum: page, pageSize });
          },
          showSizeChanger: false
        }}
        scroll={{ x: 1200 }}
        style={{ marginTop: 25 }}
      />
      <ArticleDialog
        visible={visible}
        onClose={() => setVisible(false)}
        onSuccess={() => fetchList()}
        categories={categories}
        currentArticle={currentArticle}
      />
    </div>
  )
}

export default Knowledge