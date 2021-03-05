import request from '@/utils/request'

// 查询助研信息列表
export function listInfo(query) {
  return request({
    url: '/rearch/info',
    method: 'get',
    params: query
  })
}
