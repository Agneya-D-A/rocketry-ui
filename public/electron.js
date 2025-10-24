const {app, BrowserWindow, screen, session} = require('electron');
const path = require('path'); // 👈 Required for path manipulation
const url = require('url');   // 👈 Required for file protocol formatting

let wind;

function getInitialCoords() {
    // process.argv contains: [node_path, app_path, arg1, arg2, ...]
    const args = process.argv.slice(2); 
    
    // Look for a specific flag, e.g., --coords="40.7128,-74.0060"
    const coordArg = args.find(arg => arg.startsWith('--coords='));
    
    if (coordArg) {
        // Extract the value after the '='
        return coordArg.split('=')[1];
    }
    
    // Return null or a default value if not found
    return null; 
}

function createWindow(){

    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    wind = new BrowserWindow({
        width: width,
        height: height,
        icon: 'rocketry_icon.ico',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    // 🛑 CRITICAL CHANGE: Load the local index.html file
    const startUrl = url.format({
        protocol: 'file',
        // __dirname points to the folder containing the main script (dist/win-unpacked/resources/app)
        // We navigate up once (..) and then into the 'build' equivalent folder for index.html
        // The path depends on your builder configuration, but this is the most common fix:
        pathname: path.join(__dirname, '..', 'build', 'index.html'), 
        slashes: true
    });
    
    // Fallback for some builder configurations where the content is at the root
    // Alternatively try: path.join(__dirname, 'index.html') 
    
    wind.loadURL(startUrl); // 👈 Load the file protocol URL

    // Optional: Open DevTools for debugging (remove for final production)
    // wind.webContents.openDevTools(); 

    wind.on('closed',()=>{
        wind = null;
    })
}

app.on('ready',()=>{

    const coordsStr = getInitialCoords();
    if (coordsStr) {
        // Argument was provided: Split and assign
        const [lat, lon] = coordsStr.split(",").map(Number);
        global.LAT = lat;
        global.LON = lon;
    } else {
        // No argument provided: Use the hardcoded fallback from your React component
        global.LAT = 26.71959705196945; 
        global.LON = 84.30396473221639
    }
    session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
        if (permission === 'geolocation') {
          callback(true); 
        } else {
          callback(false);
        }
    });
    createWindow();
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
});
  
app.on('activate', () => {
    if (wind === null) {
        createWindow();
    }
});