module.exports = function (api) {
  api.cache(false)

  const presets = [
    '@vue/app',
    [
      '@babel/preset-env',
      {
        modules: 'commonjs',
        useBuiltIns: 'usage',
        // corejs: 2,
        targets: {
          browsers: ['Chrome > 51'],
        },
      },
    ],
  ]

  const plugins = [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-transform-async-to-generator',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    '@babel/plugin-transform-spread',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-transform-modules-commonjs',
  ]

  return {
    presets,
    plugins,
  }
}
