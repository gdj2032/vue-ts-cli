export const createPath: (path: string, params?: { [key: string]: any }) => string = (path, params) => {
  // 填充路径里面的参数，如果参数不完整则报错
  const segs = path.split('/');
  let newPath = '';
  if (path.startsWith('/')) {
    newPath = '/';
  }
  segs.forEach((s, index) => {
    if (!s) {
      return;
    }
    if (s.startsWith(':')) {
      s = s.substr(1);
      const value = params && params[s];
      if (value === undefined || value === null) {
        throw new Error(`路径 ${path} 缺少参数: ${s}`);
      }
      s = value;
    }
    newPath += s;
    if (index !== segs.length - 1 || path.endsWith('/')) {
      newPath += '/';
    }
  })
  return newPath;
}
