// 此文件为编译时自动生成的代码，请勿更改, 改了也没有用
import { createPath } from './utils';
const pageRoutes = {
	About: '/about',
	HomeAdd: '/home/add',
	AddTest: '/home/add/test',
	HomeDetail: '/home/detail',
	Home: '/home',
	User: (id: any) => createPath('/user/:id', { id }),
};
export default pageRoutes;
