import request from '@/utils/request'; // 引入封装好的axios请求
import {
  getToken
} from '@/utils/auth' // get token from cookie
// 查询订单列表
export function salesList(data, query) {
  const url = '/order/list/' + data.pageNum + '/' + data.pageSize + '/'
  return request({
    headers: {
      'authorization': getToken('rx'),
    },
    url: url,
    method: 'get',
    params: query
  })
}
// 查询订单列表2
export function salesListT(data, query) {
  const url = '/order/list/' + data.pageNum + '/' + data.pageSize
  return request({
    headers: {
      'authorization': getToken('rx'),
      'Content-Type': 'application/json'
    },
    url: url,
    method: 'post',
    data: query
  })
}
// 获取订单单号
export function getOrderNum() {
  const url = '/order/getOrderNum';
  return request({
    headers: {
      'authorization': getToken('rx'),
    },
    url: url,
    method: 'get',
  })
}
// 获取库存
export function stockList(data, query) {
  // 查询分页数据
  const url = '/cjsh-stock-info/list/' + data.pageNum + '/' + data.pageSize
  return request({
    headers: {
      'authorization': getToken('rx'),
      'Content-Type': 'application/json'
    },
    url: url,
    method: 'post',
    data: query
  })
}
// 获取仓库下拉
export function getWarehouse() {
  const url = '/warehouse/list';
  return request({
    headers: {
      'authorization': getToken('rx'),
    },
    url: url,
    method: 'get',
  })
}
// 保存单据
export function saveSale(data) {
  const url = '/order/add'
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
// 修改保存单据
export function updateSale(data) {
  const url = '/order/update'
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
// 根据id查询单据详情
export function saleInfo(data) {
  const url = '/order/getOrderGoodsById/' + data
  return request({
    headers: {
      'authorization': getToken('rx'),
    },
    url: url,
    method: 'get',
  })
}
// 根据单号查询单据详情
export function getSaleOrder(data) {
  const url = '/order/getByOrderNum/' + data
  return request({
    headers: {
      'authorization': getToken('rx'),
    },
    url: url,
    method: 'get',
  })
}
// 删除订单
export function delSaleOrder(data) {
  const url = '/order/del/' + data
  return request({
    headers: {
      'authorization': getToken('rx'),
    },
    url: url,
    method: 'delete',
  })
}
// 确认订单
export function confirmSaleOrder(data) {
  const url = '/order/confirm/' + data
  return request({
    headers: {
      'authorization': getToken('rx')
    },
    url: url,
    method: 'post',
  })
}
// 导出待选区订单
export function exportorder(data) {
  const url = '/excel/export/order'
  return request({
    headers: {
      'authorization': getToken('rx'),
      'Content-Type': 'application/json'
    },
    responseType: 'blob',
    url: url,
    method: 'post',
    data: data
  })
}
// 下拉平台
export function getPlas(data) {
  const url = '/Admin/pla/list'
  return request({
    headers: {
      'authorization': getToken('rx')
    },
    url: url,
    method: 'get'
  })
}
// 导出订单明细
export function exportData(data) {
  const url = '/excel/export/orderData'
  return request({
    headers: {
      'authorization': getToken('rx'),
      'Content-Type': 'application/json'
    },
    responseType: 'blob',
    url: url,
    method: 'post',
    data: data
  })
}

