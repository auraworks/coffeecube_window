const fs = require('fs-extra');
const path = require('path');

async function postBuild() {
  try {
    console.log('Post-build: Copying static files...');
    
    const rootDir = path.join(__dirname, '..');
    const standaloneDir = path.join(rootDir, '.next', 'standalone');
    const staticDir = path.join(rootDir, '.next', 'static');
    const publicDir = path.join(rootDir, 'public');
    
    // .next/static을 standalone/.next/static으로 복사
    const targetStaticDir = path.join(standaloneDir, '.next', 'static');
    if (fs.existsSync(staticDir)) {
      await fs.copy(staticDir, targetStaticDir);
      console.log('✓ Copied .next/static to standalone/.next/static');
    }
    
    // public 폴더를 standalone/public으로 복사
    const targetPublicDir = path.join(standaloneDir, 'public');
    if (fs.existsSync(publicDir)) {
      await fs.copy(publicDir, targetPublicDir);
      console.log('✓ Copied public to standalone/public');
    }
    
    console.log('Post-build completed successfully!');
  } catch (error) {
    console.error('Post-build failed:', error);
    process.exit(1);
  }
}

postBuild();
