import { type Method } from 'axios';
import { type ApiRequestData, type ApiOption, type ApiRequestOption } from './Api.types';
declare class Api<T = any, D extends ApiRequestData = {}> {
    option: ApiOption;
    /********************************************************************************************************************
     * constructor
     * ******************************************************************************************************************/
    constructor(option: ApiOption<T>);
    get(path: string, data?: D, option?: ApiRequestOption): Promise<T>;
    post(path: string, data?: D, option?: ApiRequestOption): Promise<T>;
    patch(path: string, data?: D, option?: ApiRequestOption): Promise<T>;
    delete(path: string, data?: D, option?: ApiRequestOption): Promise<T>;
    /********************************************************************************************************************
     * run
     * ******************************************************************************************************************/
    run: (method: Method, path: string, data?: D, option?: ApiRequestOption) => Promise<T>;
}
export default Api;
