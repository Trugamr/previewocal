import axios from 'axios'
import { Browser } from 'puppeteer'
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

const getBrowser = async (): Promise<Browser> => {
  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    // running on the Vercel platform.
    const chromium = require('chrome-aws-lambda')
    const browser: Promise<Browser> = chromium.puppeteer.launch({
      args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    })
    return browser
  } else {
    // running locally.
    const puppeteer = require('puppeteer')
    const browser: Promise<Browser> = puppeteer.launch({
      headless: true,
    })
    return browser
  }
}

const _generateGenericImage: GenerateGenericImage = async ({
  evaluator,
  url,
}) => {
  console.time('done')

  const browser = await getBrowser()

  const page = await browser.newPage()
  await page.goto(url)

  if (evaluator) await evaluator(page)

  const element = await page.$('.container')
  let image: Buffer

  if (element) image = (await element.screenshot({})) as Buffer
  else image = (await page.screenshot()) as Buffer

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
