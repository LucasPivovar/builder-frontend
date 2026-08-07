const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: true,
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
