import noFound from './components/404.vue'

const router = [
  {
    path: '/*',
    component: noFound,
    name: 'noFound'
  }
]
export default router
