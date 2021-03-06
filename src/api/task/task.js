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

export function getTaskByUserName(userName) {
  return request({
    url: '/task/getJoinedTask',
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

//邀请学生加入课题
export function inviteIntoTask(data) {
  return request({
    url: '/task/invite',
    method: 'post',
    data: data
  })
}

//加入课题
export function joinTask(data) {
  return request({
    url: '/task/join',
    method: 'put',
    data: data
  })
}

//拒绝加入课题
export function unJoinTask(data) {
  return request({
    url: '/task/unJoin',
    method: 'put',
    data: data
  })
}

//加入课题
export function joinTask1(data) {
  return request({
    url: '/task/join1',
    method: 'put',
    data: data
  })
}

//拒绝加入课题
export function unJoinTask1(data) {
  return request({
    url: '/task/unJoin1',
    method: 'put',
    data: data
  })
}

//新增课题
export function addPerformant(data) {
  return request({
    url: '/task/performant',
    method: 'post',
    data: data
  });
}
