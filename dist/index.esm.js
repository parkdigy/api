import axios from'axios';/********************************************************************************************************************
 * ApiError
 * ******************************************************************************************************************/
class ApiError extends Error {
    constructor(message, code) {
        super(message);
        this.isAxiosError = false;
        this.code = code;
    }
}var _a;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const AxiosCreate = axios.create ? axios.create : (_a = require('axios').default) === null || _a === void 0 ? void 0 : _a.create;
class Api {
    /********************************************************************************************************************
     * constructor
     * ******************************************************************************************************************/
    constructor(option) {
        /********************************************************************************************************************
         * run
         * ******************************************************************************************************************/
        this.run = (method, path, data, option) => {
            return new Promise((resolve, reject) => {
                var _a;
                const headers = Object.assign({}, this.option.headers);
                if (typeof window !== 'undefined') {
                    if ((_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.href) {
                        headers['X-Referer'] = window.location.href;
                    }
                }
                const requestConfig = {
                    method,
                    withCredentials: this.option.withCredentials,
                    headers,
                    silent: !!(option === null || option === void 0 ? void 0 : option.silent),
                };
                if (option === null || option === void 0 ? void 0 : option.raw) {
                    requestConfig.responseType = (option === null || option === void 0 ? void 0 : option.rawResponseType) || 'arraybuffer';
                }
                requestConfig.url = urlJoin(this.option.baseUrl, path.replace(/\./g, '/'));
                if (data) {
                    if (method === 'get') {
                        if (notEmpty(data)) {
                            const finalData = {};
                            finalData[this.option.timeParamName] = new Date().getTime();
                            for (const key in data) {
                                if (data[key] != null) {
                                    finalData[key] = data[key];
                                }
                            }
                            requestConfig.url += `?${new URLSearchParams(finalData).toString()}`;
                        }
                    }
                    else {
                        if (data instanceof FormData) {
                            data.append(this.option.timeParamName, `${new Date().getTime()}`);
                            requestConfig.data = data;
                        }
                        else {
                            const finalData = Object.assign({}, data);
                            finalData[this.option.timeParamName] = new Date().getTime();
                            requestConfig.data = finalData;
                        }
                    }
                }
                const setErrorInfo = (err, status, response) => {
                    err.config = requestConfig;
                    err.baseUrl = this.option.baseUrl;
                    err.path = path;
                    err.requestData = data;
                    err.requestOption = option;
                    err.response = response;
                    err.status = status;
                };
                const fireError = (err) => {
                    const apiError = new ApiError();
                    if (typeof err === 'object') {
                        apiError.message = err.message;
                        apiError.code = err.code;
                        setErrorInfo(apiError, err.status, err.response);
                    }
                    else if (typeof err === 'string') {
                        apiError.message = err;
                    }
                    else if (err) {
                        apiError.message = err.toString();
                    }
                    if (this.option.onError)
                        this.option.onError(apiError);
                    reject(apiError);
                };
                const instance = AxiosCreate();
                let requestInterceptor;
                if (this.option.onRequest) {
                    requestInterceptor = instance.interceptors.request.use(async (config) => {
                        if (this.option.onRequest) {
                            return this.option.onRequest(config, this.option.baseUrl, path, data, option);
                        }
                        else {
                            return config;
                        }
                    });
                }
                instance
                    .request(requestConfig)
                    .then((res) => {
                    const { data: resData } = res;
                    if (this.option.onResponse) {
                        this.option
                            .onResponse(res, requestConfig, this.option.baseUrl, path, data, option)
                            .then((finalResData) => {
                            resolve(finalResData);
                        })
                            .catch((err) => {
                            setErrorInfo(err, res.status, res);
                            fireError(err);
                        });
                    }
                    else {
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
        this.option = option;
    }
    get(path, data, option) {
        return this.run('get', path, data, option);
    }
    post(path, data, option) {
        return this.run('post', path, data, option);
    }
    put(path, data, option) {
        return this.run('put', path, data, option);
    }
    patch(path, data, option) {
        return this.run('patch', path, data, option);
    }
    delete(path, data, option) {
        return this.run('delete', path, data, option);
    }
}
/********************************************************************************************************************
 * empty
 * ******************************************************************************************************************/
function empty(v) {
    let result = false;
    if (v == null) {
        result = true;
    }
    else if (typeof v === 'string') {
        result = v === '';
    }
    else if (typeof v === 'object') {
        if (Array.isArray(v)) {
            result = v.length === 0;
        }
        else if (!(v instanceof Date)) {
            result = Object.entries(v).length === 0;
        }
    }
    return result;
}
/********************************************************************************************************************
 * notEmpty
 * ******************************************************************************************************************/
function notEmpty(v) {
    return !empty(v);
}
/********************************************************************************************************************
 * urlJoin
 * ******************************************************************************************************************/
function urlJoin(...parts) {
    return parts.reduce((acc, part) => {
        if (acc === '') {
            return part;
        }
        else if (part.startsWith('?')) {
            return `${acc}${part}`;
        }
        else if (acc.endsWith('/')) {
            return `${acc}${part.startsWith('/') ? part.substring(1) : part}`;
        }
        else {
            return `${acc}${part.startsWith('/') ? part : `/${part}`}`;
        }
    });
}export{Api,ApiError};