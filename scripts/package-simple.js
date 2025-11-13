const { execSync } = require("child_process");
const fs = require("fs-extra");
const path = require("path");

async function packageApp() {
  try {
    console.log("📦 Starting packaging process...\n");

    // Step 1: Next.js 빌드
    console.log("Step 1: Building Next.js...");
    execSync("next build", { stdio: "inherit" });

    // Step 2: Electron Packager로 패키징
    console.log("\nStep 2: Packaging with electron-packager...");
    execSync(
      'electron-packager . CoffeeCube --platform=win32 --arch=x64 --out=dist --overwrite --icon=public/favicon.ico --electron-version=39.1.2',
      { stdio: "inherit" }
    );

    // Step 3: 필요한 파일들을 패키지에 복사
    console.log("\nStep 3: Copying required files to packaged app...");
    
    const packagedAppPath = path.join(__dirname, "..", "dist", "CoffeeCube-win32-x64", "resources", "app");
    
    // .next 폴더 복사
    await fs.copy(
      path.join(__dirname, "..", ".next"),
      path.join(packagedAppPath, ".next")
    );
    console.log("✓ Copied .next");

    // public 폴더 복사
    await fs.copy(
      path.join(__dirname, "..", "public"),
      path.join(packagedAppPath, "public")
    );
    console.log("✓ Copied public");

    // .env.local 복사
    const envPath = path.join(__dirname, "..", ".env.local");
    if (fs.existsSync(envPath)) {
      await fs.copy(envPath, path.join(packagedAppPath, ".env.local"));
      console.log("✓ Copied .env.local");
    }

    // Step 4: 시작 스크립트 생성
    console.log("\nStep 4: Creating startup script...");
    
    const distPath = path.join(__dirname, "..", "dist", "CoffeeCube-win32-x64");

    // README 생성
    const readme = `# CoffeeCube 실행 가이드

## 사전 요구사항
- Node.js 18 이상이 설치되어 있어야 합니다.
- https://nodejs.org 에서 다운로드 및 설치

## 실행 방법

**간단 실행**: \`CoffeeCube.exe\`를 더블클릭하면 됩니다!
- Next.js 서버가 자동으로 시작됩니다.
- 첫 실행 시 10초 정도 소요될 수 있습니다.

## 종료 방법
- Electron 창을 닫으면 Next.js 서버도 자동으로 종료됩니다.

## 문제 해결

### 화면이 표시되지 않는 경우
1. Node.js가 제대로 설치되어 있는지 확인합니다.
   명령 프롬프트에서: \`node --version\`
2. 포트 3000이 다른 프로그램에서 사용 중인지 확인합니다.
3. 개발자 도구(F12)를 열어 콘솔 에러를 확인합니다.

### 포트 충돌 시
다른 프로그램이 3000 포트를 사용하고 있다면:
1. 해당 프로그램을 종료하거나
2. \`resources\\app\\package.json\`에서 포트를 변경하세요.
   (start 스크립트에 \`-p 3001\` 추가)

## 폴더 구조
- \`CoffeeCube.exe\`: Electron 실행 파일 (이것만 실행하면 됩니다!)
- \`resources/app/\`: Next.js 앱 파일들
`;

    await fs.writeFile(path.join(distPath, "README.md"), readme);
    console.log("✓ Created README.md");

    console.log("\n✅ Packaging completed successfully!");
    console.log(`📦 Packaged app location: ${distPath}`);
    console.log("\n다음 단계:");
    console.log("1. dist/CoffeeCube-win32-x64 폴더를 현장 컴퓨터로 복사");
    console.log("2. 현장 컴퓨터에 Node.js 설치");
    console.log("3. CoffeeCube.exe 실행 (자동으로 Next.js 서버가 시작됩니다)");
  } catch (error) {
    console.error("❌ Packaging failed:", error);
    process.exit(1);
  }
}

packageApp();
