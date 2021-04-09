import Blur from './blur'
import { chromium } from 'playwright'

const screenshotOptions: ScreenshotOptions = {
  type: 'jpeg',
  quality: 100,
  omitBackground: true,
}

interface GenerateImageOptions {
  html: string
  elementToCapture?: string
}

export const generateImage = async <T>(
  options: GenerateImageOptions,
): Promise<Buffer> => {
  const { html, elementToCapture } = options
  const elementSelector = elementToCapture ?? '.container'

  console.time('done')

  const browser = await chromium.launch({
    headless: true,
  })

  const page = await browser.newPage()

  await page.setContent(html)
  const element = await page.$(elementSelector)

  let image: Buffer
  if (element) {
    image = await element.screenshot(screenshotOptions)
  } else {
    image = await page.screenshot(screenshotOptions)
  }

  await browser.close()

  console.timeEnd('done')

  return image
}

const Templates = {
  Blur,
}

export default Templates
