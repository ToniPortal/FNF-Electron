const mysql = require('mysql'),
  { app, BrowserWindow, ipcMain } = require('electron'),
  path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    slashes: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false,
      enableRemoteModule: true,
      nodeIntegration: true
    },

  })

  win.loadFile('create.html')


  ipcMain.on('close', (event, arg) => {

    if (process.platform !== 'darwin') {
      app.quit()
    }

  });

  var co = false;

  ipcMain.on("verifco", (event, data) => {
    console.log("Verifco")

    if (co == false) {
      win.loadFile('connexion.html')
    } else {
      win.loadFile('index.html')
    }

  });



  const connection = mysql.createConnection({ //connection bdd
    host: 'mysql-nootnoot.alwaysdata.net',
    user: 'nootnoot',
    password: 'nerf@akshan',
    database: 'nootnoot_noot'
  });

  var username = "Anonymous";

  ipcMain.on("submitForm", (event, data) => {
    console.log(data)

    connection.query(`INSERT INTO \`accounts\` (\`username\`, \`password\`) VALUES ("${data.username}", "${data.password}");`, function (error, results, fields) {
      // If there is an issue with the query, output the error
      if (error) {
        return console.log(error);
      }
      // If the account exists, redirect to the login page
      if (results.protocol41 == true) {
        username = data.username;
        // ça a fonctionner.
        co = true;

        event.returnValue = true;

      } else {
        // ça n'a pas fonctionner
        event.returnValue = false;

      }

    });

  });


}




app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})
