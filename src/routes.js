import baseRoutes from './components/baseRoutes'
import noFoundRoutes from './noFoundRoutes'

let routes = []
routes = routes.concat(baseRoutes)
               .concat(noFoundRoutes)

export default routes
