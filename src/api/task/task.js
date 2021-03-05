import request from '@/utils/request'

//新增课题
export function addTask(data) {
  return request({
    url: '/task/add',
    method: 'post',
    data: data
  });
}

//更新课题
export function updateTask(data) {
  return request({
    url: '/task/update',
    method: 'put',
    data: data
  })
}

export function getTask(taskId) {
  return request({
    url: '/task/getTask/' + taskId,
    method: 'get'
  })
}

//修改课题状态
export function changeTaskStatus(taskId, status) {
  const data = {
    taskId,
    status
  }
  return request({
    url: '/task/changeStatus',
    method: 'put',
    data: data
  })
}

export function deleteByIds(data) {
  return request({
    url: '/task/deleteByIds',
    method: 'post',
    data: data
  })
}

export function deleteById(taskId) {
  return request({
    url: '/task/deleteById',
    method: 'post',
    data: taskId
  })
}

//课题列表
export function listTask(query) {
  return request({
    url: '/task/list',
    method: 'get',
    params: query
  })
}

//课题列表
export function listTaskByUserId(userId) {
  return request({
    url: '/task/list/' + userId,
    method: 'get'
  })
}
