import { useEffect, useState } from 'react'
import { Pagination, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'
import { getKnowledgeList } from '@/apis/fronted'
import { fileBaseUrl } from '@/config'
import dayjs from 'dayjs'
import bookIcon from '@/assets/images/book.png'
import defaultCover from '@/assets/images/6.webp'
import '@/styles/front/knowledge.scss'

const Knowledge = () => {
  const navigate = useNavigate()
  const [articleList, setArticleList] = useState<any[]>([])
  const [recommendList, setRecommendList] = useState<any[]>([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })

  useEffect(() => {
    getKnowledgeList({ sortField: 'readCount', sortDirection: 'desc', currentPage: 1, pageSize: 5 }).then((res) =>
      setRecommendList(res.records)
    )
    fetchArticles()
  }, [])

  const fetchArticles = (page = 1) => {
    getKnowledgeList({ sortField: 'readCount', sortDirection: 'desc', pageNum: page, pageSize: pagination.pageSize }).then(
      (res) => {
        setArticleList(res.records)
        setPagination((p) => ({ ...p, total: res.total, current: page }))
      }
    )
  }
const goToArticle = (id: number) => {
  // 1. 更新主列表 articleList
  setArticleList(prevList =>
    prevList.map(item =>
      item.id === id ? { ...item, readCount: item.readCount + 1 } : item
    )
  )
  // 2. 同步更新侧边推荐列表 recommendList
  setRecommendList(prevRec =>
    prevRec.map(item =>
      item.id === id ? { ...item, readCount: item.readCount + 1 } : item
    )
  )
  navigate(`/knowledge/article/${id}`)
}

  return (
    <div className="knowledge-container">
      <div className="header-section">
        <div className="header-content">
          <img src={bookIcon} alt="" style={{ width: 60, height: 60 }} />
          <h1>心理健康知识库</h1>
        </div>
      </div>

      <div className="content">
        <div className="recommend-section">
          <div className="section-title">推荐阅读</div>
          <div className="recommend-list">
            {recommendList.map((item) => (
              <div key={item.id} className="recommend-item" onClick={() => goToArticle(item.id)}>
                <h4>{item.title}</h4>
                <p className="read-count">阅读量 {item.readCount}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="article-list">
          {articleList.map((item) => (
            <div key={item.id} className="article-item" onClick={() => goToArticle(item.id)}>
              <img
                src={item.coverImage ? `${fileBaseUrl}${item.coverImage}` : defaultCover}
                alt=""
                style={{ width: 240, height: 150, borderRadius: 8, objectFit: 'cover' }}
              />
              <div className="info">
                <div className="title">
                  <h3>{item.title}</h3>
                  <Tag color="blue">{item.categoryName}</Tag>
                </div>
                <div className="meta">
                  <span>作者：{item.authorName}</span>
                  <span>{dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm')}</span>
                </div>
                <div className="meta">
                  <span>阅读量 {item.readCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pagination-wrapper">
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={(page) => fetchArticles(page)}
        />
      </div>
    </div>
  )
}

export default Knowledge