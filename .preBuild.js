const fs = require('fs');
const path = require('path');
const os = require('os');
const chalk = require('chalk');
const reallines = require('n-readlines');

// 转驼峰命名
function toHump(name) {
  return name.replace(/\_(\w)/g, (all, letter) => {
    return letter.toUpperCase();
  });
}

function parseServiceExports() {
  const rootFolder = path.resolve('src/service');
  const serviceFiles = fs.readdirSync(rootFolder);
  let fileContent = '// 此文件为编译时自动生成的代码，请勿更改' + os.EOL;
  let indexFile;
  const services = [];
  serviceFiles.forEach((name) => {
    const fileName = path.resolve(rootFolder, name);
    if (fs.statSync(fileName).isDirectory()) {
      return;
    }
    const regex = /^(.+)\.(ts|tsx|js|jsx)$/;
    const info = regex.exec(name);
    if (info.length != 3) {
      return;
    }
    const segs = info[1].split('.');
    if (segs[segs.length - 1] === 'd') { return; } // declaration file
    if (segs[0] === 'index') {
      indexFile = path.resolve(root, fileName);
      return;
    }
    services.push(`${segs[0]}Service`);
    fileContent += `import * as ${segs[0]}Service from './${info[1]}';${os.EOL}`;
  });
  fileContent += `export {${os.EOL}`;
  services.forEach(s => {
    fileContent += `\t${s},${os.EOL}`;
  });
  fileContent += `}${os.EOL}`;
  // 先比较有木有变化，如果没有，则不需要，否则这里写完文件，又会触发编译，会死循环
  if (indexFile) {
    const data = fs.readFileSync(indexFile, 'utf8');
    if (data === fileContent) {
      return;
    }
    fs.unlinkSync(indexFile);
  }
  fs.writeFileSync(path.resolve(rootFolder, 'index.ts'), fileContent, 'utf8');
}

function findCodeFile(folder, cache) {
  const absPath = path.resolve('src/views', folder);
  const files = fs.readdirSync(absPath);
  files.forEach((name) => {
    const filePath = path.resolve(absPath, name);
    if (fs.statSync(filePath).isDirectory()) {
      findCodeFile(`${folder}/${name}`, cache);
      return;
    }

    if (!name.match(/^(.+)\.(vue)$/)) {
      return;
    }
    if (name.match(/^(.+)\.d\.(vue)$/)) {
      return;
    }
    cache.push(`${folder}/${name}`);
  });
}

function getRoutePath(file) {
  const rs = new reallines(path.resolve('src/views/', file));
  let line;
  let lineNum = 0;
  while (line = rs.next()) {
    lineNum++;
    line = line.toString('utf8').replace(/[\s]+/, ' ').trim();
    if (!line.startsWith('export const RoutePath')) {
      continue;
    }
    const match = /export const RoutePath\s*=\s*['"`](.*)['"`];*$/.exec(line);
    if (match.length != 2) {
      console.error(chalk.orange(`${file}:${lineNum} 疑似路由字符串导出格式不正确`));
      console.info(chalk.blue('正确格式：export const RoutePath = "路径"'));
    }
    rs.close();
    return match[1];
  }
  try {
    rs.close();
  }
  catch (e) { }
}
function makeRoute(route) {
  //如果里面包含参数，则生成一个函数
  // 填充路径里面的参数，如果参数不完整则报错
  const segs = route.split('/').filter(s => {
    return s !== '';
  });
  const params = [];
  segs.forEach((s, index) => {
    if (!s) {
      return;
    }
    if (s.startsWith(':')) {
      params.push(s.substr(1));
    }
  })
  if (params.length === 0) {
    return `'${route}'`;
  }
  let args = '';
  params.forEach((p, idx) => {
    args += p;
    if (idx < params.length - 1) {
      args += ', ';
    }
  });
  return `(${args}: any) => createPath('${route}', { ${args} })`
}
function parsePagePath() {
  const allFiles = [];
  // 第一层目录不管
  const rootFolder = path.resolve('src/views');
  const rootFiles = fs.readdirSync(rootFolder);
  rootFiles.forEach((name) => {
    const file = path.resolve(rootFolder, name);
    if (fs.statSync(file).isDirectory()) {
      findCodeFile(name, allFiles);
    }
  });
  //生成结构[{name: string; file: string; routes: string, pathes}];, pathes 最后一个是组件名字
  const allRoutes = [];
  allFiles.forEach(f => {
    const route = getRoutePath(f);
    if (!route) {
      return;
    }
    const pathInfo = /^(.*)\.(vue)$/.exec(f)[1];
    let pathes = pathInfo.split('/');
    // 默认路径名字： 上级目录名+文件名
    // 如果文件名是index. 则使用上级目录名
    if (pathes[pathes.length - 1] == 'index') {
      pathes.splice(pathes.length - 1);
    }
    //使用最后两级作为名字
    let name = toHump(`${pathes[pathes.length - 1]}`);
    if (pathes.length > 1) {
      name = toHump(`${pathes[pathes.length - 2]}_${pathes[pathes.length - 1]}`);
    }
    allRoutes.push({ name, file: f, route: route, pathes: pathes });
  })
  // 遍历如果发现名字有重复，就使用全路径的驼峰命名
  for (let i = 0; i < allRoutes.length; i++) {
    for (let j = i + 1; j < allRoutes.length; j++) {
      const src = allRoutes[i].pathes;
      const dst = allRoutes[j].pathes;
      if (allRoutes[i].name === allRoutes[j].name) {
        console.warn(chalk.red(`${allRoutes[i].file} | ${allRoutes[j].file} 页面文件名字相同, 自动使用全路径作为PathConfig的Key`));

        allRoutes[i].name = toHump(src.join('_'));
        allRoutes[j].name = toHump(dst.join('_'));
      }
    }
  }
  // 再遍历一遍，如果还有错误，就提示出错
  for (let i = 0; i < allRoutes.length; i++) {
    for (let j = i + 1; j < allRoutes.length; j++) {
      const src = allRoutes[i].pathes;
      const dst = allRoutes[j].pathes;
      if (allRoutes[i].name === allRoutes[j].name) {
        const error = `${allRoutes[i].file} | ${allRoutes[j].file} 路由名字名字相同，请考虑更改文件名`;
        console.error(chalk.red(error));
        // throw new Error(error);
      }
    }
  }
  let fileContent = '';
  fileContent += `const pageRoutes = {${os.EOL}`;
  let useCreatFunc = false;

  allRoutes.forEach(r => {
    const route = `\t${r.name}: ${makeRoute(r.route)},${os.EOL}`
    if (!useCreatFunc && route.indexOf('createPath(') > 0) {
      useCreatFunc = true;
    }
    fileContent += route;
  });

  fileContent += `};${os.EOL}`;
  fileContent += `export default pageRoutes;${os.EOL}`;

  let header = '// 此文件为编译时自动生成的代码，请勿更改, 改了也没有用' + os.EOL;
  if (useCreatFunc) {
    header += `import { createPath } from './utils';${os.EOL}`;
  }
  fileContent = header + fileContent;
  // 先比较有木有变化，如果没有，则不需要，否则这里写完文件，又会触发编译，会死循环
  const defFile = path.resolve(process.cwd(), 'src/views/pageRoutes.ts');
  if (fs.existsSync(defFile)) {
    const data = fs.readFileSync(defFile, 'utf8');
    if (data === fileContent) {
      return;
    }
    fs.unlinkSync(defFile);
  }
  fs.writeFileSync(defFile, fileContent, 'utf8');
}

function onPreBuild(stats) {
  parseServiceExports();
  parsePagePath();
}
// onPreBuild(null);
module.exports = onPreBuild;
