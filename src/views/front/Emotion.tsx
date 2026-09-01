import { useState } from 'react'
import { Button, Rate, Select, Input, message } from 'antd'
import { addEmotionDiary } from '@/apis/fronted'
import dayjs from 'dayjs'
import likeIcon from '@/assets/images/like.png'
import happyImg from '@/assets/images/开心.png'
import calmImg from '@/assets/images/平静.png'
import anxiousImg from '@/assets/images/焦虑.png'
import sadImg from '@/assets/images/悲伤.png'
import excitedImg from '@/assets/images/兴奋.png'
import tiredImg from '@/assets/images/疲惫.png'
import surprisedImg from '@/assets/images/惊讶.png'
import confusedImg from '@/assets/images/困惑.png'
import '@/styles/front/emotion.scss'

const emotions = [
  { name: '开心', url: happyImg },
  { name: '平静', url: calmImg },
  { name: '焦虑', url: anxiousImg },
  { name: '悲伤', url: sadImg },
  { name: '兴奋', url: excitedImg },
  { name: '疲惫', url: tiredImg },
  { name: '惊讶', url: surprisedImg },
  { name: '困惑', url: confusedImg },
]

const emotionStatus = ['绝望崩溃', '消沉抑郁', '焦虑烦躁', '低落不悦', '平静淡然', '轻松惬意', '愉悦舒心', '欢欣满足', '兴奋欣喜', '极致幸福']

const initForm = {
  diaryDate: dayjs().format('YYYY-MM-DD'),
  moodScore: 0,
  dominantEmotion: '',
  emotionTriggers: '',
  diaryContent: '',
  sleepQuality: null as number | null,
  stressLevel: null as number | null,
}

const Emotion = () => {
  const [form, setForm] = useState({ ...initForm })

  const resetForm = () => setForm({ ...initForm, diaryDate: dayjs().format('YYYY-MM-DD') })

  const submitForm = () => {
    if (!form.moodScore) {
      message.error('请选择情绪评分')
      return
    }
    addEmotionDiary(form).then(() => {
      message.success('提交成功')
      resetForm()
    })
  }

  const update = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }))

  return (
    <div className="emotionDiary-container">
      <div className="header-section">
        <div className="header-content">
          <img src={likeIcon} alt="" style={{ width: 60, height: 60 }} />
          <h1>情绪日志</h1>
        </div>
      </div>

      <div className="content">
        {/* 情绪评分 */}
        <div className="diary-card">
          <div className="title">今日情绪评分</div>
          <p>您今天的整体情绪状态如何？(1-10分)</p>
          <Rate
            value={form.moodScore}
            onChange={(v) => update('moodScore', v)}
            count={10}
            character={({ index = 0 }) => index + 1}
            style={{ fontSize: 28 }}
          />
          {form.moodScore > 0 && (
            <div style={{ marginTop: 8, color: '#7ED321', fontSize: 16 }}>{emotionStatus[form.moodScore - 1]}</div>
          )}
        </div>

        {/* 主要情绪 */}
        <div className="diary-card">
          <div className="title">主要情绪</div>
          <div className="emotion-grid">
            {emotions.map((em) => (
              <div
                key={em.name}
                className={`emotion-card${form.dominantEmotion === em.name ? ' selected' : ''}`}
                onClick={() => update('dominantEmotion', em.name)}
              >
                <img src={em.url} alt={em.name} style={{ width: 50, height: 50 }} />
                <div className="emotion-name">{em.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 详细记录 */}
        <div className="diary-card">
          <div className="title">详细记录</div>
          <div className="detail-form">
          <div className="form-group">
            <div className="form-label">情绪触发因素</div>
            <Input.TextArea
              value={form.emotionTriggers}
              onChange={(e) => update('emotionTriggers', e.target.value)}
              placeholder="今天什么事情影响了您的情绪？"
              rows={3}
              maxLength={1000}
              showCount
            />
          </div>
          <div className="form-group">
            <div className="form-label">今日感想</div>
            <Input.TextArea
              value={form.diaryContent}
              onChange={(e) => update('diaryContent', e.target.value)}
              placeholder="写下您今天的想法、感受..."
              rows={5}
              maxLength={2000}
              showCount
            />
          </div>
          <div className="life-indicators">
            <div className="indicator-group">
              <div className="form-label">睡眠质量</div>
              <Select
                value={form.sleepQuality}
                onChange={(v) => update('sleepQuality', v)}
                placeholder="请选择"
                style={{ width: '100%' }}
                options={[
                  { label: '很差', value: 1 }, { label: '较差', value: 2 },
                  { label: '一般', value: 3 }, { label: '良好', value: 4 }, { label: '优秀', value: 5 },
                ]}
              />
            </div>
            <div className="indicator-group">
              <div className="form-label">压力水平</div>
              <Select
                value={form.stressLevel}
                onChange={(v) => update('stressLevel', v)}
                placeholder="请选择"
                style={{ width: '100%' }}
                options={[
                  { label: '很低', value: 1 }, { label: '较低', value: 2 },
                  { label: '中等', value: 3 }, { label: '较高', value: 4 }, { label: '很高', value: 5 },
                ]}
              />
            </div>
          </div>
          <div className="action-buttons">
            <Button onClick={resetForm}>重置</Button>
            <Button type="primary" onClick={submitForm} style={{ marginLeft: 10 }}>提交</Button>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Emotion