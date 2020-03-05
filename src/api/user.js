import request from '@/utils/request'
import {
  getToken
} from '@/utils/auth'
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
      'authorization': getToken('rx'),
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
      'authorization': getToken('rx'),
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
      'authorization': getToken('rx'),
    },
    url: '/user/changePassword',
    method: 'put',
    data
  })
}
