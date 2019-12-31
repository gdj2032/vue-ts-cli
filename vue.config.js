module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'assets': '@/assets',
        'components': '@/components',
        'containers': '@/containers',
        'constants': '@/constants',
        'request': '@/request',
        'service': '@/service',
        'views': '@/views',
        'style': '@/style',
      }
    }
  },
  devServer: {
    port: 7000,
    proxy: {
      '/api/*': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    }
  }
}
