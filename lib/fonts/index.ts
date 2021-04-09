import fs from 'fs'
import path from 'path'

const FONTS_DIR = path.resolve('.', 'lib', 'fonts')
const MONTSERRAT_DIR = path.join(FONTS_DIR, 'Montserrat')

/*
  100 Thin
  200 Extra Light
  300 Light
  400 Normal
  500 Medium
  600 Semi Bold
  700 Bold
  800 Extra Bold
  900 Ultra Bold
*/

interface LoadedFont {
  fontface: string
}

export const loadFont = async (font: Font): Promise<LoadedFont> => {
  const base64Font = await fs.promises.readFile(font.path, 'base64')

  const fontface = `
    @font-face {
      font-family: ${font.familyName};
      src: url('data:application/font-woff2;charset=utf-8;base64,${base64Font}') format('woff2');
      font-weight: ${font.weight};
      font-style: normal;
      font-display: swap;
    }
  `

  return {
    fontface,
  }
}

export interface Font {
  path: string
  weight: number
  familyName: string
}

interface FontFamily {
  familyName: string
  Normal: Font
}

export const Montserrat: FontFamily = {
  familyName: 'Montserrat',
  Normal: {
    familyName: 'Montserrat',
    path: path.join(MONTSERRAT_DIR, 'Montserrat-Normal.woff2'),
    weight: 400,
  },
}

const Fonts = {
  Montserrat,
}

export default Fonts
