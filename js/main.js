window.addEventListener('DOMContentLoaded', () => {
    //https://stackoverflow.com/questions/34328961/importing-node-modules-with-electron-and-systemjs
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



})

// https://stackoverflow.com/questions/43311513/whats-the-proper-way-to-handle-forms-in-electron
document.getElementById('btnlog').addEventListener("click", function (event) {
    event.preventDefault();
    const formData = new FormData(formauth)
    const username = formData.get('username');
    const password = formData.get('password');
    let ipcRenderer = require('electron').ipcRenderer;
    var envoie = { username, password }
    console.log(envoie)

    var info = ipcRenderer.sendSync("submitForm", envoie);

    if (info == true) {
        window.location.href = "index.html"
    } else {
        alert("Erreur de connexion")
    }


}, false);

