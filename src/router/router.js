export default file => {
  return map[file] || null
}

const map = {
  Layout: () => import('@/layout'),
  error: () => import('@/views/404'),

  'indent': () => import('@/views/indent/index'),
  'returns': () => import('@/views/indent/returns/index'),
  'sales': () => import('@/views/indent/sales/index')


}
