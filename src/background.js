'use strict'
const pdflib = require('pdfjs-dist/build/pdf.js'); 
const PDFWindow = require('electron-pdf-window');

import { app, protocol, BrowserWindow, BrowserView, ipcMain } from 'electron';
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'
const path = require('path');
const url = require('url');

const rutaInicial = '..';
var rutaActual = rutaInicial;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let winPdf;
let viewPdf;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 1000, height: 8000, webPreferences: {
    nodeIntegration: true
  } })

  //desactivar menú
  win.setMenu(null);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}


function createWindowPdf(pdfUrl, enviarEventoAVentana){
  winPdf = new BrowserWindow({
    width:800,
    height:650,
    parent:win,
    show:true,
    webPreferences:{
      nodeIntegration:true
    }
  });
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    winPdf.loadURL(process.env.WEBPACK_DEV_SERVER_URL+'/#/pdf').then(function(){
      enviarEventoAVentana(winPdf);
    });
    if (!process.env.IS_TEST) winPdf.webContents.openDevTools();
  } else{

    createProtocol('file');
    winPdf.loadURL('app://#/pdf').then(function(){
      enviarEventoAVentana(winPdf);
    });
  }

  /*
  winPdf.loadURL(url.format({
    //Por alguna razón la ruta aparece una carpeta más adentro//
    pathname:path.join(__dirname,'..',pdfUrl),
    protocol:'file'
  }));
  */ 

  winPdf.on('closed', () => {
    winPdf = null;
  });
}

/*Intento renderizar el pdf en una ventana*/
function createWindowPdf2(pdfUrl){
    /*
    winPdf2 = new BrowserWindow({
      width:800,
      height:650,
      show:true,
      parent:win,
      webPreferences:{
        webSecurity:false,
        plugins:true
      }
    });*/
    //createProtocol('file');

    /*
    const winPdf2 = new PDFWindow({
      width:800,
      height:600,
      parent:win,
      webPreferences:{
        nodeIntegration:true
      }
    });
    
    if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
      winPdf2.loadURL(process.env.WEBPACK_DEV_SERVER_URL+pdfUrl);
      if (!process.env.IS_TEST) winPdf2.webContents.openDevTools();
    } else{
      winPdf2.loadURL('file://'+pdfUrl);
    }
    */
    /*
    let winPdf2 = new BrowserWindow({
      width:600, 
      height:600,

      webPreferences:{
        nodeIntegration:true
      }
    });

    PDFWindow.addSupport(winPdf2);
    winPdf2.loadURL('file://', pdfUrl);
    */
    let winPdf2 = new PDFWindow({
      width:700, 
      height:700
    })

    winPdf2.loadFile(pdfUrl);

    
   // winPdf2.loadURL('file://'+pdfUrl);

    //si pdf está cargado
    /*
    winPdf2.webContents.on('did-finish-load',() => {
      winPdf2.webContents.print({silent: true, printBackground:true});
    });
    */

    winPdf2.on('closed', ()=>{
      winPdf2 = null;
    });
}




// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }

  }
  createWindow();
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}


//***************************************
/*Eventos entre ventanas*/
//***************************************

/*
  Retorna la ruta inicial(la que tiene la app cuando inicia), y la 
  ruta actual(la última ruta que llegó)
*/
ipcMain.on('ruta:get', (event)=>{
  win.webContents.send('ruta:get', {rutaInicial,rutaActual});

});
/*
  Actualiza la ruta actual por la que llega por parámetro.
*/
ipcMain.on('ruta:post', (event, nuevaRuta) => {
  rutaActual = nuevaRuta;
});
/*
  Abre una nueva ventana con un pdf en su url.
*/
ipcMain.on('pdf:open', (event, rutaPdf) => {
  //createWindowPdf(rutaPdf, (ventana)=>{
    /*
    var loadingTask = pdfjs.getDocument(path.join(__dirname,rutaPdf));
    loadingTask.promise.then((pdf) => {
      ventana.webContents.send('pdf:abrir', {rutaPdf,pdf});
    });
    */  //path.join(__dirname,'..',rutaPdf)
    //ventana.webContents.send('pdf:abrir', rutaPdf);

     
  //});
  //createWindowPdf2("http://www.torredenunez.com/blog/wp-content/uploads/2015/09/pdf_ejemplo4.pdf");
  // ../.. si ya está instalado, un solo .. si está en desarrollo.
  createWindowPdf2(path.join(__dirname,'..',rutaPdf));
  //createWindowPdf2(path.join('../assets/archivo.pdf'));
});
