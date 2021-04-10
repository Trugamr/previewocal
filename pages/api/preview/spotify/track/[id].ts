import { NextApiResponse } from 'next'
import nc from 'next-connect'
import spotify from '../../../../../lib/spotify'
import Templates, {
  generateSpotifyTrackImage,
} from '../../../../../lib/templates'
import { ExtendedNextApiRequest, injectOrigin } from '../../../../../utils/api'

const handler = nc<ExtendedNextApiRequest, NextApiResponse>()
  .use(injectOrigin)
  .get(async (req, res) => {
    // Let client know it's a JPEG
    res.setHeader('Cache-Control', 'private')
    res.setHeader('Content-Type', 'image/jpg')
    res.setHeader('Content-Disposition', 'inline')

    const trackId = req.query.id as string
    const trackData = await spotify.getTrackDetails(trackId)

    const data = {
      image: trackData.album.images[0].url,
      title: trackData.name,
      subtitle: trackData.artists.map(artist => artist.name).join(', '),
    }

    const image = await generateSpotifyTrackImage({
      template: Templates.Spotify.Track.Blur,
      options: {
        host: req.origin,
        ...data,
      },
    })

    // Send image buffer
    res.send(image)
  })

export default handler
