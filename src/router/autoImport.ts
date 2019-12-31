// 自动引入 带有 export PageRoute = xxx;的页面
interface IPageInfo {
  route: string; // 组件路由
  component: any; // 组件
  path: string; // 页面路径
}

function firstUpperCase(str: any) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// function toHump(route: any) {
//   let str = route;
//   const mul = str.indexOf(':');
//   if(mul > 0) {
//     str = str.substring(0, mul - 1)
//   }
//   str = str.split('/')
//   const s = str.map((e: any, idx: any) => {
//     if(idx > 1) {
//       return firstUpperCase(e)
//     }
//     return e
//   });
//   if(s.length > 3) {
//     return s[s.length - 2] + s[s.length - 1];
//   }
//   return s.join('');
// }

// 访问根目录下面的*.tsx : ./xxx/xxx.tsx
export default function autoImport() {
  const allPages: IPageInfo[] = [];
  const r = require.context('../views', true,  /^(.*)\.(vue)$/);
  r.keys().forEach((key: any) => {
    const imported = r(key);
    const defComp = imported.default;
    const routePath = imported.RoutePath;
    if (!defComp || typeof routePath !== 'string') {
      // 没有导出 Route
      return;
    }
    //页面路径分段
    const pageInfo: IPageInfo = {
      component: defComp,
      route: routePath,
      path: `views/${key}`,
    }
    allPages.push(pageInfo);
  });
  let hasError = false;
  for (let i = 0; i < allPages.length; i++) {
    for (let j = i + 1; j < allPages.length; j++) {
      if (allPages[i].route === allPages[j].route) {

        console.error(`页面路由重复：${allPages[i].route}`)
        console.error(`${allPages[i].path}  |  ${allPages[j].path}`);
        console.error('------------------------------------------------------------------');
        hasError = true;
      }
    }
  }
  if (hasError) {
    throw new Error('错误: 页面路由有重复');
  }
  const pagesRoutes: any[] = [];
  allPages.forEach(p => {
    pagesRoutes.push({ component: p.component, exact: true, path: p.route });
  });
  return pagesRoutes;
}
