import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, Method } from 'axios';
import { ApiError, ApiRequestData, ApiOption, ApiRequestOption, ApiRequestConfig } from './Api.types';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const AxiosCreate = axios.create ? axios.create : require('axios').default?.create;

class Api<T = any, D extends ApiRequestData = {}> {
  option: ApiOption;

  /********************************************************************************************************************
   * constructor
   * ******************************************************************************************************************/

  constructor(option: ApiOption<T>) {
    this.option = option;
  }

  get(path: string, data?: D, option?: ApiRequestOption): Promise<T> {
    return this.run('get', path, data, option);
  }

  post(path: string, data?: D, option?: ApiRequestOption): Promise<T> {
    return this.run('post', path, data, option);
  }

  patch(path: string, data?: D, option?: ApiRequestOption): Promise<T> {
    return this.run('patch', path, data, option);
  }

  delete(path: string, data?: D, option?: ApiRequestOption): Promise<T> {
    return this.run('delete', path, data, option);
  }

  /********************************************************************************************************************
   * run
   * ******************************************************************************************************************/

  run = (method: Method, path: string, data?: D, option?: ApiRequestOption): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      const headers: ApiRequestConfig<D>['headers'] = { ...this.option.headers };

      if (typeof window !== 'undefined') {
        if (window?.location?.href) {
          headers['X-Referer'] = window.location.href;
        }
      }

      const requestConfig: ApiRequestConfig<D> = {
        method,
        withCredentials: this.option.withCredentials,
        headers,
        silent: !!option?.silent,
      };
      if (option?.raw) {
        requestConfig.responseType = option?.rawResponseType || 'arraybuffer';
      }

      requestConfig.url = urlJoin(this.option.baseUrl, path.replace(/\./g, '/'));

      if (data) {
        if (method === 'get') {
          if (notEmpty(data)) {
            const finalData: ApiRequestData = {};
            finalData[this.option.timeParamName] = new Date().getTime();
            for (const key in data) {
              if (data[key] != null) {
                finalData[key] = data[key];
              }
            }
            requestConfig.url += `?${new URLSearchParams(finalData).toString()}`;
          }
        } else {
          if (data instanceof FormData) {
            data.append(this.option.timeParamName, `${new Date().getTime()}`);
            requestConfig.data = data;
          } else {
            const finalData: ApiRequestData = { ...data };
            finalData[this.option.timeParamName] = new Date().getTime();
            requestConfig.data = finalData as D;
          }
        }
      }

      const setErrorInfo = (err: ApiError<T, D>, status?: number, response?: AxiosResponse<T, D>) => {
        err.config = requestConfig;
        err.baseUrl = this.option.baseUrl;
        err.path = path;
        err.requestData = data;
        err.requestOption = option;
        err.response = response;
        err.status = status;
      };

      const fireError = (err: any): void => {
        const apiError: ApiError<T, D> = new ApiError<T, D>();

        if (typeof err === 'object') {
          apiError.message = err.message;
          apiError.code = err.code;
          setErrorInfo(apiError, err.status, err.response);
        } else if (typeof err === 'string') {
          apiError.message = err;
        } else if (err) {
          apiError.message = err.toString();
        }

        if (this.option.onError) this.option.onError(apiError);

        reject(apiError);
      };

      const instance: AxiosInstance = AxiosCreate();
      let requestInterceptor: number;
      if (this.option.onRequest) {
        requestInterceptor = instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
          if (this.option.onRequest) {
            return this.option.onRequest(config, this.option.baseUrl, path, data, option);
          } else {
            return config;
          }
        });
      }

      instance
        .request<T, AxiosResponse<T, D>, D>(requestConfig)
        .then((res) => {
          const { data: resData } = res;
          if (this.option.onResponse) {
            this.option
              .onResponse(res, requestConfig, this.option.baseUrl, path, data, option)
              .then((finalResData) => {
                resolve(finalResData);
              })
              .catch((err: ApiError<T, D>) => {
                setErrorInfo(err, res.status, res);
                fireError(err);
              });
          } else {
            resolve(resData);
          }
        })
        .catch(fireError)
        .finally(() => {
          if (requestInterceptor) {
            instance.interceptors.request.eject(requestInterceptor);
          }
        });
    });
  };
}

export default Api;

/********************************************************************************************************************
 * empty
 * ******************************************************************************************************************/
function empty<T>(v: T): v is Exclude<T, NonNullable<T>> {
  let result = false;
  if (v == null) {
    result = true;
  } else if (typeof v === 'string') {
    result = v === '';
  } else if (typeof v === 'object') {
    if (Array.isArray(v)) {
      result = v.length === 0;
    } else if (!(v instanceof Date)) {
      result = Object.entries(v).length === 0;
    }
  }
  return result;
}

/********************************************************************************************************************
 * notEmpty
 * ******************************************************************************************************************/
function notEmpty<T>(v: T): v is NonNullable<T> {
  return !empty(v);
}

/********************************************************************************************************************
 * urlJoin
 * ******************************************************************************************************************/
function urlJoin(...parts: string[]): string {
  return parts.reduce((acc, part) => {
    if (acc === '') {
      return part;
    } else if (part.startsWith('?')) {
      return `${acc}${part}`;
    } else if (acc.endsWith('/')) {
      return `${acc}${part.startsWith('/') ? part.substring(1) : part}`;
    } else {
      return `${acc}${part.startsWith('/') ? part : `/${part}`}`;
    }
  });
}
