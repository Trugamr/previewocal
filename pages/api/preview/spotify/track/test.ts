import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import Jimp from 'jimp'
import spotify from '../../../../../lib/spotify'
import { chromium } from 'playwright'

/**
 * Create image and return buffer from provided data
 */
const createImage = async (): Promise<Buffer> => {
  const browser = await chromium.launch({
    headless: true,
  })

  const context = await browser.newContext({
    viewport: {
      height: 512,
      width: 512,
    },
  })

  const page = await context.newPage()

  await page.goto('https://time.is/')

  const image = await page.screenshot({
    path: 'example.jpg',
    type: 'jpeg',
    quality: 100,
    omitBackground: true,
  })

  await browser.close()

  return image
}

const handler = nc<NextApiRequest, NextApiResponse>().get(async (req, res) => {
  const buffer = await createImage()

  // Let client know it's a JPEG
  res.setHeader('Cache-Control', 'private')
  res.setHeader('Content-Type', 'image/jpg')
  res.setHeader('Content-Disposition', 'inline')

  // Send image buffer
  res.send(buffer)
})

export default handler
