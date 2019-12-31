// export const mockSwitch = 0; // mock开关
const isProduction = process.env.NODE_ENV !== 'development';
const Credentials = true; // include 跨域使用 、 same-origin 同源使用

let API_HOST = '';

if (isProduction) {
  API_HOST = ''; //
} else {
  // API_HOST = !mockSwitch ? '/api' : '/mock';
  API_HOST = '/api';
}

export {
  API_HOST,
  Credentials
};
