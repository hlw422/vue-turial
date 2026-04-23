import request from '../utils/request'

export interface Goal {
  id: number
  title: string
  note: string
  minutes: number
  done: boolean
  createdAt: number
}

// 获取列表
export function getGoalList(): Promise<Goal[]> {
  return request<Goal[]>({ url: '/goals/list', method: 'POST' })
}

// 添加
export function addGoal(data: any) {
  return request({ url: '/goals/add', method: 'POST', data })
}

// 切换完成状态
export function toggleGoal(data: { id: number; done: boolean }) {
  return request({ url: '/goals/toggle', method: 'POST', data })
}

// 删除
export function deleteGoal(data: { id: number }) {
  return request({ url: '/goals/delete', method: 'POST', data })
}