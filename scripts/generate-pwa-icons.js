const fs = require('fs');
const path = require('path');

// Sharp 라이브러리를 사용하여 아이콘 생성
// npm install sharp 필요

async function generateIcons() {
  try {
    const sharp = require('sharp');
    const logoPath = path.join(__dirname, '../public/logo.svg');
    const publicDir = path.join(__dirname, '../public');

    if (!fs.existsSync(logoPath)) {
      console.error('❌ logo.svg 파일을 찾을 수 없습니다.');
      console.log('📝 public/logo.svg 파일을 먼저 준비해주세요.');
      return;
    }

    const sizes = [192, 256, 384, 512];

    console.log('🎨 PWA 아이콘 생성 중...\n');

    for (const size of sizes) {
      const outputPath = path.join(publicDir, `icon-${size}x${size}.png`);
      
      await sharp(logoPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputPath);

      console.log(`✅ icon-${size}x${size}.png 생성 완료`);
    }

    console.log('\n🎉 모든 PWA 아이콘이 생성되었습니다!');
    console.log('📁 위치: public/icon-*.png');
    
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error('❌ sharp 패키지가 설치되지 않았습니다.');
      console.log('📦 다음 명령어를 실행하세요: npm install --save-dev sharp');
    } else {
      console.error('❌ 아이콘 생성 중 오류 발생:', error.message);
    }
  }
}

generateIcons();
