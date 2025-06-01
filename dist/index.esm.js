import axios from'axios';import {urlJoin,notEmpty}from'@pdg/util';/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};/********************************************************************************************************************
 * ApiError
 * ******************************************************************************************************************/
var ApiError = /** @class */ (function (_super) {
    __extends(ApiError, _super);
    function ApiError(message, code) {
        var _this = _super.call(this, message) || this;
        _this.isAxiosError = false;
        _this.code = code;
        return _this;
    }
    return ApiError;
}(Error));var _a;
var AxiosCreate = axios.create ? axios.create : (_a = require('axios').default) === null || _a === void 0 ? void 0 : _a.create;
var Api = /** @class */ (function () {
    /********************************************************************************************************************
     * constructor
     * ******************************************************************************************************************/
    function Api(option) {
        var _this = this;
        /********************************************************************************************************************
         * run
         * ******************************************************************************************************************/
        this.run = function (method, path, data, option) {
            return new Promise(function (resolve, reject) {
                var _a;
                var headers = __assign({}, _this.option.headers);
                if (typeof window !== 'undefined') {
                    if ((_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.href) {
                        headers['X-Referer'] = window.location.href;
                    }
                }
                var requestConfig = {
                    method: method,
                    withCredentials: _this.option.withCredentials,
                    headers: headers,
                    silent: !!(option === null || option === void 0 ? void 0 : option.silent),
                };
                if (option === null || option === void 0 ? void 0 : option.raw) {
                    requestConfig.responseType = (option === null || option === void 0 ? void 0 : option.rawResponseType) || 'arraybuffer';
                }
                requestConfig.url = urlJoin(_this.option.baseUrl, path.replace(/\./g, '/'));
                if (data) {
                    if (method === 'get') {
                        if (notEmpty(data)) {
                            var finalData = {};
                            finalData[_this.option.timeParamName] = new Date().getTime();
                            for (var key in data) {
                                if (data[key] != null) {
                                    finalData[key] = data[key];
                                }
                            }
                            requestConfig.url += "?".concat(new URLSearchParams(finalData).toString());
                        }
                    }
                    else {
                        if (data instanceof FormData) {
                            data.append(_this.option.timeParamName, "".concat(new Date().getTime()));
                            requestConfig.data = data;
                        }
                        else {
                            var finalData = __assign({}, data);
                            finalData[_this.option.timeParamName] = new Date().getTime();
                            requestConfig.data = finalData;
                        }
                    }
                }
                var setErrorInfo = function (err, status, response) {
                    err.config = requestConfig;
                    err.baseUrl = _this.option.baseUrl;
                    err.path = path;
                    err.requestData = data;
                    err.requestOption = option;
                    err.response = response;
                    err.status = status;
                };
                var fireError = function (err) {
                    var apiError = new ApiError();
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
                    if (_this.option.onError)
                        _this.option.onError(apiError);
                    reject(apiError);
                };
                var instance = AxiosCreate();
                var requestInterceptor;
                if (_this.option.onRequest) {
                    requestInterceptor = instance.interceptors.request.use(function (config) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (this.option.onRequest) {
                                return [2 /*return*/, this.option.onRequest(config, this.option.baseUrl, path, data, option)];
                            }
                            else {
                                return [2 /*return*/, config];
                            }
                        });
                    }); });
                }
                instance
                    .request(requestConfig)
                    .then(function (res) {
                    var resData = res.data;
                    if (_this.option.onResponse) {
                        _this.option.onResponse(res, requestConfig, _this.option.baseUrl, path, data, option)
                            .then(function (finalResData) {
                            resolve(finalResData);
                        })
                            .catch(function (err) {
                            setErrorInfo(err, res.status, res);
                            fireError(err);
                        });
                    }
                    else {
                        resolve(resData);
                    }
                })
                    .catch(fireError)
                    .finally(function () {
                    if (requestInterceptor) {
                        instance.interceptors.request.eject(requestInterceptor);
                    }
                });
            });
        };
        this.option = option;
    }
    Api.prototype.get = function (path, data, option) {
        return this.run('get', path, data, option);
    };
    Api.prototype.post = function (path, data, option) {
        return this.run('post', path, data, option);
    };
    Api.prototype.patch = function (path, data, option) {
        return this.run('patch', path, data, option);
    };
    Api.prototype.delete = function (path, data, option) {
        return this.run('delete', path, data, option);
    };
    return Api;
}());export{Api,ApiError};