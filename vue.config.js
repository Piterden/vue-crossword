const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')

module.exports = {
  runtimeCompiler: true,
  css: { sourceMap: true },
  publicPath: process.env.NODE_ENV === 'production' ? '/vue-crossword/' : '/',
  configureWebpack: {
    plugins: [
      new SWPrecacheWebpackPlugin({
        cacheId: 'vue-crossword-app',
        filename: 'service-worker-cache.js',
        staticFileGlobs: ['dist/**/*.{js,css}', '/'],
        minify: true,
        stripPrefix: 'dist/',
        dontCacheBustUrlsMatching: /\.\w{6}\./,
      }),
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, 'public'),
          to: path.resolve(__dirname, 'dist'),
          toType: 'dir',
        },
      ]),
    ],
  },
}
