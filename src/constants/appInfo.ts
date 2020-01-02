const packageJson = require('../../package.json')
// TODO: 修改以下字段


export const PAGE_SIZE = 10; // 默认table一页条数
export const INFINITE = 100000000;  // 默认请求时无限多条数据

export const VERSION = packageJson.version;
export const APPNAME = 'vue-ts-cli';
export const FAVICON = require('@/assets/images/favicon.png');
