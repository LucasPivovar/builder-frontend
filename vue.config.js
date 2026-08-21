const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: true,
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true
      }
    }
  },
  chainWebpack: config => {
    if (config.plugins.has('copy')) {
      config.plugin('copy').tap(args => {
        if (args[0] && args[0].patterns && args[0].patterns[0]) {
          args[0].patterns[0].globOptions = args[0].patterns[0].globOptions || {}
          args[0].patterns[0].globOptions.ignore = [
            '**/index.html',
            '**/.DS_Store'
          ]
        }
        return args
      })
    }
  }
})
