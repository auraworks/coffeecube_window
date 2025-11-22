const fs = require("fs-extra");
const path = require("path");
const { execSync } = require("child_process");

async function buildElectron() {
  try {
    console.log("Step 1: Building Python server...");
    const serverDir = path.join(__dirname, "..", "server");
    const serverBuildScript = path.join(serverDir, "build.bat");

    if (fs.existsSync(serverBuildScript)) {
      try {
        execSync(`cmd /c "${serverBuildScript}"`, {
          stdio: "inherit",
          cwd: serverDir,
        });
        console.log("✓ Python server built successfully");
      } catch (err) {
        console.warn("⚠ Python server build failed, continuing without it...");
      }
    } else {
      console.warn("⚠ Python server build script not found, skipping...");
    }

    console.log("\nStep 2: Building Next.js...");
    execSync("next build", { stdio: "inherit" });

    console.log("\nStep 3: Running post-build...");
    execSync("node scripts/post-build.js", { stdio: "inherit" });

    console.log("\nStep 4: Building with electron-builder...");
    execSync("electron-builder --win --x64", {
      stdio: "inherit",
      env: { ...process.env, CSC_IDENTITY_AUTO_DISCOVERY: "false" },
    });

    console.log("\n✅ Build completed successfully!");
    console.log("📦 Build output location: dist");
    console.log("\n생성된 파일:");
    console.log("  - CoffeeCube Setup (설치 프로그램)");
    console.log("  - CoffeeCube-Portable.exe (단일 실행 파일)");
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

buildElectron();
