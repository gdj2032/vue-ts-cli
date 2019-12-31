import { AxiosRequestConfig } from "axios";

export interface IRequestParams {
    [key: string]: any;
}

// export type Methods = 'get' | 'post' | 'put' | 'delete' | 'options' | 'head' | 'patch';

export interface IRequestOptions extends AxiosRequestConfig {
    query?: IRequestParams;
    data?: IRequestParams;
    upload?: boolean;
}
