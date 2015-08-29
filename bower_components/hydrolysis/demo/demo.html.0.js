
  window.setTimeout(function(){
    "use strict";
    var textarea = document.querySelector("textarea");
    var hyd = require('hydrolysis');
    var stage = document.querySelector("#stage").content;
    function displayMetadata(content, url, loader) {
      function render(content) {
        debugger;
        content = JSON.stringify(content, null, '  ');
        content = content.replace(/</g,"&lt;");
        content = content.replace(/>/g,"&gt;");
        document.body.innerHTML += "<pre>" + content + "</pre>";
      }
      if (url) {
        hyd.hydrolyze(content, false, url, loader).then(render);
      } else {
        hyd.hydrolyze(content).then(render);
      }

    }
    var loader = new hyd.loader({host: document.querySelector('#stage').hostname});
    loader.addResolver(new hyd.xhrResolver());

    displayMetadata(stage, document.querySelector('#stage').url.href, loader);
  }, 1000);
  