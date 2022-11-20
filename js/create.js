// https://stackoverflow.com/questions/43311513/whats-the-proper-way-to-handle-forms-in-electron
document.getElementById('btnlog').addEventListener("click", function (event) {
    event.preventDefault();
    const formData = new FormData(formauth)
    const username = formData.get('username');
    const password = formData.get('password');
    let ipcRenderer = require('electron').ipcRenderer;
    var envoie = { username, password }
    console.log(envoie)
    var infoid = document.getElementById('err');

    infoid.innerText = String("Connexion en cours...");

    var info = ipcRenderer.sendSync("submitForm", envoie);

    if (info == true) {
        window.location.href = "index.html"
    } else {
        infoid.innerText = String(info);
    }


}, false);

