'use strict';

var aureliaLoaderSystemjs = require('aurelia-loader-systemjs');

function getContext() {
    var _require = require('aurelia-hot-module-reload'),
        HmrContext = _require.HmrContext;

    var hmrContext = new HmrContext(aureliaLoaderSystemjs.getLoader());

    getContext = function getContext() {
        return hmrContext;
    };

    return hmrContext;
}

function getPluginTextUrl() {
    var url = Object.keys(SystemJS.loads).find(function (e) {
        return !e.includes('!') && e.match(/plugin-text@.*\.js/);
    });
    getPluginTextUrl = function getPluginTextUrl() {
        return url;
    };
    return url;
}

function formatTextUrl(url) {
    return url + '!' + getPluginTextUrl();
}

function cwd(url) {
    return '' + SystemJS.baseURL + url;
}

function changeAureliaFiles(url) {
    if (url && (SystemJS.loads[cwd(url)] || SystemJS.loads[formatTextUrl(cwd(url))])) {
        var moduleId = url.replace('dist/', '');

        if (moduleId.endsWith('.html')) {
            getContext().handleViewChange(moduleId, true);
        } else {
            getContext().handleModuleChange(moduleId.replace('.js', '', true));
        }
    }
}

function fileChanged(event, fileChanged, options) {
    if (event.url.startsWith('src/')) return;

    if (SystemJS.loads[formatTextUrl(cwd(event.url))]) {
        event.url = formatTextUrl(event.url);
    }

    fileChanged(event).then(function () {
        changeAureliaFiles(event.url.split('!')[0]);
    });
}

module.exports = fileChanged;
