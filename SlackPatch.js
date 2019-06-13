
//Patch from https://github.com/marchica/slack-black-theme

document.addEventListener("DOMContentLoaded", function () {
   const cssPath = 'URL_TO_CSS';
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

   fetch(cssPath).then(response => response.text()).then(css => {
      let s = document.createElement('style');
      s.type = 'text/css';
      s.innerHTML = css + customCustomCSS;
      document.head.appendChild(s);
   });
});
