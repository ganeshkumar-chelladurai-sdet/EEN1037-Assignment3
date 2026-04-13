// API client — Axios instance with JWT (JSON Web Token) authentication
// JWTs are signed tokens that the server issues and the client sends back to prove identity.
//
// JWT token lifecycle:
// 1. User logs in → server returns access token (short-lived) + refresh token (long-lived)
// 2. Every API request sends the access token in the Authorization header
// 3. When the access token expires (401), the refresh token is used to get a new one
// 4. If the refresh also fails, the user is logged out
//
// Tokens are stored in sessionStorage (cleared when the browser tab closes).

import axios from 'axios'


// JWT sessionStorage functions

const JWT_TOKEN_KEY = 'auth_tokens'

function getJwtTokens() {
  return JSON.parse(sessionStorage.getItem(JWT_TOKEN_KEY))
}

export function saveJwtTokens(access, refresh) {
  sessionStorage.setItem(JWT_TOKEN_KEY, JSON.stringify({ access, refresh }))
}

export function clearJwtTokens() {
  sessionStorage.removeItem(JWT_TOKEN_KEY)
}

export function hasJwtTokens() {
  return sessionStorage.getItem(JWT_TOKEN_KEY) !== null
}


// Axios API client instance with JWT bearer tokens

const api = axios.create({
  // baseURL: 'http://127.0.0.1:8000',
  // baseURL: 'https://api.example.com',
})

api.interceptors.request.use((config) => {
  const tokens = getJwtTokens()
  if (tokens?.access) {
    config.headers.Authorization = `Bearer ${tokens.access}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const original = error.config

    // On 401, attempt one JWT token refresh then retry
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const tokens = getJwtTokens()
      if (tokens?.refresh) {
        try {
          const { data } = await axios.post('/api/auth/token/refresh/', {
            refresh: tokens.refresh,
          })
          saveJwtTokens(data.access, data.refresh || tokens.refresh)
          return api(original)
        } catch {
          clearJwtTokens()
        }
      }
    }

    // Build error from common error fieldnames in response body
    const data = error.response?.data
    const err = new Error(data?.detail || data?.error || error.message)
    err.status = error.response?.status
    err.data = data
    throw err
  }
)

/**
 * Download a file from a URL in Javascript.
 * Works with any downloadable file URL (e.g. S3 URLs, external CDNs, Resources,).
 */
async function downloadFile(url, headers = {}) {
  // Fetch the file, using additional headers if provided (e.g. auth tokens, content type)
  const response = await fetch(url, { headers })
  if (!response.ok) throw new Error('Download failed')
  // Get filename from the Content-Disposition header (e.g. set by Django's FileResponse)
  // or default to "download"
  const disposition = response.headers.get('Content-Disposition') || ''
  const filename = disposition.match(/filename="?(.+?)"?$/)?.[1] || 'download'
  // Create a temporary buffer URL for the file contents
  const blobUrl = URL.createObjectURL(await response.blob())
  // Trigger a browser handled download by creating a temporary link and clicking it
  const a = document.createElement('a')
  a.href = blobUrl
  a.download = filename
  a.click()
  // Free temporary buffer memory
  URL.revokeObjectURL(blobUrl)
}

/** Download a file from an API endpoint, with JWT authentication. */
api.download = function (url) {
  return downloadFile(url, { Authorization: `Bearer ${getJwtTokens()?.access}` })
}

export default api
