import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import Jimp from 'jimp'
import { Montserrat } from '../../../../utils/fonts'

const createSpotifyPreview = async (): Promise<Buffer> => {
  const data = {
    name: 'Tokyo',
    albumName: 'Universe of the Past',
    artists: ['LXST CXNTURY'],
    image: 'https://i.scdn.co/image/ab67616d0000b273d7859b708f662c3018f213b8',
  }

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
    text: data.name.replace(/(.{30})..+/, '$1...'),
    font,
    x: padding,
    y: padding + artworkSize + spacing,
  }
  image.print(title.font, title.x, title.y, title.text)

  // Subtitle
  font = await Jimp.loadFont(Montserrat.WHITE.MEDIUM[18])
  const subtitle = {
    text: data.artists.join(', ').replace(/(.{40})..+/, '$1...'),
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
  const buffer = await createSpotifyPreview()

  // Let client know it's a JPEG
  res.setHeader('Cache-Control', 'private')
  res.setHeader('Content-Type', 'image/jpg')
  res.setHeader('Content-Disposition', 'inline')

  // Send image buffer
  res.send(buffer)
})

export default handler
