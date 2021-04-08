import { Blur } from './files/blur'
import { flatten, replaceTokens } from './utils'
import lodash from 'lodash'
import { chromium } from 'playwright'

const screenshotOptions: ScreenshotOptions = {
  type: 'jpeg',
  quality: 100,
  omitBackground: true,
}

export const generateHTML = (template: Template, values: Object) => {
  const mergedValues = lodash.merge(template.default, values)
  const flatObject = flatten(mergedValues)
  const html = replaceTokens(template.markup, flatObject)
  return html
}

interface GenerateImageOptions {
  template: Template
  values: Object
}

export const generateImage = async (
  options: GenerateImageOptions,
): Promise<Buffer> => {
  const { template, values } = options

  const browser = await chromium.launch({
    headless: false,
  })

  const page = await browser.newPage()

  const html = generateHTML(template, values)
  await page.setContent(html)

  const element = await page.$('.container')

  let image: Buffer

  if (element) {
    image = await element.screenshot(screenshotOptions)
  } else {
    image = await page.screenshot(screenshotOptions)
  }

  // await browser.close()

  return image
}

export default {
  Blur,
}
