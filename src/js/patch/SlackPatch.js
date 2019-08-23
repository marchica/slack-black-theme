//Patch from https://github.com/marchica/slack-black-theme
var fs = require('fs');
const cssPath = 'PATH_TO_CSS';
window.addEventListener('load', function() {
    setTimeout(function() {
        document.querySelector('window-chrome').shadowRoot.querySelectorAll('.Windows-Titlebar-background-color')
            .forEach(function(i) {
                i.style['background-color'] = null;
            });
    }, 1000);
});
document.addEventListener('DOMContentLoaded', function() {
    fs.readFile(cssPath, function(err, css) {
        if (err) {
            console.error(err);
            return;
        }
        if (!css) return;
        let s = document.createElement('style');
        s.id = 'slack-custom-css';
        s.type = 'text/css';
        s.innerHTML = css.toString();
        document.head.appendChild(s);
    });
});
const reloadCss = function() {
    fs.readFile(cssPath, function(err, css) {
        if (err) {
            console.error(err);
            return;
        }
        if (!css) return;
        let styleElement = document.querySelector('style#slack-custom-css');
        styleElement.innerHTML = css.toString();
    });
};
//fs.watch(cssPath, reloadCss);
fs.watchFile(cssPath, (curr, prev) => {
    if (curr.mtime !== prev.mtime)
        reloadCss();
});