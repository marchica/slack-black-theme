//Patch from https://github.com/marchica/slack-black-theme
var fs = require('fs');
const cssPath = 'PATH_TO_CSS';
document.addEventListener('DOMContentLoaded', function() {
    fs.readFile(cssPath, function(err, css) {
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
        if (!css) return;
        let styleElement = document.querySelector('style#slack-custom-css');
        styleElement.innerHTML = css.toString();
    });
};
fs.watch(cssPath, reloadCss);