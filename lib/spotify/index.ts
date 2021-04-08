import axios from 'axios'
import { createRef } from 'react'

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env

// Refresh and update CACHED_SPOTIFY_ACCESS_TOKEN and spotify instance headers whenever request fails
let CACHED_ACCESS_TOKEN = undefined
const spotify = axios.create({
  baseURL: 'https://api.spotify.com/v1',
  headers: {
    Authorization: `Bearer ${CACHED_ACCESS_TOKEN}`,
  },
})

interface RefreshTokenData {
  access_token: string
  token_type: string
  expires_in: number
}

const refreshAccessToken = async (): Promise<RefreshTokenData> => {
  // Prepare authroization header in format "Basic <base64 encoded client_id:client_secret>"
  const base64Data = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
  ).toString('base64')
  const authorization = `Basic ${base64Data}`
  const params = new URLSearchParams() // or use qs.stringify(data)
  params.append('grant_type', 'client_credentials')

  // Request access token
  const { data } = await axios.post<RefreshTokenData>(
    'https://accounts.spotify.com/api/token',
    params,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        authorization,
      },
    },
  )

  return data
}

/**
 * Interceptor to refresh token and retry request on failure
 */
spotify.interceptors.response.use(
  response => response,
  async error => {
    if (error.response.status === 401) {
      console.log('REFRESHING TOKEN')

      // Try refreshing token
      const tokenData = await refreshAccessToken()

      // Update token variable and in spotify axios instance
      CACHED_ACCESS_TOKEN = tokenData.access_token

      // Set auth header for spotify axios instance
      spotify.defaults.headers[
        'Authorization'
      ] = `Bearer ${CACHED_ACCESS_TOKEN}`

      // Retry request
      error.response.config.headers[
        'Authorization'
      ] = `Bearer ${tokenData.access_token}`
      return Promise.resolve(axios(error.response.config))
    }

    return Promise.reject(error)
  },
)

/**
 * Fetch spotify track details
 */
const getTrackDetails = async (trackId: string) => {
  const { data } = await spotify.get<SpotifyTrackDetails>(`/tracks/${trackId}`)

  return data
}

export default {
  getTrackDetails,
}
