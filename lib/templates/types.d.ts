import { Browser, BrowserContext, Page } from 'playwright'

declare interface ScreenshotOptions {
  omitBackground?: boolean
  path?: string
  quality?: number
  timeout?: number
  type?: 'png' | 'jpeg'
}

type TemplateTypes = 'spotify-track'

type TemplateOptions<T = void> = {
  host: string
} & T

interface Template {
  type: TemplateTypes
  path: string
}

type SpotifyTrackOptions = TemplateOptions<{
  image: string
  title: string
  subtitle: string
}>

interface SpotifyTrackTemplate extends Template {}

type GenerateImageOptions = {
  template: SpotifyTrackTemplate
  options: SpotifyTrackOptions
}

type GenerateImage = (options: GenerateImageOptions) => Promise<Buffer>

type PageEvaluator = (page: Page, context: BrowserContext) => Promise<void>

type GenerateGenericImage = (options: {
  evaluator?: PageEvaluator
  url: string
}) => Promise<Buffer>
