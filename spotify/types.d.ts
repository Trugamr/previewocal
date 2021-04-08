declare interface SpotifyImageDetails {
  height: number
  url: string
  width: number
}

interface SpotifyTractArtistDetails {
  // Update
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  name: string
  type: string
  uri: string
}

declare interface SpotifyTrackDetails {
  album: {
    album_type: 'album'
    artists: [
      {
        external_urls: {
          spotify: 'https://open.spotify.com/artist/7FvX2e6CgYllzgZ9uempWF'
        }
        href: 'https://api.spotify.com/v1/artists/7FvX2e6CgYllzgZ9uempWF'
        id: '7FvX2e6CgYllzgZ9uempWF'
        name: 'Karun'
        type: 'artist'
        uri: 'spotify:artist:7FvX2e6CgYllzgZ9uempWF'
      },
    ]
    available_markets: string[]
    // Update
    external_urls: {
      spotify: string
    }
    href: string
    id: string
    images: SpotifyImageDetails[]
    name: string
    release_date: string // YYYY-MM-DD
    release_date_precision: string // 'day'
    total_tracks: number
    type: string // 'album'
    uri: string
  }
  artists: SpotifyTractArtistDetails[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  // Update
  external_ids: {
    isrc: string
  }
  // Update
  external_urls: {
    spotify: 'string'
  }
  href: string
  id: string
  is_local: boolean
  name: string
  popularity: number
  preview_url: string
  track_number: number
  // Update
  type: string // 'track'
  uri: string
}
