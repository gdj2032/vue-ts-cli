
const WebpackPreBuildPlugin = require('pre-build-webpack');

let onPrebuild
try {
  onPrebuild = require('./.preBuild.js');
}
catch (e) {
  console.error('无法加载编译前置处理文件： .preBuild.js');
  console.error(e);
  throw e;
}

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
    },
    plugins: [
      new WebpackPreBuildPlugin(function (stats) {
        onPrebuild && onPrebuild(stats)
      })
    ],
  },
  css: {
    loaderOptions: {
      // 全局scss配置
      sass: {
        prependData: `@import "~@/assets/style/variable.scss";`
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
