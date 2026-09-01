import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

export const useECharts = (option: EChartsOption | null) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    // 等 DOM 就绪
    if (!chartRef.current) return

    // 没有配置就销毁
    if (!option) {
      instanceRef.current?.dispose()
      instanceRef.current = null
      return
    }

    // 初始化或复用
    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current)
    }
    instanceRef.current.setOption(option)
  }, [option])

  // resize + 销毁
  useEffect(() => {
    const handleResize = () => instanceRef.current?.resize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      instanceRef.current?.dispose()
    }
  }, [])

  return chartRef
}