import { NextApiRequest, NextApiResponse } from 'next'
import absoluteUrl from 'next-absolute-url'
import nc from 'next-connect'
import { chromium } from 'playwright'

type GenerateImage = ({
  templateUrl,
  values,
  snap,
}: {
  templateUrl: string
  snap: string
  values?: {
    css?: {
      vars?: {
        [k in string]: string | number
      }
    }
  }
}) => Promise<Buffer>

const generateImage: GenerateImage = async ({ templateUrl, snap, values }) => {
  const screenshotOptions: ScreenshotOptions = {
    path: 'example.jpg',
    type: 'jpeg',
    quality: 100,
  }

  const browser = await chromium.launch({ headless: false, devtools: true })
  const page = await browser.newPage()
  await page.goto(templateUrl)

  if (values.css.vars) {
    const vars = Object.entries(values.css.vars)
    await page.$eval(
      ':root',
      (root, vars) => {
        for (const [name, value] of vars) {
          root.style.setProperty(name, value.toString())
        }
      },
      vars,
    )
  }

  const element = await page.$(snap)

  let image: Buffer
  if (element === null) {
    image = await page.screenshot(screenshotOptions)
  } else {
    image = await element.screenshot(screenshotOptions)
  }

  await browser.close()

  return image
}

const handler = nc<NextApiRequest, NextApiResponse>().get(async (req, res) => {
  const { origin } = absoluteUrl(req)

  const image = await generateImage({
    templateUrl: `${origin}/templates/blur/index.html`,
    snap: '.container',
    values: {
      css: {
        vars: {
          '--title': '"Rainbow 🌈"',
          '--subtitle': '"Sunshine 🌞"',
        },
      },
    },
  })

  // Let client know it's a JPEG
  res.setHeader('Cache-Control', 'private')
  res.setHeader('Content-Type', 'image/jpg')
  res.setHeader('Content-Disposition', 'inline')

  // Send image buffer
  res.send(image)
})

export default handler
