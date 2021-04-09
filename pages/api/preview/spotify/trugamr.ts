import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import Templates, { generateImage } from '../../../../lib/templates'

const handler = nc<NextApiRequest, NextApiResponse>().get(async (req, res) => {
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

  const html = await Templates.Blur(data)
  const buffer = await generateImage({ html })

  // Let client know it's a JPEG
  res.setHeader('Cache-Control', 'private')
  res.setHeader('Content-Type', 'image/jpg')
  res.setHeader('Content-Disposition', 'inline')

  // Send image buffer
  res.send(buffer)
})

export default handler
