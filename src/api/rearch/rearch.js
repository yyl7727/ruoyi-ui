import request from '@/utils/request'

//新增助研信息
export function addRearch(data) {
  return request({
    url: '/rearch/add',
    method: 'post',
    data: data
  });
}
