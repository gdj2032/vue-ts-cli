import { request } from "@/request";

export interface IListInfo {
  id: any;
  limit?: any;
  offset?: any;
}

const ShopList = async (query: IListInfo) => {
  return request.get({
    url: '/shop/list',
    query
  })
}

export {
  ShopList,
}
