const remove = require('lodash/remove');
const camelCase = require('lodash/camelCase');
const isFunction = require('lodash/isFunction');
const isPlainObject = require('lodash/isPlainObject');

exports.parseRequest = (ctx) => {
    const requestPath = ctx.path;
    const method = ctx.method;
    let requestDesc = {
        method: method,
        path: requestPath
    };
    if (/.json$/.test(requestPath)) {
        let pathArr = requestPath.slice(0, -5).split('/').slice(1);
        pathArr = remove(pathArr, (item) => {
            return item !== '';
        });
        if (pathArr.length === 1) {
            requestDesc.file = 'index.js';
            requestDesc.funcName = camelCase(`${method} ${pathArr[0]} json`);
        } else if (pathArr.length >= 2) {
            requestDesc.file = pathArr.slice(0, -1).join('/') + '.js';
            requestDesc.funcName = camelCase(`${method} ${pathArr.slice(-1)} json`);
        }
    } else if (/.html$/.test(requestPath)) {
        let pathArr = requestPath.replace('.html', '').split('/').slice(1);
        pathArr = remove(pathArr, (item) => {
            return item !== '';
        });
        if (pathArr.length === 1) {
            requestDesc.file = 'index.js';
            requestDesc.funcName = camelCase(`${method} ${pathArr[0]} html`);
        } else if (pathArr.length >= 2) {
            requestDesc.file = pathArr.slice(0, -1).join('/') + '.js';
            requestDesc.funcName = camelCase(`${method} ${pathArr.slice(-1)} html`);
        }
    } else {
        let pathArr = requestPath.split('/').slice(1);
        pathArr = remove(pathArr, (item) => {
            return item !== '';
        });
        if (requestPath === '/' && method === 'GET') {
            requestDesc.file = 'index.js';
            requestDesc.funcName = 'getIndexHtml';
        } else if (pathArr.length === 1) {
            requestDesc.file = 'index.js';
            requestDesc.funcName = camelCase(`${method} ${pathArr[0]} html`);
        } else if (pathArr.length === 2) {
            requestDesc.file = pathArr.join('/') + '.js';
            requestDesc.funcName = 'getIndexHtml';
        } else if (pathArr.length >= 2) {
            requestDesc.file = pathArr.slice(0, -1).join('/') + '.js';
            requestDesc.funcName = camelCase(`${method} ${pathArr.slice(-1)} html`);
        }
    }

    return requestDesc;
};

exports.getInstance = function(requireContent) {
    if (isFunction(requireContent)) {
        return new requireContent();
    } else if (isPlainObject(requireContent) && requireContent.default) {
        if (isFunction(requireContent.default)) {
            return new requireContent.default();
        } else {
            return requireContent.default;
        }
    } else {
        return requireContent;
    }
};