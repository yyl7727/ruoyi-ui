import request from '@/utils/request'

// 查询
export function listPerformant(query) {
  return request({
    url: '/task/performant/list',
    method: 'get',
    params: query
  })
}

// 查询
export function getPerformant(id) {
  return request({
    url: '/task/performant/' + id,
    method: 'get'
  })
}

// 删除
export function delPerformant(id) {
  return request({
    url: '/task/performant/' + id,
    method: 'delete'
  })
}

// 导出
export function exportPerformant(query) {
  return request({
    url: '/task/performant/export',
    method: 'get',
    params: query
  })
}
