window.addEventListener('DOMContentLoaded', () => {

  /*
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }

    const ipc = require('electron').ipcRenderer;
    document.getElementById('btn-close').addEventListener('click', () => {
      ipc.send('close');
  });
   document.getElementById('min').addEventListener('click', () => {
    ipc.send('minimize');
  });

    for (const dependency of ['chrome', 'node', 'electron']) {
      replaceText(`${dependency}-version`, process.versions[dependency])
    }

    document.getElementById('btnprofil').addEventListener('click', () => {
      
      ipc.send('verifco');

    });
    */
   
    //https://stackoverflow.com/questions/34328961/importing-node-modules-with-electron-and-systemjs
    try {
    var node_modules = ["child_process", "fs"];
    var fetch = System.fetch;
    window.remote = require("remote");
    System.fetch = function () {
        var promise = fetch.apply(System, arguments);
        return promise.then(function (js) {
            for (var m of node_modules) {
                var requireExpression = 'require("' + m + '");';
                var remoteRequire = 'remote.require("' + m + '");'
                js = js.replace(requireExpression, remoteRequire);
            }
            return js;
        });
    }
    System.import("electron");
  } catch(err){
    console.log("Preload error");
  }

})


