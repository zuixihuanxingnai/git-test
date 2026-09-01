import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Tag } from 'antd'
import { getKnowledgeDetail } from '@/apis/fronted'
import dayjs from 'dayjs'
import bookIcon from '@/assets/images/book.png'
import '@/styles/front/article.scss'

const ArticleDetail = () => {
  const { id } = useParams()
  const [detail, setDetail] = useState<any>({})

  useEffect(() => {
    if (id) getKnowledgeDetail(id).then(setDetail)
  }, [id])

  const formatContent = (content: string) => {
    if (!content) return ''
    return content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')
  }

  return (
    <div className="articleDetail-container">
      <div className="header-section">
        <div className="header-content">
          <img src={bookIcon} alt="" style={{ width: 60, height: 60 }} />
          <h1>知识文章详情</h1>
        </div>
      </div>

      <div className="content">
        <div className="diary-card">
          <p className="title">文章信息</p>
          <div className="sub-title">
            <Tag color="orange">{detail.categoryName}</Tag>
            <span style={{ marginLeft: 8 }}>{dayjs(detail.updatedAt).format('YYYY-MM-DD')}</span>
          </div>
          <h1 className="article-title">{detail.title}</h1>
          {detail.summary && (
            <div className="summary-content"><p>{detail.summary}</p></div>
          )}
          <div className="meta-row">
            <span>作者：{detail.authorName}</span>
            <span>{detail.readCount} 次阅读</span>
          </div>
        </div>

        <div className="diary-card">
          <div className="title">正文内容</div>
          <div className="content-wrapper" dangerouslySetInnerHTML={{ __html: formatContent(detail.content) }} />
          {detail.tagArray?.length > 0 && (
            <div className="tags-content">
              <h4>相关标签</h4>
              <div className="tags-list">
                {detail.tagArray.map((tag: string) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ArticleDetail