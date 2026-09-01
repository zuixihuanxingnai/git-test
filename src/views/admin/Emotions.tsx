import { useState, useEffect } from 'react';
import {
  message,
  Modal,
  Table,
  Pagination,
  Descriptions,
  Tag,
  Rate,
  Progress,
  Button,
  Avatar,
  Popconfirm,
} from 'antd';
import type { TableProps } from 'antd/es/table';
import PageHeade from '@/components/PageHeade';
import TabSearch from '@/components/TabSearch';
import { getEmotionsList, deleteEmotion } from '@/apis/admin';
import type { EmotionItem, AiEmotionAnalysis, SearchFormItem, Pagination as PageType } from '@/types/emotion';
import '@/styles/admin/emotion.scss';

// 情绪标签类型
const getEmotionTagType = (emotion?: string): string => {
  const map: Record<string, string> = {
    '开心': 'success',
    '平静': 'default',
    '疲惫': 'warning',
    '愤怒': 'error',
    '悲伤': 'default',
    '焦虑': 'warning',
  };
  return emotion ? map[emotion] || 'default' : 'default';
};

// AI情绪标签
const getAiEmotionTagType = (emotion?: string): string => {
  const map: Record<string, string> = {
    '开心': 'success',
    '平静': 'success',
    '兴奋': 'warning',
    '满足': 'success',
    '愤怒': 'error',
    '悲伤': 'default',
    '焦虑': 'warning',
    '恐惧': 'error',
    '沮丧': 'default',
    '压力': 'warning',
  };
  return emotion ? map[emotion] || 'default' : 'default';
};

// 情绪分数进度条颜色
const getEmotionScoreColor = (score?: number): string => {
  if (!score) return '#67c23a';
  if (score >= 80) return '#f56c6c';
  if (score >= 60) return '#e6a23c';
  if (score >= 40) return '#909399';
  return '#67c23a';
};

// 风险等级tag
const getRiskLevelTagType = (riskLevel?: number): string => {
  const map: Record<number, string> = {
    0: 'success',
    1: 'default',
    2: 'warning',
    3: 'error',
  };
  return riskLevel !== undefined ? map[riskLevel] || 'default' : 'default';
};

// 风险等级文字
const getRiskLevelText = (riskLevel?: number): string => {
  const map: Record<number, string> = {
    0: '正常',
    1: '关注',
    2: '预警',
    3: '危机',
  };
  return riskLevel !== undefined ? map[riskLevel] || '未知风险等级' : '未知风险等级';
};

const EmotionLog = () => {
  // 搜索表单配置
  const formItem: SearchFormItem[] = [
    { comp: 'input', label: '用户ID', prop: 'userId', placeholder: '请输入用户ID' },
    {
      comp: 'select',
      label: '情绪评分',
      prop: 'moodScore',
      placeholder: '请选择情绪评分',
      options: [
        { label: '低分(1-3)', value: '1-3' },
        { label: '中分(4-6)', value: '4-6' },
        { label: '高分(7-10)', value: '7-10' },
      ],
    },
  ];

  const [listData, setListData] = useState<EmotionItem[]>([]);
  const [pagination, setPagination] = useState<PageType>({ currentPage: 1, size: 5, total: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [currentDetail, setCurrentDetail] = useState<EmotionItem | null>(null);
  const [aiDetail, setAiDetail] = useState<AiEmotionAnalysis | null>(null);

  // 查询列表
  const handleSearch = async (formData: Record<string, any> = {}) => {
    
    const minMoodScore=formData.moodScore?.split('-')[0]
    const maxMoodScore=formData.moodScore?.split('-')[1]
    console.log(minMoodScore, maxMoodScore);
    const params = { ...pagination,  minMoodScore, maxMoodScore };
    console.log(params);
    const { records, total } = await getEmotionsList(params);
    console.log(records, total);
    setListData(records);
    setPagination(prev => ({ ...prev, total }));
  };

  // 分页切换
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  // 打开详情弹窗
  const openDetailModal = (row: EmotionItem) => {
    setCurrentDetail(row);
    setModalOpen(true);
    if (row.aiEmotionAnalysis) {
      try {
        const data = JSON.parse(row.aiEmotionAnalysis) as AiEmotionAnalysis;
        setAiDetail(data);
      } catch {
        setAiDetail(null);
      }
    } else {
      setAiDetail(null);
    }
  };

  // 删除记录
  const handleDelete = async (row: EmotionItem) => {
    await deleteEmotion(row.id.toString());
    message.success('删除成功');
    handleSearch();
  };

  // 分页变化自动请求
  useEffect(() => {
    handleSearch();
  }, [pagination.currentPage, pagination.size]);

  // 表格列配置
  const columns: TableProps<EmotionItem>['columns'] = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    {
      title: '会话ID',
      width: 80,
      render: (_, record) => <Avatar>{record.nickname?.[0]}</Avatar>,
    },
    { title: '记录日期', dataIndex: 'diaryDate', width: 120 },
    {
      title: '情绪评分',
      render: (_, record) => <Rate disabled value={record.moodScore} count={10} />,
    },
    {
      title: '生活指标',
      width: 120,
      render: (_, record) => (
        <div>
          <p>睡眠：{record.sleepQuality}/5</p>
          <p>压力：{record.stressLevel}/5</p>
        </div>
      ),
    },
    { title: '情绪触发因素', dataIndex: 'emotionTriggers', width: 120 },
    { title: '日记内容', dataIndex: 'diaryContent', width: 250 },
    {
      title: '操作',
      width: 240,
      fixed: 'right',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => openDetailModal(record)}>
            详情
          </Button>
          <Popconfirm title="确认删除该条记录吗？" onConfirm={() => handleDelete(record)}>
            <Button danger type="link">删除</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="emotions-container">
      <PageHeade title="情绪日志" />
      <TabSearch formItem={formItem} onSearch={handleSearch} />

      <Table
        rowKey="id"
        dataSource={listData}
        columns={columns}
        pagination={false}
        style={{ marginTop: 16 }}
      />

      <Pagination
        style={{ marginTop: 25 }}
        current={pagination.currentPage}
        pageSize={pagination.size}
        total={pagination.total}
        onChange={handlePageChange}
      />

      {/* 详情弹窗 */}
      <Modal
        title="情绪详情"
        width={800}
        open={modalOpen}
        maskClosable={false}
        onCancel={() => setModalOpen(false)}
        footer={[
          <Button danger onClick={() => setModalOpen(false)} key="close">
            关闭
          </Button>,
        ]}
      >
        {currentDetail && (
          <div className="detail-content">
            <div className="detail-section">
              <h4>用户信息</h4>
              <Descriptions column={2} bordered>
                <Descriptions.Item label="用户名">{currentDetail.username || '-'}</Descriptions.Item>
                <Descriptions.Item label="昵称">{currentDetail.nickname || '-'}</Descriptions.Item>
                <Descriptions.Item label="用户ID">{currentDetail.userId || '-'}</Descriptions.Item>
                <Descriptions.Item label="记录日期">{currentDetail.diaryDate || '-'}</Descriptions.Item>
              </Descriptions>
            </div>

            <div className="detail-section">
              <h4>情绪状态</h4>
              <Descriptions column={2} bordered>
                <Descriptions.Item label="情绪评分">
                  <Rate disabled value={currentDetail.moodScore} count={10} />
                </Descriptions.Item>
                <Descriptions.Item label="主要情绪">
                  <Tag color={getEmotionTagType(currentDetail.dominantEmotion)}>
                    {currentDetail.dominantEmotion || '-'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="睡眠质量">
                  {currentDetail.sleepQuality ?? '-'}/5
                </Descriptions.Item>
                <Descriptions.Item label="压力水平">
                  {currentDetail.stressLevel ?? '-'}/5
                </Descriptions.Item>
              </Descriptions>
            </div>

            <div className="detail-section">
              <h4>日记内容</h4>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="情绪触发因素">
                  {currentDetail.emotionTriggers || '无'}
                </Descriptions.Item>
                <Descriptions.Item label="日记内容">
                  {currentDetail.diaryContent || '无'}
                </Descriptions.Item>
              </Descriptions>
            </div>

            <div className="detail-section">
              <h4>AI情绪分析结果</h4>
              <div className="ai-analysis-result">
                {aiDetail ? (
                  <>
                    <Descriptions column={2} bordered>
                      <Descriptions.Item label="主要情绪">
                        <Tag color={getAiEmotionTagType(aiDetail.primaryEmotion)}>
                          {aiDetail.primaryEmotion || '-'}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="情绪强度">
                        <Progress
                          percent={aiDetail.emotionScore || 0}
                          strokeColor={getEmotionScoreColor(aiDetail.emotionScore)}
                          size="small"
                        />
                      </Descriptions.Item>
                      <Descriptions.Item label="风险等级">
                        <Tag color={getRiskLevelTagType(aiDetail.riskLevel)}>
                          {getRiskLevelText(aiDetail.riskLevel)}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="情绪性质">
                        <Tag color={aiDetail.isNegative ? 'error' : 'success'}>
                          {aiDetail.isNegative ? '负面情绪' : '正面情绪'}
                        </Tag>
                      </Descriptions.Item>
                    </Descriptions>

                    <div className="ai-suggestion-section">
                      <h5>专业建议</h5>
                      <div className="suggestion-content">{aiDetail.suggestion || '无'}</div>
                    </div>

                    <div className="ai-risk-section">
                      <h5>风险描述</h5>
                      <div className="risk-content">{aiDetail.riskDescription || '无'}</div>
                    </div>

                    <div className="ai-improvements-section">
                      <h5>改善建议</h5>
                      {aiDetail.improvements && aiDetail.improvements.length > 0 ? (
                        <ul className="improvement-list">
                          {aiDetail.improvements.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <div>暂无改善建议</div>
                      )}
                    </div>
                  </>
                ) : (
                  <div>暂无AI分析数据</div>
                )}
              </div>
            </div>

            <div className="detail-section">
              <h4>时间信息</h4>
              <Descriptions column={2} bordered>
                <Descriptions.Item label="创建时间">{aiDetail?.createTime || '无'}</Descriptions.Item>
                <Descriptions.Item label="记录时间">{currentDetail.diaryDate}</Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EmotionLog;