import lodash from 'lodash'
import Fonts, { Font, loadFont } from '../../fonts'

interface BlurTemplateOptions {
  image: string
  title: string
  subtitle: string
  theme?: {
    customCss?: string
    size?: number
    padding?: number
    spacing?: number
    image?: {
      scale?: number
    }
    title?: {
      color?: 'white'
      size?: number
    }
    subtitle?: {
      color?: string
      size?: number
    }
  }
  fonts?: Array<Font>
}

const defaultOptions: BlurTemplateOptions = {
  image: 'https://i.scdn.co/image/ab67616d0000b2733385fcb5234eb2a4d4a79f8d',
  title: 'ANIME',
  subtitle: 'JOY.',
  theme: {
    customCss: '',
    size: 512,
    padding: 25,
    spacing: 6,
    image: {
      scale: 0.72,
    },
    title: {
      color: 'white',
      size: 32,
    },
    subtitle: {
      color: 'rgba(255, 255, 255, 0.8)',
      size: 22,
    },
  },
  fonts: [Fonts.Montserrat.Normal, Fonts.Montserrat.SemiBold],
}

const Blur = async (options: BlurTemplateOptions): Promise<string> => {
  const { title, subtitle, image, theme, fonts } = lodash.merge(
    defaultOptions,
    options,
  )

  let fontfaces = ''
  if (fonts) {
    const fontPromises = fonts.map(loadFont)
    const loadedFonts = await Promise.all(fontPromises)

    for (const { fontface } of loadedFonts) {
      fontfaces += `${fontface}\n`
    }
  }

  const markup = `
    <html>
    <head>
      <style>      
        :root {
          --size: ${theme.size}px; 
          --padding: ${theme.padding}px; 
          --artwork: url('${image}');
          --artwork-relative-scale: ${theme.image.scale}; 
          --title-color: ${theme.title.color};
          --title-size: ${theme.title.size}px;
          --subtitle-color:  ${theme.subtitle.color}; 
          --subtitle-size: ${theme.subtitle.size};
          --spacing: ${theme.spacing}; 
        }

        ${fontfaces}

        * {
          margin: 0;
          padding: 0;
        }
    
        html,
        body {
          width: var(--size);
          height: var(--size);
          overflow: hidden;
          font-family: 'Montserrat';
        }
    
        .container {
          width: 100%;
          height: 100%;
          position: relative;
          background-size: cover;
          background-image: var(--artwork);
        }
    
        .container::before {
          content: '';
          position: absolute;
          background-color: rgba(0, 0, 0, 0.8);
          width: 100%;
          height: 100%;
          -webkit-backdrop-filter: blur(5px);
          backdrop-filter: blur(5px);
          pointer-events: none;
        }
    
        .wrapper {
          padding: 25px;
          position: absolute;
          height: calc(100% - 2 * var(--padding));
          width: calc(100% - 2 * var(--padding));
        }
    
        .artwork {
          width: calc(var(--artwork-relative-scale) * var(--size));
          height: calc(var(--artwork-relative-scale) * var(--size));
          background-size: cover;
          background-image: var(--artwork);
          margin-bottom: var(--spacing);
        }

        .title, .subtitle {
          width: 75%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
    
        .title {
          font-size: var(--title-size);
          color: var(--title-color);
          margin-bottom: var(--spacing);
          font-weight: 600;
        }
    
        .subtitle {
          font-size: var(--subtitle-size);
          color: var(--subtitle-color);
          width: 60%;
        }

        ${theme.customCss}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="dark-overlay"></div>
        <div class="wrapper">
          <div class="artwork"></div>
          <p class="title">${title}</p>
          <p class="subtitle">${subtitle}</p>
        </div>
      </div>
    </body>
    </html> 
  `

  return markup
}

export default Blur
