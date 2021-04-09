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

export interface Font<W = number> {
  path: string
  weight: W
  familyName: string
}

interface FontFamily {
  familyName: string
  Light?: Font<300>
  Normal?: Font<400>
  Medium?: Font<500>
  SemiBold?: Font<600>
  Bold?: Font<700>
}

export const Montserrat: FontFamily = {
  familyName: 'Montserrat',
  Light: {
    familyName: 'Montserrat',
    path: path.join(MONTSERRAT_DIR, 'Montserrat-Light.woff2'),
    weight: 300,
  },
  Normal: {
    familyName: 'Montserrat',
    path: path.join(MONTSERRAT_DIR, 'Montserrat-Normal.woff2'),
    weight: 400,
  },
  Medium: {
    familyName: 'Montserrat',
    path: path.join(MONTSERRAT_DIR, 'Montserrat-Medium.woff2'),
    weight: 500,
  },
  SemiBold: {
    familyName: 'Montserrat',
    path: path.join(MONTSERRAT_DIR, 'Montserrat-SemiBold.woff2'),
    weight: 600,
  },
  Bold: {
    familyName: 'Montserrat',
    path: path.join(MONTSERRAT_DIR, 'Montserrat-Bold.woff2'),
    weight: 700,
  },
}

const Fonts = {
  Montserrat,
}

export default Fonts
