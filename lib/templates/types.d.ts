declare interface ScreenshotOptions {
  omitBackground?: boolean
  path?: string
  quality?: number
  timeout?: number
  type?: 'png' | 'jpeg'
}

declare interface Template {
  default: Object
  markup: string
}
