export const Blur: Template = {
  default: {
    size: 512,
    padding: 25,
    artwork: {
      url: 'https://i.scdn.co/image/ab67616d0000b2733385fcb5234eb2a4d4a79f8d',
      scale: 0.72,
    },
    title: {
      text: 'ANIME',
      color: 'white',
      size: 32,
    },
    subtitle: {
      text: 'JOY.',
      color: 'white',
      size: 24,
    },
    spacing: 8,
  },
  markup: `
  <html>
  <head>
    <style>
      :root {
        --size: $(size)px; 
        --padding: $(padding)px; 
        --artwork: url('$(artwork.url)');
        --artwork-relative-scale: $(artwork.scale); 
        --title-color: $(title.color);
        --title-size: $(title.size)px;
        --subtitle-color:  $(subtitle.color); 
        --subtitle-size: $(subtitle.size);
        --spacing: $(spacing); 
      }

      * {
        margin: 0;
        padding: 0;
      }
  
      html,
      body {
        width: var(--size);
        height: var(--size);
        overflow: hidden;
        font-family: 'Montserrat, sans-serif';
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
        font-family: 'Montserrat, sans-serif';
        font-size: var(--title-size);
        color: var(--title-color);
        margin-bottom: var(--spacing);
      }
  
      .subtitle {
        font-family: 'Montserrat, sans-serif';
        font-size: var(--subtitle-size);
        color: var(--subtitle-color);
        width: 60%;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="dark-overlay"></div>
      <div class="wrapper">
        <div class="artwork"></div>
        <p class="title">$(title.text)</p>
        <p class="subtitle">$(subtitle.text)</p>
      </div>
    </div>
  </body>
  </html>
  `,
}
