import request from '@/utils/request'; // 引入封装好的axios请求
import {
  getToken
} from '@/utils/auth' // get token from cookie
// 查询订单列表
export function returnsList(data) {
  const url = '/returnOrder/list/' + data.pageNum + '/' + data.pageSize
  return request({
    headers: {
      'authorization': getToken('rx'),
    },
    url: url,
    method: 'get',
  })
}

// 保存退货
export function saveReturn(data) {
  const url = '/returnOrder/add'
  return request({
    headers: {
      'authorization': getToken('rx'),
      'Content-Type': 'application/json'
    },
    url: url,
    method: 'post',
    data: data
  })
}
// 修改 保存退货
export function alterReturn(data) {
  const url = '/returnOrder/update'
  return request({
    headers: {
      'authorization': getToken('rx'),
      'Content-Type': 'application/json'
    },
    url: url,
    method: 'put',
    data: data
  })
}
// 删除订单
export function delReturnOrder(data) {
  const url = '/returnOrder/del/' + data
  return request({
    headers: {
      'authorization': getToken('rx'),
    },
    url: url,
    method: 'delete',
  })
}
// 修改 根据id查询
export function getReturnOrder(data) {
  const url = '/returnOrder/getById/' + data
  return request({
    headers: {
      'authorization': getToken('rx'),
    },
    url: url,
    method: 'get',
  })
}
// 图片上传
export function uploadImgs(data) {
  const url = '/file/returnOrder/imgUpload'
  return request({
    headers: {
      'authorization': getToken('rx'),
      'Content-Type': 'multipart/form-data'
    },
    url: url,
    method: 'post',
    data
  })
}
// 根据id查询
export function getOrderGoodsById(data) {
  const url = '/returnOrder/getOrderGoodsById/' + data
  return request({
    headers: {
      'authorization': getToken('rx'),
    },
    url: url,
    method: 'get',
  })
}

