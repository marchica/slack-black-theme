
const localCssPath = 'PATH_TO_LOCAL_CSS';

window.reloadCss = function() {
    fetch(cssPath).then(response => response.text())
        .then(css => {
            let styleElement = document.querySelector('style#slack-custom-css');
            styleElement.innerHTML = css;
        });
};

var fs = require('fs');
fs.watch(localCssPath, reloadCss);
