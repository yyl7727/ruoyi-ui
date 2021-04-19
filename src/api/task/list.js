import request from '@/utils/request'

export function getTask(taskId) {
  return request({
    url: '/task/getTask/' + taskId,
    method: 'get'
  })
}

//课题列表
export function allList(query) {
  return request({
    url: '/task/allList',
    method: 'get',
    params: query
  })
}

//申请加入课题
export function applyIntoTask(query) {
  return request({
    url: '/task/apply',
    method: 'post',
    data: query
  })
}
