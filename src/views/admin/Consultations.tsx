import { useEffect, useState } from 'react'
import { Table, Button, Modal, Avatar, Spin } from 'antd'
import PageHeade from '@/components/PageHeade'
import { getConsultationsList, getSessionDetail } from '@/apis/admin'
import type { ColumnsType } from 'antd/es/table'
import '@/styles/admin/consultation.scss'

const Consultations = () => {
  const [list, setList] = useState<any[]>([])
  const [pagination, setPagination] = useState({  current:1, pageSize:5,total:0 })

  useEffect(() => { fetchList() }, [])

  const fetchList = (params: PageParams) => {
    getConsultationsList(params).then((res: any) => {
     console.log(res)
      setList(res.records)
      setPagination((p) => ({ ...p, total: res.total, current: res.current, pageSize: 5 }))
    })
  }

  // 详情弹窗
  const [detailVisible, setDetailVisible] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [detail, setDetail] = useState<any>({})
  const [msgLoading, setMsgLoading] = useState(false)

  const viewDetail = (row: any) => {
    setDetailVisible(true)
    setMsgLoading(true)
    setDetail(row)
    getSessionDetail(row.id).then((res: any) => {
      setMessages(res)
      setMsgLoading(false)
    })
  }

  const columns: ColumnsType<any> = [
    {
      title: '会话ID', width: 200,
      render: (_, r) => <><Avatar>{r.userNickname}</Avatar> <span style={{ marginLeft: 8 }}>{r.userNickname}</span></>,
    },
    {
      title: '情绪日志',
      render: (_, r) => (
        <>
          <div className="session-title">{r.sessionTitle}</div>
          <div className="session-preview">{r.lastMessageContent}</div>
        </>
      ),
    },
    { title: '消息数', dataIndex: 'messageCount', width: 100 },
    { title: '时间', dataIndex: 'startedAt', width: 180 },
    {
      title: '操作', width: 100,
      render: (_, r) => <Button type="link" onClick={() => viewDetail(r)}>详情</Button>,
    },
  ]

  return (
    <div>
      <PageHeade title="咨询管理" />
      <Table
        dataSource={list}
        columns={columns}
        rowKey="id"
        pagination={{
          ...pagination,
          onChange: (page) => { setPagination((p) => ({ ...p, current: page ,pageSize: pagination.pageSize})); fetchList(
            { currentPage: page, size: pagination.pageSize }
          ) },
        }}
      />
      <Modal
        title="咨询会话详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width="70%"
        footer={<Button type="primary" onClick={() => setDetailVisible(false)}>关闭</Button>}
      >
        <div className="session-detail">
          <div className="detail-header">
            <div className="detail-row"><span className="detail-label">用户:</span><span className="detail-value">{detail.userNickname}</span></div>
            <div className="detail-row"><span className="detail-label">开始时间:</span><span className="detail-value">{detail.startedAt}</span></div>
            <div className="detail-row"><span className="detail-label">消息数:</span><span className="detail-value">{detail.messageCount}</span></div>
          </div>
          <div className="messages-container">
          <h4>消息列表</h4>
          {msgLoading ? (
            <Spin />
          ) : (
            <div className="messages-list">
              {messages.map((msg) => (
                <div key={msg.id} className={`message-item ${msg.senderType === 1 ? 'user-message' : 'ai-message'}`}>
                  <div className="message-header">
                    <span className="sender">{msg.senderType === 1 ? '用户' : 'AI助手'}</span>
                    <span className="time">{msg.createdAt}</span>
                  </div>
                  <div className="message-content">{msg.content}</div>
                </div>
              ))}
            </div>
          )}
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Consultations