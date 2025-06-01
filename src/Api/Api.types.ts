import { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig, ResponseType } from 'axios';

/********************************************************************************************************************
 * ApiRequestData, ApiRequestOption, ApiRequestConfig
 * ******************************************************************************************************************/

export interface ApiRequestData {
  [key: string]: any;
}

export interface ApiRequestOption {
  raw?: boolean;
  rawResponseType?: ResponseType;
  silent?: boolean;
}

export interface ApiRequestConfig<D = ApiRequestData> extends AxiosRequestConfig<D> {
  silent?: boolean;
}

/********************************************************************************************************************
 * ApiError
 * ******************************************************************************************************************/

export class ApiError<T = any, D = ApiRequestData> extends Error {
  code?: string;
  config?: ApiRequestConfig<D>;
  baseUrl?: string;
  path?: string;
  requestData?: D;
  requestOption?: ApiRequestOption;
  response?: AxiosResponse<T, D>;
  status?: number;
  isAxiosError = false;

  constructor(message?: string, code?: string) {
    super(message);

    this.code = code;
  }
}

/********************************************************************************************************************
 * ApiOption
 * ******************************************************************************************************************/

export interface ApiOption<T = any, D = ApiRequestData> {
  baseUrl: string;
  timeParamName: string;
  withCredentials?: boolean;
  headers?: AxiosRequestConfig['headers'];
  onRequest?(
    config: InternalAxiosRequestConfig<D>,
    baseUrl: string,
    path: string,
    requestData?: D,
    requestOption?: ApiRequestOption
  ): Promise<InternalAxiosRequestConfig<D>>;
  onResponse?(
    response: AxiosResponse<T, D>,
    config: AxiosRequestConfig<D>,
    baseUrl: string,
    path: string,
    requestData?: D,
    requestOption?: ApiRequestOption
  ): Promise<T>;
  onError?(err: ApiError<T, D>): void;
  dataKeysToLowerCase?: boolean;
}
