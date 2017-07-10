import { getLoader } from 'aurelia-loader-systemjs';

function getContext() {
    const { HmrContext } = require('aurelia-hot-module-reload');
    let hmrContext = new HmrContext(getLoader());
    
    getContext = function() {
        return hmrContext;
    }

    return hmrContext;
}

function getPluginTextUrl() {
    let url = Object.keys(SystemJS.loads).find(e=> !e.includes('!') && e.match(/plugin-text@.*\.js/));
    getPluginTextUrl = function() {
        return url;
    }
    return url;
}

function formatTextUrl(url) {
    return `${url}!${getPluginTextUrl()}`;
}

function cwd(url) {
    return `${SystemJS.baseURL}${url}`;
}

function changeAureliaFiles(url) {
    if (url && (SystemJS.loads[cwd(url)] || SystemJS.loads[formatTextUrl(cwd(url))])) {
        var moduleId = url.replace('dist/', '');

        if (moduleId.endsWith('.html')) {
             getContext().handleViewChange(moduleId, true);
        } else{
             getContext().handleModuleChange(moduleId.replace('.js', '', true));
        }       
    }
}

export default function fileChanged(event, fileChanged, options) {
    if (event.url.startsWith('src/')) return;
    
    if (SystemJS.loads[formatTextUrl(cwd(event.url))]) {
       event.url = formatTextUrl(event.url);
    }
        
    fileChanged(event).then(()=>{
        changeAureliaFiles(event.url.split('!')[0]);
    });
}