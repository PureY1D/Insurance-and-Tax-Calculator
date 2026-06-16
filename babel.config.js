const plugins = []

if (process.env.UNI_OPT_TREESHAKING) {
  plugins.push(require('@dcloudio/vue-cli-plugin-uni-optimize/packages/babel-plugin-uni-api/index.js'))
}

if (
  (process.env.UNI_PLATFORM === 'app-plus' && process.env.UNI_USING_V8) ||
  (process.env.UNI_PLATFORM === 'h5' && process.env.UNI_H5_BROWSER === 'builtin')
) {
  const path = require('path')
  plugins.push([
    'module-resolver',
    {
      alias: {
        '^@/(.+)$': path.resolve(__dirname, 'src/$1')
      }
    }
  ])
}

module.exports = {
  presets: [
    [
      '@vue/cli-plugin-babel/preset',
      {
        modules: false
      }
    ]
  ],
  plugins
}
