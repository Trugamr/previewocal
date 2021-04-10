import { chromium } from 'playwright'
import axios from 'axios'
import {
  GenerateGenericImage,
  PageEvaluator,
  SpotifyTrackOptions,
  SpotifyTrackTemplate,
} from './types'

const Blur: SpotifyTrackTemplate = {
  path: 'templates/blur/index.html',
  type: 'spotify-track',
}

const _generateGenericImage: GenerateGenericImage = async ({
  evaluator,
  url,
}) => {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto(url)

  if (evaluator) await evaluator(page, context)

  const element = await page.$('.container')
  let image: Buffer
  if (element) image = await element.screenshot()
  else image = await page.screenshot()

  await browser.close()
  return image
}

const imageToBase64 = async (url: string) => {
  const { data, headers } = await axios.get(url, {
    responseType: 'arraybuffer',
  })

  const base64 = `data:${headers[
    'content-type'
  ].toLowerCase()};base64,${Buffer.from(data, 'binary').toString('base64')}`

  return base64
}

export const generateSpotifyTrackImage = async ({
  template,
  options,
}: {
  template: SpotifyTrackTemplate
  options: SpotifyTrackOptions
}): Promise<Buffer> => {
  const evaluator: PageEvaluator = async page => {
    // Convert image to base64 string
    const image = await imageToBase64(options.image)
    options.image = image

    await page.$eval(
      ':root',
      (root, { image, title, subtitle }) => {
        root.style.setProperty('--title', `"${title}"`)
        root.style.setProperty('--subtitle', `"${subtitle}"`)
        root.style.setProperty('--image', `url(${image})`)
      },
      options,
    )
  }

  const image = await _generateGenericImage({
    url: `${options.host}/${template.path}`,
    evaluator,
  })

  return image
}

// export const generateImage: GenerateImage = ({options, template}) => {
// if(options.tr)
// }

const Templates = {
  Spotify: {
    Track: {
      Blur,
    },
  },
}

export default Templates
