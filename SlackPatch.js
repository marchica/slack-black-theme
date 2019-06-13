//Slack patch begin

// First make sure the wrapper app is loaded
document.addEventListener("DOMContentLoaded", function() {

    // Then get its webviews
    let webviews = document.querySelectorAll(".TeamView webview");
 
    // Fetch our CSS in parallel ahead of time
    const cssPath = 'URL_TO_CSS';
    let cssPromise = fetch(cssPath + '?zz=' + Date.now(), {cache: "no-store"}).then(response => response.text());
 
    let customCustomCSS = `
        :root {
            /* Modify these to change your theme colors: */
            // --primary: #09F;
            // --text: #CCC;
            // --background: #080808;
            // --background-elevated: #222;
        } 
    
        a[aria-label^="NAME_OF_CHANNEL_OR_DIRECT_CONVO_TO_STYLE"]
        {
            // --background: #4d0000  !important;
            // --text-transform: uppercase  !important;
            // --letter-spacing: 2px !important;
            // --text-shadow: 1px 1px white;
        }
    `
 
    // Insert a style tag into the wrapper view
    cssPromise.then(css => {
       let s = document.createElement('style');
       s.type = 'text/css';
       s.innerHTML = css + customCustomCSS;
       document.head.appendChild(s);
    });
 
    // Wait for each webview to load
    webviews.forEach(webview => {
       webview.addEventListener('ipc-message', message => {
          if (message.channel == 'didFinishLoading')
             // Finally add the CSS into the webview
             cssPromise.then(css => {
                let script = `
                      let s = document.createElement('style');
                      s.type = 'text/css';
                      s.id = 'slack-custom-css';
                      s.innerHTML = \`${css + customCustomCSS}\`;
                      document.head.appendChild(s);
                      `
                webview.executeJavaScript(script);
             })
       });
    });
 });
 
 const cssPath = 'URL_TO_CSS';
 const localCssPath = 'C:\\Users\\Marcy\\Code\\slack\\slack-black-theme\\custom.css';
 
 window.reloadCss = function() {
     console.log('reloading css!');
    const webviews = document.querySelectorAll(".TeamView webview");
    fetch(cssPath + '?zz=' + Date.now(), {cache: "no-store"}) // qs hack to prevent cache
       .then(response => response.text())
       .then(css => {
          console.log(css.slice(0,50));
          webviews.forEach(webview =>
             webview.executeJavaScript(`
                (function() {
                   let styleElement = document.querySelector('style#slack-custom-css');
                   styleElement.innerHTML = \`${css}\`;
                })();
            `)
          )
       });
 };
 
 var fs = require('fs');
 fs.watchFile(localCssPath, reloadCss);

//Slack patch end