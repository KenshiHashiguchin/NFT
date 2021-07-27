// require('dotenv').config()
// const environment = process.env.APP_ENV || 'local'
// const envSet = require(`./nuxt_env/env.${environment}.js`) // todo envどう入れる？

export default {
  // env: {
  //   // name: environment,
  //   // appUrl: process.env.APP_URL,
  //   // gameStartWeek: envSet.gameStartWeek,
  // },
  publicRuntimeConfig: { //this.$config.HOGE or $config.HOGE
    baseURL: process.env.BASE_URL || 'http://locahost:8080',
    browserBaseURL: process.env.BROWSER_BASE_URL,
    adminAddress: process.env.ADMIN_ADDRESS,
    nodeURL : process.env.SYMBOL_NODE_URL,
    OWNER_ADDRESS: process.env.OWNER_ADDRESS,
    OWNER_PUBLIC_KEY: process.env.OWNER_PUBLIC_KEY,
  },
  privateRuntimeConfig: {
    secret: process.env.SECRET_KEY,
  },
  env: {
    nodeURL : process.env.SYMBOL_NODE_URL,
    EXCHANGE_CURRENCY_MOSAIC_ID: process.env.EXCHANGE_CURRENCY_MOSAIC_ID,
    OWNER_ADDRESS: process.env.OWNER_ADDRESS,
    OWNER_PUBLIC_KEY: process.env.OWNER_PUBLIC_KEY,
  },
  srcDir: 'client/',
  render: {
    // compressor: (req, res, next) => {
    //     next()
    // },
  },

  head: {
    title: 'nft',
    htmlAttrs: {
      lang: 'ja',
    },
    meta: [
      {charset: 'utf-8'},
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {hid: 'description', name: 'NFT Market', content: ''},
      {name: 'application-name', content: 'NFT Market'},
      // { name: 'msapplication-square70x70logo', content: '/small.jpg' },
      // { name: 'msapplication-square150x150logo', content: '/medium.jpg' },
      // { name: 'msapplication-wide310x150logo', content: '/wide.jpg' },
      // { name: 'msapplication-square310x310logo', content: '/large.jpg' },
      // { name: 'msapplication-TileColor', content: '#1d40b9' },
      {property: 'og:type', content: 'website'},
      // { property: 'og:url', content: 'https://yysportscity.com/' },
      // {
      //     property: 'og:image',
      //     content: 'https://www.yysportscity.com/og-img.jpg',
      // },
      {property: 'og:title', content: 'NFT Market'},
      {
        property: 'og:description',
        content:
          '',
      },
      {property: 'og:locale', content: 'ja_JP'},
      // { name: 'twitter:card', content: 'summary_large_image' },
      // { name: 'twitter:site', content: '@fantasy_stadium' },
    ],
    link: [
      // { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      // {
      //     rel: 'apple-touch-icon',
      //     sizes: '180x180',
      //     href: '/apple-touch-icon.png',
      // },
    ],
    script: [
      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js'
      },
      {src: 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js'},
      {src: 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js'},
    ],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '@/assets/style/scss/app.scss',
    '@/assets/style/css/bootstrap.min.css',
    '@/assets/style/css/stream-ui-kit.min.styles.css',
  ],

  plugins: [
    { src: '~/plugins/vue-js-modal', ssr: false },
    { src: '~/plugins/VueLoading', ssr: false },
    { src: '~/plugins/node-api', ssr: false },
    // { src: 'plugins/main.js'},
    // 'plugins/axios',
    // 'plugins/filter',
    // 'plugins/dateformat',
    // 'plugins/vue-clipboard2',
    // 'plugins/vue-slim-tabs',
    // 'plugins/vue-slick-carousel',
    // 'plugins/vue-scrollto',
    // 'plugins/vue-portal',
    // 'plugins/vue-youtube',
    // 'plugins/window-resize',
    // { src: 'plugins/vue-scroll-picker', mode: 'client' },
    // { src: 'plugins/vue-apexcharts.js', mode: 'client' },
    // { src: 'plugins/vue-scroll-bar.js', mode: 'client' },
  ],

  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // '@nuxtjs/moment',
    // // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-module',
    // // https://go.nuxtjs.dev/stylelint
    // '@nuxtjs/stylelint-module',
  ],
  moment: {
    locales: ['ja'],
  },

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    'nuxt-clipboard2', //https://qiita.com/at-946/items/aea8ac9938d810feae7b
    '@nuxtjs/auth',
    '@nuxtjs/axios',
    // '@nuxtjs/dayjs',
    // [
    //     'cookie-universal-nuxt',
    //     {
    //         parseJSON: false,
    //     },
    // ],
    // ['nuxt-webfontloader'],
  ],
  dayjs: {
    locales: ['ja'],
    defaultLocale: 'ja',
    defaultTimeZone: 'Asia/Tokyo',
    plugins: ['timezone'],
  },
  build: {
    extractCSS: true,
    // devtools: process.env.APP_DEBUG === 'true',
    html: {
      minify: {
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true,
        removeComments: true,
        preserveLineBreaks: false,
        collapseWhitespace: true,
      },
    },
    // build.templates local設定
    // templates: [
    //     {
    //         src:
    //             environment === 'local'
    //                 ? 'client/local/app.html'
    //                 : 'client/_app.html',
    //         dst: 'views/app.template.html',
    //     },
    // ],
  },
  // axios: envSet.axios || {},
  // router: {
  //     middleware: ['authRequired', 'requiredRedirect', 'unreadAnnouncement'],
  // },
  // watchers: {
  //     webpack: {
  //         poll: process.env.WATCH_POLL,
  //     },
  // },
  serverMiddleware: ['~~/api/index.js', '~~/api/user.js', '~~/api/nft.js'],
  axios: {
    baseURL: process.env.BASE_URL+'/api',
    browserBaseURL: process.env.BROWSER_BASE_URL+'/api',
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {url: 'authenticate', method: 'post', propertyName: 'token'},
          user: {url: 'me', method: 'get', propertyName: ''},
          logout: true
        }
      }
    }
  },
}
