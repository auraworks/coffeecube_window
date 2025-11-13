const fs = require("fs-extra");
const path = require("path");

async function prepareDeploy() {
  console.log("📦 Preparing deployment package...\n");

  const deployDir = path.join(__dirname, "..", "deploy");

  // 1. deploy 폴더 생성
  console.log("Step 1: Creating deploy directory...");
  await fs.ensureDir(deployDir);
  await fs.emptyDir(deployDir);

  // 2. 필요한 파일들 복사
  console.log("Step 2: Copying files...");

  // .next 폴더 복사
  await fs.copy(
    path.join(__dirname, "..", ".next"),
    path.join(deployDir, ".next")
  );
  console.log("✓ Copied .next");

  // public 폴더 복사
  await fs.copy(
    path.join(__dirname, "..", "public"),
    path.join(deployDir, "public")
  );
  console.log("✓ Copied public");

  // electron 폴더 복사
  await fs.copy(
    path.join(__dirname, "..", "electron"),
    path.join(deployDir, "electron")
  );
  console.log("✓ Copied electron");

  // node_modules 복사 (프로덕션 의존성만)
  console.log("✓ Copying node_modules (this may take a while)...");
  await fs.copy(
    path.join(__dirname, "..", "node_modules"),
    path.join(deployDir, "node_modules")
  );
  console.log("✓ Copied node_modules");

  // package.json 복사
  await fs.copy(
    path.join(__dirname, "..", "package.json"),
    path.join(deployDir, "package.json")
  );
  console.log("✓ Copied package.json");

  // .env.local 복사
  const envPath = path.join(__dirname, "..", ".env.local");
  if (fs.existsSync(envPath)) {
    await fs.copy(envPath, path.join(deployDir, ".env.local"));
    console.log("✓ Copied .env.local");
  }

  // next.config.js 복사
  const nextConfigPath = path.join(__dirname, "..", "next.config.ts");
  if (fs.existsSync(nextConfigPath)) {
    await fs.copy(nextConfigPath, path.join(deployDir, "next.config.ts"));
    console.log("✓ Copied next.config.ts");
  }

  // 3. 시작 스크립트 생성
  console.log("\nStep 3: Creating start scripts...");

  // Windows 시작 스크립트
  const startBat = `@echo off
echo Starting CoffeeCube Application...
echo.
echo Starting Next.js server...
start /B cmd /c "npm start > nextjs.log 2>&1"
echo Waiting for server to start...
timeout /t 5 /nobreak > nul
echo Starting Electron...
npm run electron
`;

  await fs.writeFile(path.join(deployDir, "start.bat"), startBat);
  console.log("✓ Created start.bat");

  // README 생성
  const readme = `# CoffeeCube 배포 가이드

## 사전 요구사항
- Node.js 18 이상 설치 필요

## 설치 방법

1. 이 폴더를 현장 컴퓨터로 복사합니다.

2. Node.js가 설치되어 있는지 확인합니다:
   \`\`\`
   node --version
   \`\`\`

## 실행 방법

### 방법 1: 시작 스크립트 사용 (권장)
\`start.bat\` 파일을 더블클릭하여 실행합니다.

### 방법 2: 수동 실행
1. 명령 프롬프트를 열고 이 폴더로 이동합니다.
2. 다음 명령어를 실행합니다:
   \`\`\`
   npm run deploy:start
   \`\`\`

## 종료 방법
- Electron 창을 닫으면 자동으로 종료됩니다.
- 또는 명령 프롬프트에서 Ctrl+C를 눌러 종료합니다.

## 문제 해결

### 포트 3000이 이미 사용 중인 경우
다른 프로그램이 3000 포트를 사용하고 있을 수 있습니다.
해당 프로그램을 종료하거나, package.json의 start 스크립트를 수정하여 다른 포트를 사용하세요.

### 화면이 표시되지 않는 경우
1. nextjs.log 파일을 확인하여 Next.js 서버 에러를 확인합니다.
2. .env.local 파일이 올바르게 설정되어 있는지 확인합니다.
3. F12 키를 눌러 개발자 도구를 열고 콘솔 에러를 확인합니다.
`;

  await fs.writeFile(path.join(deployDir, "README.md"), readme);
  console.log("✓ Created README.md");

  console.log("\n✅ Deployment package prepared successfully!");
  console.log(`📦 Location: ${deployDir}`);
  console.log("\n다음 단계:");
  console.log("1. deploy 폴더를 현장 컴퓨터로 복사");
  console.log("2. 현장 컴퓨터에 Node.js 설치");
  console.log("3. start.bat 실행");
}

prepareDeploy().catch((err) => {
  console.error("❌ Deployment preparation failed:", err);
  process.exit(1);
});
