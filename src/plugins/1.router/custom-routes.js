/**
 * 👉 Custom application routes
 *
 * This is YOUR routes file. Define every hand-written route of the app here.
 * `additional-routes.js` belongs to the template — leave it alone so template
 * updates stay easy to merge.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * How it plays with the file-based (auto) routes
 * ────────────────────────────────────────────────────────────────────────────
 * Pages under `src/pages` are turned into routes automatically by
 * unplugin-vue-router. Anything you declare in `customRoutes` below OVERRIDES
 * the generated route when it reuses the same `name` or the same `path`
 * (see `extendRoutes` in ./index.js). So to give a page a brand new URL you
 * keep its `name` and change its `path` — every `:to="{ name: '...' }"` link
 * in the app keeps working, no link hunting required.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * Route shape cheat-sheet
 * ────────────────────────────────────────────────────────────────────────────
 * {
 *   path: '/my/url/:id',                // `:id` => dynamic segment
 *   name: 'my-route',                   // used by :to="{ name: 'my-route' }"
 *   component: () => import('@/pages/my-page.vue'),   // lazy loaded
 *   meta: {
 *     layout: 'blank',                  // 'default' | 'blank' (src/layouts)
 *     public: true,                     // skip ALL auth checks
 *     unauthenticatedOnly: true,        // logged-in users get bounced to '/'
 *     action: 'read', subject: 'Auth',  // CASL permissions (see @layouts/plugins/casl)
 *     navActiveLink: 'other-route',     // which nav item lights up
 *   },
 * }
 */

// 👉 Auth pages — grouped under `/auth/*`
// Names stay the same (`login`, `register`, `forgot-password`) so existing
// links and the router guards keep resolving; only the URLs changed.
const authRoutes = [
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('@/auth/login.vue'),
    meta: {
      layout: 'blank',
      unauthenticatedOnly: true,
    },
  },
  {
    path: '/auth/account',
    name: 'account',
    component: () => import('@/auth/account.vue'),
    meta: {
      layout: 'default',
    },
  },
  {
    path: '/auth/change-password',
    name: 'change-password',
    component: () => import('@/auth/change-password.vue'),
    meta: {
      layout: 'default',
    },
  },
  {
    path: '/auth/register',
    name: 'register',
    component: () => import('@/pages/register.vue'),
    meta: {
      layout: 'blank',
      unauthenticatedOnly: true,
    },
  },
  {
    path: '/auth/forgot-password',
    name: 'forgot-password',
    component: () => import('@/pages/forgot-password.vue'),
    meta: {
      layout: 'blank',
      unauthenticatedOnly: true,
    },
  },
]

// 👉 Your feature routes
// Add new application routes here.
const appRoutes = [
  // {
  //   path: '/my-feature/:id',
  //   name: 'my-feature-detail',
  //   component: () => import('@/pages/my-feature/detail.vue'),
  //   meta: { action: 'read', subject: 'MyFeature' },
  // },
]

/**
 * 👉 Redirects
 * Kept ahead of every other route, so they win on an exact path match.
 * Useful to keep old/bookmarked URLs alive after a rename.
 */
export const customRedirects = [
  { path: '/login', redirect: to => ({ name: 'login', query: to.query }) },
  { path: '/account', redirect: to => ({ name: 'account', query: to.query }) },
  { path: '/register', redirect: to => ({ name: 'register', query: to.query }) },
  { path: '/change-password', redirect: to => ({ name: 'change-password', query: to.query }) },
  { path: '/forgot-password', redirect: to => ({ name: 'forgot-password', query: to.query }) },
]

export const customRoutes = [
  ...authRoutes,
  ...appRoutes,
]
