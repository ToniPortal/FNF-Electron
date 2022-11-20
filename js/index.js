const ipcRenderer = require('electron').ipcRenderer;
var wantscoreorweek = 0;

window.onload = async function () {
    console.log("loaded")

    try {
        const response = await fetch('./data/listgame.json');
        const list = await response.json();

        var longlist = Object.keys(list.allgame).length
        for (let i = 0; i < longlist; i++) {
            console.log(list.allgame[i].name);
            //var btn = document.createElement("button");
            //btn.setAttribute("onclick", `lauch("${list.allgame[i].path}")`);
            //btn.innerText = `Launch`;
            var myobj = {
                "name": list.allgame[i].name,
                "path": list.allgame[i].path
            }
            arraybtn.push(myobj);
        }
    } catch (err) {
        console.log(err)
    } finally {
        creertable()
    }

    document.getElementById("delall").addEventListener("click", function () {
        const ipcRenderer = require('electron').ipcRenderer;
        console.log("delall")
        ipcRenderer.send('deleteall');
    });


}

var arraybtn = [];


var solotest = 0

async function readscoreweek(name) {
    console.log("name: " + name)
    const table = document.createElement("table");
    try {
        const week = await fetch(`./data/weekscore.json`);
        const weekjson = await (week.json());
        //console.log(weekjson.h)
        const song = await fetch(`./data/songscore.json`);
        const songjson = await song.json();

        table.innerHTML += `   
                                </thead>                  
                                    <tr>
                                     <th>${name}</th>
                                    </tr>
                                </thead><tbody>`;
        Object.entries(songjson.h).forEach(([key, value]) => {

            if (value != 0 && value != null) {
                table.innerHTML += `<tr>
                                     <td>${key}</td>
                                     <td>${value}</td>
                                    </tr>`
            }

        });
        table.innerHTML += `</tbody><tfoot>`;
        Object.entries(weekjson.h).forEach(([key, value]) => {
            if (value != 0 && value != null) {
                table.innerHTML += `<tr>
                                     <td>${key}</td>
                                     <td>${value}</td>
                                    </tr>`
            }
        });


        table.innerHTML += "</tfoot>"
    } catch (err) {


    } finally {
        console.log(table.innerHTML)
        document.body.appendChild(table);
    }

}


document.getElementById('wantscorebtn').addEventListener("click", function (event) {

    if (wantscoreorweek == 0) {
        document.getElementById('wantscorebtn').innerText = "Want week";
        wantscoreorweek = 1;
    } else {
        document.getElementById('wantscorebtn').innerText = "Want score";
        wantscoreorweek = 0;
    }

});


document.getElementById('ok').addEventListener("click", function (event) {
    event.preventDefault();

    var inputexepath = document.getElementById("exe").files[0].path;
    inputexepath = inputexepath.replace(/\\/g, "/");

    var send = ipcRenderer.sendSync('enregistre', inputexepath)
    console.log(send)
    if (send == true) {
        let inputexename = document.getElementById("exe").files[0].name
        if (inputexename == "") {
            alert("Veuillez mettre un fichier .exe")
        } else {
            let btn = document.createElement("button");
            btn.setAttribute("onclick", `lauch("${inputexepath}")`);
            btn.innerText = `${inputexename}`;
            document.body.appendChild(btn);
        }

    } else {
        alert(send)
    }
});


async function lauch(path) {
    if (wantscoreorweek == 0) {
        console.log(path)
        const ipcRenderer = require('electron').ipcRenderer;
        ipcRenderer.send('launch', `${path}`);
    } else {
        try {
            path = path.replace(/.exe/gi, '');
            path = path.split(/(\\|\/)/g).pop();
            ipcRenderer.send('writescoreweek', `${path}`);
        } catch (err) {
            console.log(err)
        } finally {
            readscoreweek(path);
        }

    }
}

function createth(text) {
    const th = document.createElement("th");
    th.setAttribute("scope", "col");
    th.innerText = text;
    return th;
}

function createtdbtn(arraybtn) {
    const td = document.createElement("td");
    const button = document.createElement("button");
    button.setAttribute("class", "button");
    button.setAttribute("onclick", `lauch("${arraybtn.path}")`);
    button.innerText = arraybtn.name;
    td.appendChild(button);
    return td;
}

function createtdbtndel(arraybtn) {
    const td = document.createElement("td");
    const button = document.createElement("button");
    button.setAttribute("class", "button");
    button.setAttribute("onclick", `del("${arraybtn.name}")`);
    button.innerText = "Delete";
    td.appendChild(button);
    return td;
}


function creertable() {
    const table = document.createElement("table");
    const tablediv = document.getElementById("tablediv");
    tablediv.innerHTML = "";
    table.setAttribute("id", "table");
    table.setAttribute("class", "table");
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");

    const trs = document.createElement("tr");
    const trdel = document.createElement("tr");
    for (let i = 0; i < arraybtn.length; i++) {
        tr.appendChild(createth(arraybtn[i].name));


        trs.appendChild(createtdbtn(arraybtn[i]));
        trdel.appendChild(createtdbtndel(arraybtn[i]));
    }

    thead.appendChild(tr);
    table.appendChild(thead);


    const tbody = document.createElement("tbody");
    tbody.setAttribute("id", "tbody");

    tbody.appendChild(trs);
    tbody.appendChild(trdel);
    table.appendChild(tbody);



    tablediv.appendChild(table);
}

function delall() {
    const ipcRenderer = require('electron').ipcRenderer;
    ipcRenderer.send('deleteall');
    document.getElementById("table").remove();
    arraybtn = [];
    window.location.reload();
}