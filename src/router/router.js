export default file => {
  return map[file] || null
}

const map = {
  Layout: () => import('@/layout'),
  error: () => import('@/views/404'),
  '/indent': () => import('@/layout'), // 1 - 物业管理

  'clientlist': () => import('@/views/indent/sales/index'), // 3 - 物业管理/客户管理 - 客户资料



}
