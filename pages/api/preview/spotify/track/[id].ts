import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import Jimp from 'jimp'
import spotify from '../../../../../lib/spotify'
import { Montserrat } from '../../../../../fonts'
import { generateHTML, generateImage } from '../../../../../lib/templates'
import { Blur } from '../../../../../lib/templates/files/blur'

interface SpotifyPreviewData {
  image: string
  title: string
  subtitle: string
}

/**
 * Create image and return buffer from provided data
 */
// const createSpotifyPreview = async (
//   data: SpotifyPreviewData,
// ): Promise<Buffer> => {
//   return image
// }

const handler = nc<NextApiRequest, NextApiResponse>().get(async (req, res) => {
  const trackId = req.query.id as string
  const trackData = await spotify.getTrackDetails(trackId)

  const data = {
    artwork: { url: trackData.album.images[0].url },
    title: { text: trackData.name },
    subtitle: { text: trackData.artists.map(artist => artist.name).join(', ') },
  }

  // const buffer = await createSpotifyPreview(data)

  // Let client know it's a JPEG
  res.setHeader('Cache-Control', 'private')
  res.setHeader('Content-Type', 'image/jpg')
  res.setHeader('Content-Disposition', 'inline')

  const buffer = await generateImage({
    template: Blur,
    values: data,
  })

  // Send image buffer
  res.send(buffer)
})

export default handler
