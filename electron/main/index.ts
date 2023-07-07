import { app, BrowserWindow, ipcMain, Notification, shell } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'
import { URL } from 'url'

process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST


if (release().startsWith('6.1')) app.disableHardwareAcceleration()

if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let mainWindow: BrowserWindow | null = null
const preload = join(__dirname, '../preload/index.js')

const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')


async function createWindow() {
  mainWindow = new BrowserWindow({
    title: 'Vale Shop',
    width: 800,
    height: 500,
    maxWidth: 600,
    maxHeight: 800,
    minWidth: 785,
    minHeight: 500,
    icon: join(process.env.PUBLIC, '/logo_vale-shop.png'),
    webPreferences: {
      preload,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(url)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(indexHtml)
  }
  // mainWindow.setMenu(null);

  // mainWindow.webContents.on('will-navigate', (event, url) => {
  //   // Verificar se o link é externo ao aplicativo
  //   if (!url.startsWith('file://')) {
  //     event.preventDefault() // Impedir a abertura em um navegador externo
  //     shell.openExternal(url) // Abrir o link no navegador padrão do sistema
  //   }
  // })
}


const NOTIFICATION_TITLE: string = 'Autorizador de vendas'
const NOTIFICATION_BODY: string = 'Produto gerido por Vale Shop'

function showNotification() {
  new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()
}


app.whenReady().then(createWindow).then(showNotification)


app.on('window-all-closed', () => {
  mainWindow = null
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    title: 'Vale Shop',
    width: 300,
    height: 200,
    maxWidth: 1017,
    maxHeight: 700,
    minWidth: 200,
    minHeight: 100,


    icon: join(process.env.PUBLIC, '/logo_vale-shop.png'),

    webPreferences: {
      preload,
      contextIsolation: false,
      nodeIntegration: false,
      nodeIntegrationInWorker: true,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL('https://www.valeshop.com.br')
    childWindow.webContents.openDevTools()

  } else {
    childWindow.loadFile('https://www.valeshop.com.br')
  }
})

app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl)

    if (parsedUrl.origin !== 'https://www.valeshop.com.br') {
      event.preventDefault()
    }
  })
})

app.on('second-instance', () => {
  if (mainWindow) {

    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})
app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})
