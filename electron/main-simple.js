const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

const isDev = process.env.NODE_ENV === "development";
let mainWindow;
let nextServer = null;

// Next.js 서버 시작 함수
function startNextServer() {
  return new Promise((resolve, reject) => {
    if (isDev) {
      // 개발 모드에서는 외부 서버 사용
      console.log("Development mode: Using external Next.js server");
      resolve();
      return;
    }

    // 프로덕션 모드에서 Next.js 서버 시작
    console.log("Starting Next.js server...");
    
    const isPackaged = app.isPackaged;
    const appPath = isPackaged 
      ? path.join(process.resourcesPath, "app")
      : app.getAppPath();

    // npm start 명령 실행
    const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
    nextServer = spawn(npmCmd, ["start"], {
      cwd: appPath,
      stdio: "pipe",
      shell: true,
    });

    nextServer.stdout.on("data", (data) => {
      const output = data.toString();
      console.log(`Next.js: ${output}`);
      
      // 서버가 시작되면 resolve
      if (output.includes("Local:") || output.includes("localhost:3000")) {
        console.log("Next.js server is ready!");
        resolve();
      }
    });

    nextServer.stderr.on("data", (data) => {
      console.error(`Next.js Error: ${data.toString()}`);
    });

    nextServer.on("error", (error) => {
      console.error("Failed to start Next.js server:", error);
      reject(error);
    });

    nextServer.on("close", (code) => {
      console.log(`Next.js server exited with code ${code}`);
      nextServer = null;
    });

    // 타임아웃 설정 (10초 후에도 시작 안되면 resolve)
    setTimeout(() => {
      console.log("Proceeding after timeout...");
      resolve();
    }, 10000);
  });
}

function createWindow() {
  // 이미 창이 존재하면 생성하지 않음
  if (mainWindow && !mainWindow.isDestroyed()) {
    console.log("Window already exists, focusing...");
    mainWindow.focus();
    return;
  }

  const { screen } = require("electron");
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.bounds;

  // 1080x1920 비율 유지하면서 높이를 화면에 맞춤
  const targetRatio = 1080 / 1920;
  const windowHeight = screenHeight;
  const windowWidth = Math.round(windowHeight * targetRatio);

  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: Math.round((screenWidth - windowWidth) / 2),
    y: 0,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      zoomFactor: 1.0,
    },
    icon: path.join(__dirname, "../public/favicon.ico"),
    fullscreen: false,
    kiosk: false,
    frame: false,
    autoHideMenuBar: true,
    resizable: true,
    maximizable: true,
    alwaysOnTop: !isDev,
    fullscreenable: true,
  });

  // 모바일 viewport 시뮬레이션 설정
  mainWindow.webContents.setUserAgent(
    "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36"
  );

  // 개발자 도구 열기
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  console.log(
    `Screen: ${screenWidth}x${screenHeight}, Window: ${windowWidth}x${windowHeight}`
  );

  // 외부 Next.js 서버 사용
  const startUrl = "http://localhost:3000";
  console.log("Loading URL:", startUrl);

  // 서버가 준비될 때까지 대기 후 로드
  const loadUrlWithRetry = async (retries = 30) => {
    for (let i = 0; i < retries; i++) {
      try {
        await mainWindow.loadURL(startUrl);
        console.log("Successfully loaded URL");
        return;
      } catch (err) {
        console.log(`Waiting for server... (${i + 1}/${retries})`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    console.error("Failed to load URL after retries");
  };

  loadUrlWithRetry();

  // 로딩 실패 시 에러 로그
  mainWindow.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription) => {
      console.error("Failed to load:", errorCode, errorDescription);
    }
  );

  // 페이지 로드 완료 시 스케일링 적용
  mainWindow.webContents.on("did-finish-load", () => {
    console.log("Page loaded successfully");
    applyScaling();
  });

  // 스케일링 적용 함수
  function applyScaling() {
    const bounds = mainWindow.getBounds();
    const currentWidth = bounds.width;
    const currentHeight = bounds.height;

    const scaleX = currentWidth / 1080;
    const scaleY = currentHeight / 1920;
    const scale = Math.min(scaleX, scaleY);

    mainWindow.webContents.setZoomFactor(scale);
    console.log(
      `Applied zoom factor: ${scale} (width: ${currentWidth}, height: ${currentHeight})`
    );
  }

  // F11 키로 전체 화면 토글
  let isInFullScreenMode = false;
  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (input.key === "F11" && input.type === "keyDown") {
      isInFullScreenMode = !isInFullScreenMode;

      if (isInFullScreenMode) {
        mainWindow.setFullScreen(true);
        mainWindow.setKiosk(false);
        console.log("Entering fullscreen mode");
      } else {
        mainWindow.setFullScreen(false);
        mainWindow.setKiosk(false);
        mainWindow.setBounds({
          width: windowWidth,
          height: windowHeight,
          x: Math.round((screenWidth - windowWidth) / 2),
          y: 0,
        });
        console.log("Exiting fullscreen mode");
      }

      setTimeout(() => {
        applyScaling();
      }, 100);
    }
  });

  // 창 크기 변경 시 스케일링 재적용
  mainWindow.on("resize", () => {
    applyScaling();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  console.log("Another instance is already running. Quitting...");
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(async () => {
    // Next.js 서버 시작 후 창 생성
    await startNextServer();
    createWindow();
  });
}

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  // Next.js 서버 종료
  if (nextServer) {
    console.log("Stopping Next.js server...");
    nextServer.kill();
    nextServer = null;
  }
});
