import { setupLayouts } from 'virtual:meta-layouts'
import { createRouter, createWebHistory } from 'vue-router/auto'
import { redirects, routes } from './additional-routes'
import { customRedirects, customRoutes } from './custom-routes'
import { setupGuards } from './guards'
import { mergeRoutes } from './merge-routes'

function recursiveLayouts(route) {
  if (route.children) {
    for (let i = 0; i < route.children.length; i++)
      route.children[i] = recursiveLayouts(route.children[i])
    
    return route
  }
  
  return setupLayouts([route])[0]
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to) {
    if (to.hash)
      return { el: to.hash, behavior: 'smooth', top: 60 }
    
    return { top: 0 }
  },

  // Routes declared in `custom-routes.js` override the file-based pages and
  // the template routes. See ./merge-routes.js for the precedence rules.
  extendRoutes: pages => mergeRoutes({
    pages,
    templateRoutes: routes,
    templateRedirects: redirects,
    customRoutes,
    customRedirects,
    applyLayouts: recursiveLayouts,
  }),
})

setupGuards(router)
export { router }
export default function (app) {
  app.use(router)
}
