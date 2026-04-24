import request from '../utils/request'

export interface BookExcerpt {
  id: number
  bookName: string
  content: string
  comment: string
  createdAt: string
}

// 获取书摘列表
export function getExcerptList(): Promise<BookExcerpt[]> {
  return request<BookExcerpt[]>({ url: '/excerpts/list', method: 'POST' })
}

// 添加书摘
export function addExcerpt(data: { bookName: string; content: string; comment: string }): Promise<void> {
  return request({ url: '/excerpts/add', method: 'POST', data })
}

// 删除书摘
export function deleteExcerpt(data: { id: number }): Promise<void> {
  return request({ url: '/excerpts/delete', method: 'POST', data })
}
