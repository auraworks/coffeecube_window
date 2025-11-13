# CoffeeCube Electron Desktop App

Next.js 앱을 Electron으로 패키징한 데스크톱 애플리케이션입니다.

## 개발 모드 실행

개발 모드에서 Electron 앱을 실행하려면:

```bash
npm run electron:dev
```

이 명령은 Next.js 개발 서버를 시작하고 Electron 창을 엽니다.

## 프로덕션 빌드

### Windows용 실행 파일 생성

```bash
npm run electron:package
```

빌드 결과물은 `dist/CoffeeCube-win32-x64` 폴더에 생성됩니다.

빌드가 완료되면 `dist/CoffeeCube-win32-x64/CoffeeCube.exe` 파일을 실행하면 됩니다.

## 프로젝트 구조

```
├── electron/
│   ├── main.js       # Electron 메인 프로세스 (Next.js 서버 내장)
├── app/              # Next.js 앱 라우트
├── components/       # React 컴포넌트
├── .next/            # Next.js 빌드 결과물
└── dist/             # Electron 패키징 결과물
    └── CoffeeCube-win32-x64/
        └── CoffeeCube.exe  # 실행 파일
```

## 주요 설정

### electron/main.js

- Next.js 서버를 내장하여 실행
- 프로덕션 모드에서 자동으로 `next start` 실행
- 개발 모드에서는 외부 Next.js 서버 사용

### package.json

- `main`: Electron 진입점 (`electron/main.js`)
- `electron:package`: electron-packager를 사용한 빌드 스크립트

## 주요 특징

1. **모든 Next.js 기능 사용 가능**: API Routes, Server Actions, Middleware 등 모든 서버 사이드 기능을 사용할 수 있습니다.

2. **Supabase 완전 지원**: 서버/클라이언트 양쪽에서 Supabase를 사용할 수 있습니다.

3. **환경 변수**: `.env.local` 파일이 패키징에 포함되어 실행 시 사용됩니다.

## 실행 방법

### 빌드된 앱 실행

1. `dist/CoffeeCube-win32-x64` 폴더로 이동
2. `CoffeeCube.exe` 파일을 더블클릭하여 실행
3. 앱이 시작되면 자동으로 Next.js 서버가 실행되고 브라우저 창이 열립니다

### 배포

`dist/CoffeeCube-win32-x64` 폴더 전체를 압축하여 배포할 수 있습니다. 사용자는 압축을 풀고 `CoffeeCube.exe`를 실행하면 됩니다.

## 트러블슈팅

### 빌드 오류 발생 시

1. `.next` 폴더 삭제 후 재빌드:
   ```bash
   Remove-Item -Recurse -Force .next
   npm run electron:package
   ```

2. `node_modules` 재설치:
   ```bash
   Remove-Item -Recurse -Force node_modules
   npm install
   ```

### 실행 파일이 시작되지 않을 때

- 첫 실행 시 Next.js 서버가 시작되는데 10초 정도 걸릴 수 있습니다
- 포트 3000이 이미 사용 중인지 확인하세요
- 환경 변수 파일(.env.local)이 제대로 포함되었는지 확인하세요
