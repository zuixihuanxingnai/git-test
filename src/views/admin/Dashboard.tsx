import React, { useRef, useEffect, useState } from 'react';
import { Row, Col, Card, message } from 'antd';
import * as echarts from 'echarts';
import type { ECharts, EChartsOption } from 'echarts';
// 接口请求
import { getAllDetail } from '@/apis/admin';
// 图片资源
import icon1 from '@/assets/images/3.webp';
import icon2 from '@/assets/images/4.webp';
import icon3 from '@/assets/images/5.webp';
import icon4 from '@/assets/images/6.webp';
import '@/styles/admin/dashboard.scss';

// ===================== TS类型定义 =====================
// 系统总览数据
interface SystemOverview {
  totalUsers: number;
  activeUsers: number;
  totalDiaries: number;
  todayNewDiaries: number;
  totalSessions: number;
  todayNewSessions: number;
  avgMoodScore: number;
}

// 情绪趋势单条
interface EmotionTrendItem {
  date: string;
  avgMoodScore: number;
  recordCount: number;
}

// 咨询每日趋势
interface ConsultDailyItem {
  date: string;
  sessionCount: number;
  userCount: number;
}

interface ConsultStats {
  totalSessions: number;
  avgDurationMinutes: number;
  dailyTrend: ConsultDailyItem[];
}

// 用户活跃度单条
interface UserActivityItem {
  date: string;
  activeUsers: number;
  newUsers: number;
  diaryUsers: number;
  consultationUsers: number;
}

// 整体接口返回数据
interface DashboardData {
  systemOverview: SystemOverview;
  emotionTrend: EmotionTrendItem[];
  consultationStats: ConsultStats;
  userActivity: UserActivityItem[];
}

// ===================== 组件主体 =====================
const Dashboard: React.FC = () => {
  // 全局仪表盘数据
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  // ========== ECharts DOM Ref ==========
  const emotionChartRef = useRef<HTMLDivElement>(null);
  const consultationChartRef = useRef<HTMLDivElement>(null);
  const userActiveChartRef = useRef<HTMLDivElement>(null);

  // ========== ECharts 实例Ref ==========
  const emotionChart = useRef<ECharts | null>(null);
  const consultationChart = useRef<ECharts | null>(null);
  const userActiveChart = useRef<ECharts | null>(null);

  // ===================== 图表初始化函数 =====================
  // 情绪趋势图表
  const initEmotionChart = () => {
    const dom = emotionChartRef.current;
    if (!dom || !dashboardData) return;

    if (emotionChart.current) emotionChart.current.dispose();
    const chart = echarts.init(dom);
    emotionChart.current = chart;

    const emotionData = dashboardData.emotionTrend;
    const option: EChartsOption = {
      title: {
        text: '情绪趋势分析',
        textStyle: { fontSize: 16, fontWeight: 600, color: '#2d3436' },
        left: 'center',
        top: 10,
      },
      tooltip: {
        trigger: 'axis',
        borderColor: '#fab1a0',
        borderWidth: 1,
        textStyle: { color: '#2d3436' },
      },
      legend: {
        data: ['平均情绪评分', '记录数量'],
        top: 40,
        textStyle: { color: '#333' },
      },
      xAxis: {
        type: 'category',
        data: emotionData.map((item) => item.date),
        axisLabel: { fontSize: 12, fontWeight: 400, color: '#2d3436', width: 1 },
      },
      yAxis: {
        type: 'value',
        name: '情绪数量',
        position: 'left',
        axisLine: { lineStyle: { color: '#2d3436', width: 1 } },
      },
      series: [
        {
          name: '平均情绪评分',
          type: 'line',
          data: emotionData.map((item) => item.avgMoodScore),
          smooth: true,
          lineStyle: { color: '#faebaf', width: 3 },
          itemStyle: { color: '#faebaf' },
        },
        {
          name: '记录数量',
          type: 'line',
          data: emotionData.map((item) => item.recordCount),
          smooth: true,
          lineStyle: { color: '#fab1a0', width: 3 },
          itemStyle: { color: '#fab1a0' },
        },
      ],
      grid: { left: '3%', right: '4%', top: 80, bottom: '3%' },
    };
    chart.setOption(option);
  };

  // 咨询会话图表
  const initConsultationChart = () => {
    const dom = consultationChartRef.current;
    if (!dom || !dashboardData) return;

    if (consultationChart.current) consultationChart.current.dispose();
    const chart = echarts.init(dom);
    consultationChart.current = chart;

    const dailyTrend = dashboardData.consultationStats.dailyTrend;
    const option: EChartsOption = {
      title: {
        text: '咨询活动统计',
        textStyle: { fontSize: 16, fontWeight: 600, color: '#2d3436' },
        left: 'center',
        top: 10,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#fab1a0',
        borderWidth: 1,
        textStyle: { color: '#2d3436' },
      },
      legend: {
        data: ['会话数量', '参与用户数'],
        top: 40,
        textStyle: { color: '#636e72' },
      },
      grid: { left: '3%', right: '4%', bottom: '3%', top: 80, containLabel: true },
      xAxis: {
        type: 'category',
        data: dailyTrend.map((item) => item.date),
        axisLine: { lineStyle: { color: 'rgba(244, 162, 97, 0.3)' } },
        axisLabel: { color: '#636e72' },
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#636e72' },
        axisLine: { lineStyle: { color: 'rgba(244, 162, 97, 0.3)' } },
        splitLine: { lineStyle: { color: 'rgba(244, 162, 97, 0.1)' } },
      },
      series: [
        {
          name: '会话数量',
          type: 'bar',
          data: dailyTrend.map((item) => item.sessionCount),
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#74b9ff' },
                { offset: 1, color: '#0984e3' },
              ],
            },
          },
          barWidth: '40%',
        },
        {
          name: '参与用户数',
          type: 'bar',
          data: dailyTrend.map((item) => item.userCount),
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#fdcb6e' },
                { offset: 1, color: '#f39c12' },
              ],
            },
          },
          barWidth: '40%',
        },
      ],
    };
    chart.setOption(option);
  };

  // 用户活跃度图表
  const initUserActiveChart = () => {
    const dom = userActiveChartRef.current;
    if (!dom || !dashboardData) return;

    if (userActiveChart.current) userActiveChart.current.dispose();
    const chart = echarts.init(dom);
    userActiveChart.current = chart;

    const activityData = dashboardData.userActivity;
    const option: EChartsOption = {
      title: {
        text: '用户活跃度趋势',
        textStyle: { fontSize: 16, fontWeight: 600, color: '#2d3436' },
        left: 'center',
        top: 10,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#fab1a0',
        borderWidth: 1,
        textStyle: { color: '#2d3436' },
      },
      legend: {
        data: ['活跃用户', '新增用户', '日记用户', '咨询用户'],
        top: 40,
        textStyle: { color: '#636e72' },
      },
      grid: { left: '3%', right: '4%', bottom: '3%', top: 80, containLabel: true },
      xAxis: {
        type: 'category',
        data: activityData.map((item) => item.date),
        axisLine: { lineStyle: { color: 'rgba(244, 162, 97, 0.3)' } },
        axisLabel: { color: '#636e72' },
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#636e72' },
        axisLine: { lineStyle: { color: 'rgba(244, 162, 97, 0.3)' } },
        splitLine: { lineStyle: { color: 'rgba(244, 162, 97, 0.1)' } },
      },
      series: [
        {
          name: '活跃用户',
          type: 'line',
          data: activityData.map((item) => item.activeUsers),
          smooth: true,
          lineStyle: { width: 3, color: '#a29bfe' },
          itemStyle: { color: '#a29bfe' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(162, 155, 254, 0.4)' },
                { offset: 1, color: 'rgba(162, 155, 254, 0.1)' },
              ],
            },
          },
        },
        {
          name: '新增用户',
          type: 'line',
          data: activityData.map((item) => item.newUsers),
          smooth: true,
          lineStyle: { width: 3, color: '#fdcb6e' },
          itemStyle: { color: '#fdcb6e' },
        },
        {
          name: '日记用户',
          type: 'line',
          data: activityData.map((item) => item.diaryUsers),
          smooth: true,
          lineStyle: { width: 3, color: '#00b894' },
          itemStyle: { color: '#00b894' },
        },
        {
          name: '咨询用户',
          type: 'line',
          data: activityData.map((item) => item.consultationUsers),
          smooth: true,
          lineStyle: { width: 3, color: '#fab1a0' },
          itemStyle: { color: '#fab1a0' },
        },
      ],
    };
    chart.setOption(option);
  };

  // 统一渲染全部图表
  const initChart = () => {
    initEmotionChart();
    initConsultationChart();
    initUserActiveChart();
  };

  // ===================== 数据请求 & 生命周期 =====================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllDetail();
        setDashboardData(res);
      } catch (err) {
        message.error('数据加载失败');
      }
    };
    fetchData();
  }, []);

  // 数据加载完成后渲染图表
  useEffect(() => {
    if (dashboardData) {
      initChart();
    }

    // 窗口自适应
    const resizeFn = () => {
      emotionChart.current?.resize();
      consultationChart.current?.resize();
      userActiveChart.current?.resize();
    };
    window.addEventListener('resize', resizeFn);

    // 组件销毁销毁图表 & 解绑事件
    return () => {
      window.removeEventListener('resize', resizeFn);
      emotionChart.current?.dispose();
      consultationChart.current?.dispose();
      userActiveChart.current?.dispose();
    };
  }, [dashboardData]);

  // ===================== JSX渲染 =====================
  if (!dashboardData) return <div>加载中...</div>;
  const { systemOverview, consultationStats } = dashboardData;

  return (
    <div className="dashboard-container">
      {/* 顶部4张统计卡片 */}
      <Row gutter={20}>
        <Col span={6}>
          <Card className="dashboard-card">
            <div className="card-content">
              <div className="avatar users">
                <img src={icon1} alt="user" style={{ width: 50, height: 50, borderRadius: '30%' }} />
              </div>
              <div className="info">
                <div className="title">总用户数</div>
                <div className="number">{systemOverview.totalUsers}</div>
                <div className="subtitle-title">活跃用户:{systemOverview.activeUsers}</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="dashboard-card">
            <div className="card-content">
              <div className="avatar like">
                <img src={icon2} alt="diary" style={{ width: 50, height: 50, borderRadius: '30%' }} />
              </div>
              <div className="info">
                <div className="title">情绪日志</div>
                <div className="number">{systemOverview.totalDiaries}</div>
                <div className="subtitle-title">今日新增:{systemOverview.todayNewDiaries}</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="dashboard-card">
            <div className="card-content">
              <div className="avatar comments">
                <img src={icon3} alt="consult" style={{ width: 50, height: 50, borderRadius: '30%' }} />
              </div>
              <div className="info">
                <div className="title">咨询会话</div>
                <div className="number">{systemOverview.totalSessions}</div>
                <div className="subtitle-title">今日新增:{systemOverview.todayNewSessions}</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="dashboard-card">
            <div className="card-content">
              <div className="avatar smile">
                <img src={icon4} alt="mood" style={{ width: 50, height: 50, borderRadius: '30%' }} />
              </div>
              <div className="info">
                <div className="title">平均情绪</div>
                <div className="number">{systemOverview.avgMoodScore} / 10</div>
                <div className="subtitle-title">情绪健康指数</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 第二行两个图表 */}
      <Row gutter={20} style={{ marginTop: 20 }}>
        <Col span={12}>
          <Card className="dashboard-card" title="情绪趋势分析">
            <div className="chart-content">
              <div ref={emotionChartRef} style={{ width: '100%', height: 300 }} />
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card className="dashboard-card" title="咨询会话统计">
            <div className="chart-content">
              <div className="consultation-stats">
                <div className="stat-item">
                  <div className="stat-label">总会话数</div>
                  <div className="stat-value">{consultationStats.totalSessions}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">平均时长</div>
                  <div className="stat-value">{consultationStats.avgDurationMinutes}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">活跃用户</div>
                  <div className="stat-value">{systemOverview.activeUsers}</div>
                </div>
              </div>
              <div ref={consultationChartRef} style={{ width: '100%', height: 230 }} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 用户活跃度大图 */}
      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card className="dashboard-card" title="用户活跃度趋势">
            <div className="chart-content">
              <div ref={userActiveChartRef} style={{ width: '100%', height: 300 }} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;