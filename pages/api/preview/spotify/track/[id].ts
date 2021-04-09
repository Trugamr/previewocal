import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import spotify from '../../../../../lib/spotify'
import Templates, { generateImage } from '../../../../../lib/templates'

const handler = nc<NextApiRequest, NextApiResponse>().get(async (req, res) => {
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

  const html = await Templates.Blur(data)
  const buffer = await generateImage({ html })

  // Send image buffer
  res.send(buffer)
})

export default handler
