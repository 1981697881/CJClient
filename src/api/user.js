import request from '@/utils/request'
import {
  getToken
} from '@/utils/auth'
// 下拉平台
export function getPlas(data) {
  const url = '/Admin/pla/list'
  return request({
    headers: {
      'authorization': getToken('clrx')
    },
    url: url,
    method: 'get'
  })
}

export function login(data) {
  return request({
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*'
    },
    url: '/user/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getInfo(fid) {
  return request({
    url: '/user/getUserInfo',
    headers: {
      'authorization': getToken('clrx'),
      'Content-Type': 'application/json'
    },
    method: 'put',
  })
}
// 获取用户信息
export function getPermissions() {
  return request({
    url: '/cjsh-permission/getPermissions',
    headers: {
      'authorization': getToken('clrx'),
    },
    method: 'get',
  })
}
export function logout(data) {
  return request({
    url: '/back/system/user/login_out.do',
    method: 'post',
  })
}
//修改密码
export function changePassword(data) {
  return request({
    headers: {
      'Content-Type': 'application/json',
      'authorization': getToken('clrx'),
    },
    url: '/user/changePassword',
    method: 'put',
    data
  })
}
