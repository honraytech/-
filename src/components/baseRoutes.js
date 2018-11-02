import Home from './Home.vue'
import reload from './reload.vue'

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/',
    component: Home,
    children: [
      { path: 'reload', component: reload, name: 'reload', meta: { hideLeft: '', module: '', menu: 'reload' }}
    ]
  }
]
export default routes
