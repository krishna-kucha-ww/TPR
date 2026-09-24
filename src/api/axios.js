import axios from 'axios'

const api = axios.create({
  baseURL: 'http://192.168.1.24:9001/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor
api.interceptors.request.use(
  config => {
    const accessToken = useCookie('accessToken').value

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  error => Promise.reject(error),
)

// Response Interceptor
api.interceptors.response.use(
  response => response,

  async error => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        console.log('Access Token Expired')
        console.log('Calling Refresh Token API...')

        const refreshToken = useCookie('refreshToken').value

        if (!refreshToken) {
          throw new Error('Refresh token not found')
        }

        const refreshResponse = await axios.post(
          'http://192.168.1.24:9001/api/v1/auth/refresh/',
          {
            refresh: refreshToken,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        console.log('Refresh API Response')
        console.log(refreshResponse.data)

        const newAccessToken = refreshResponse.data.access

        useCookie('accessToken').value = newAccessToken

        console.log('New Access Token Saved')

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`

        return api(originalRequest)
      }
      catch (refreshError) {
        console.log('Refresh Token Failed')

        useCookie('accessToken').value = null
        useCookie('refreshToken').value = null
        useCookie('userData').value = null
        useCookie('userAbilityRules').value = null

        window.location.href = '/auth/login'

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default api
