import request from '../utils/request'

export interface TechSummary {
  id: number
  title: string
  content: string // Markdown 内容
  tags: string[]
  createdAt: string
}

// 获取技术摘要列表
export function getTechSummaryList(): Promise<TechSummary[]> {
  return request<TechSummary[]>({ url: '/tech/list', method: 'POST' })
}

// 添加技术摘要
export function addTechSummary(data: { title: string; content: string; tags: string[] }): Promise<void> {
  return request({ url: '/tech/add', method: 'POST', data })
}

// 删除技术摘要
export function deleteTechSummary(data: { id: number }): Promise<void> {
  return request({ url: '/tech/delete', method: 'POST', data })
}
