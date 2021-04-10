import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'
import absoluteUrl from 'next-absolute-url'
import nc, { Middleware } from 'next-connect'
import Templates, { generateSpotifyTrackImage } from '../../../../lib/templates'

interface ExtendedNextApiRequest extends NextApiRequest {
  protocol: string
  host: string
  origin: string
}

const injectOrigin: Middleware<ExtendedNextApiRequest, NextApiResponse> = (
  req,
  res,
  next,
) => {
  const { protocol, host, origin } = absoluteUrl(req)

  req.protocol = protocol
  req.host = host
  req.origin = origin

  next()
}

const handler = nc<ExtendedNextApiRequest, NextApiResponse>()
  // .use(injectOrigin)
  .get(async (req, res) => {
    const {
      data: { data: trackData },
    } = await axios.get<{
      data:
        | { isOffline: true }
        | {
            isOffline: false
            name: string
            images: { url: string }[]
            artists: { name: string }[]
          }
    }>('https://trugamr.codes/api/spotify')

    const data = {
      image: 'https://i.imgur.com/t0L63tY.jpeg',
      title: 'Error 🌊🌸',
      subtitle: 'Offline',
    }

    if (trackData.isOffline === false) {
      data.image = trackData.images[0].url
      data.title = trackData.name
      data.subtitle = trackData.artists.map(({ name }) => name).join(', ')
    }

    const buffer = await generateSpotifyTrackImage({
      template: Templates.Spotify.Track.Blur,
      options: {
        host: absoluteUrl(req).host,
        ...data,
      },
    })

    // Let client know it's a JPEG
    res.setHeader('Cache-Control', 'private')
    res.setHeader('Content-Type', 'image/jpg')
    res.setHeader('Content-Disposition', 'inline')

    // Send image buffer
    res.send(buffer)
  })

export default handler
