window.addEventListener('DOMContentLoaded', () => {

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

  })


