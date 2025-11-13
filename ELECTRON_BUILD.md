# Electron 앱 빌드 가이드

## 개요
이 프로젝트는 Next.js 앱을 Electron으로 패키징하여 데스크톱 애플리케이션으로 만듭니다.
패키징된 exe 파일을 실행하면 자동으로 Next.js 서버가 localhost:3000에서 시작되고 Electron 창이 표시됩니다.

## 빌드 프로세스

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 모드 실행
Next.js 개발 서버와 Electron을 동시에 실행:
```bash
npm run electron:dev
```

### 3. 프로덕션 빌드
Windows용 실행 파일 생성:
```bash
npm run electron:build
```

빌드가 완료되면 `dist` 폴더에 실행 파일이 생성됩니다.

## 빌드 과정 설명

1. **Next.js 빌드** (`next build`)
   - `output: 'standalone'` 모드로 빌드
   - `.next/standalone` 폴더에 독립 실행 가능한 서버 생성

2. **정적 파일 복사** (`node scripts/post-build.js`)
   - `.next/static` → `.next/standalone/.next/static`
   - `public` → `.next/standalone/public`

3. **Electron 패키징** (`electron-builder`)
   - standalone 빌드와 필요한 파일들을 포함
   - Windows 실행 파일 생성

## 실행 흐름

패키징된 exe 파일 실행 시:

1. **Electron 앱 시작**
2. **Next.js 서버 자동 시작** (localhost:3000)
3. **Electron 창 생성 및 표시**
4. **앱 종료 시 Next.js 서버도 자동 종료**

## 주요 설정 파일

- `next.config.ts`: standalone 모드 설정
- `electron/main.js`: Electron 메인 프로세스, Next.js 서버 시작 로직
- `electron-builder.yml`: 패키징 설정
- `scripts/post-build.js`: 빌드 후 파일 복사 스크립트

## 문제 해결

### 서버가 시작되지 않는 경우
- 콘솔 로그 확인 (서버 경로, 패키징 상태 등)
- `.next/standalone/server.js` 파일 존재 확인

### 화면이 표시되지 않는 경우
- localhost:3000 포트가 사용 중인지 확인
- 방화벽 설정 확인

### 빌드 실패 시
- `node_modules` 삭제 후 재설치
- `.next` 폴더 삭제 후 재빌드
