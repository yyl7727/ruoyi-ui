import request from '@/utils/request'

//工作日志列表
export function listWorkLog(query) {
  return request({
    url: '/workLog/list',
    method: 'get',
    params: query
  })
}

//新增课题
export function addWorkLog(data) {
  return request({
    url: '/workLog/add',
    method: 'post',
    data: data
  });
}

export function getWorkLog(workLogId) {
  return request({
    url: '/workLog/getWorkLog/' + workLogId,
    method: 'get'
  })
}

//更新工作日志
export function updateWorkLog(data) {
  return request({
    url: '/workLog/update',
    method: 'put',
    data: data
  })
}

//删除工作日志
export function deleteWorkLog(data) {
  return request({
    url: '/workLog/delete',
    method: 'put',
    data: data
  })
}
