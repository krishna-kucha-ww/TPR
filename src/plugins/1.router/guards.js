
export const setupGuards = router => {
  router.beforeEach(to => {
    // Public pages
    if (to.meta.public)
      return

    // Check login
    const isLoggedIn = !!(
      useCookie('userData').value &&
      useCookie('accessToken').value
    )

    // Login/register/forgot-password pages
    if (to.meta.unauthenticatedOnly) {
      if (isLoggedIn)
        return '/dashboards/crm'

      return
    }

    // If page requires login and user is not logged in
    if (!isLoggedIn) {
      return {
        name: 'login',
        query: {
          ...to.query,
          to: to.fullPath !== '/' ? to.path : undefined,
        },
      }
    }
    return
  })
}

