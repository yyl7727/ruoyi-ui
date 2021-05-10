import request from '@/utils/request'

// 查询课题成员列表
export function listMember(query) {
  return request({
    url: '/task/member/list',
    method: 'get',
    params: query
  })
}

// 查询课题成员详细
export function getMember(id) {
  return request({
    url: '/task/member/' + id,
    method: 'get'
  })
}

// 新增课题成员
export function addMember(data) {
  return request({
    url: '/task/member/add',
    method: 'post',
    data: data
  })
}

// 修改课题成员
export function updateMember(data) {
  return request({
    url: '/task/member/update',
    method: 'put',
    data: data
  })
}

// 删除课题成员
export function delMember(id) {
  return request({
    url: '/system/member/' + id,
    method: 'delete'
  })
}

// 导出课题成员
export function exportMember(query) {
  return request({
    url: '/system/member/export',
    method: 'get',
    params: query
  })
}
