import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import Jimp from 'jimp'
import spotify from '../../../../spotify'
import { Montserrat } from '../../../../fonts'

interface SpotifyPreviewData {
  image: string
  title: string
  subtitle: string
}

/**
 * Create image and return buffer from provided data
 */
const createSpotifyPreview = async (
  data: SpotifyPreviewData,
): Promise<Buffer> => {
  const imageSize = 512
  const padding = 25
  const spacing = 8
  const artworkSize = 0.75 * imageSize

  const artwork = await Jimp.read(data.image)
  const image = new Jimp(artwork)

  // Resize main image and artwork
  image.resize(imageSize, Jimp.AUTO).brightness(-0.75).blur(5)
  artwork.resize(artworkSize, Jimp.AUTO)

  // Artwork
  image.composite(artwork, padding, padding)

  // Title
  let font = await Jimp.loadFont(Montserrat.WHITE.MEDIUM[24])
  const title = {
    text: data.title.replace(/(.{30})..+/, '$1...'),
    font,
    x: padding,
    y: padding + artworkSize + spacing,
  }
  image.print(title.font, title.x, title.y, title.text)

  // Subtitle
  font = await Jimp.loadFont(Montserrat.WHITE.MEDIUM[18])
  const subtitle = {
    text: data.subtitle.replace(/(.{40})..+/, '$1...'),
    font,
    x: padding,
    y:
      title.y +
      Jimp.measureTextHeight(title.font, title.text, imageSize - 2 * padding) +
      spacing,
  }
  image.print(subtitle.font, subtitle.x, subtitle.y, subtitle.text)

  const buffer = await image.getBufferAsync(Jimp.MIME_JPEG)
  return buffer
}

const handler = nc<NextApiRequest, NextApiResponse>().get(async (req, res) => {
  const trackId = req.query.id as string
  const trackData = await spotify.getTrackDetails(trackId)
  const image = trackData.album.images[0].url

  const data = {
    title: trackData.name,
    albumName: trackData.album,
    subtitle: trackData.artists.map(artist => artist.name).join(', '),
    image,
  }

  const buffer = await createSpotifyPreview(data)

  // Let client know it's a JPEG
  res.setHeader('Cache-Control', 'private')
  res.setHeader('Content-Type', 'image/jpg')
  res.setHeader('Content-Disposition', 'inline')

  // Send image buffer
  res.send(buffer)
})

export default handler
