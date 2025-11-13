# CoffeeCube 패키징 가이드

## 문제 해결

### 다른 PC에서 실행 시 흰 화면 또는 앱이 실행되지 않는 경우

#### 원인
1. `.next/standalone` 폴더가 패키징되지 않음
2. 환경 변수 파일(`.env.local`)이 누락됨
3. Node.js가 설치되지 않은 PC에서 실행

#### 해결 방법

### 1. 올바른 패키징 명령 사용

```bash
# 기존 dist 폴더 삭제
rm -rf dist

# 올바른 패키징 실행
npm run electron:package
```

**중요**: `electron:package` 스크립트를 사용해야 합니다. 이 스크립트는:
- Next.js 빌드
- `.next/standalone` 폴더 복사
- `.env.local` 파일 복사
- 필요한 모든 파일을 패키징

### 2. 패키징 확인

패키징 후 다음 파일들이 존재하는지 확인:

```
dist/CoffeeCube-win32-x64/
├── resources/
│   └── app/
│       ├── .next/
│       │   └── standalone/
│       │       ├── server.js  ← 이 파일이 반드시 있어야 함
│       │       ├── .next/
│       │       │   └── static/
│       │       ├── public/
│       │       └── node_modules/
│       ├── .env.local  ← 환경 변수 파일
│       └── electron/
└── CoffeeCube.exe
```

### 3. 다른 PC에 배포

#### 필요한 것
- **아무것도 필요 없음!** Electron에 Node.js가 내장되어 있습니다.

#### 배포 방법
1. `dist/CoffeeCube-win32-x64` 폴더 전체를 복사
2. 대상 PC에 붙여넣기
3. `CoffeeCube.exe` 실행

### 4. 문제 발생 시 디버깅

#### CMD 창이 뜨는 경우
- Next.js 서버가 실행되고 있는 것입니다 (정상)
- 5초 정도 기다리면 앱 창이 나타납니다

#### 에러 다이얼로그가 뜨는 경우
에러 메시지를 확인하세요:
- "Next.js server files not found" → 패키징을 다시 실행하세요
- "Failed to start Next.js server" → 3000번 포트가 사용 중일 수 있습니다

#### 로그 확인
개발자 도구를 열어 콘솔 로그 확인:
- Electron 창에서 `Ctrl+Shift+I` (개발 모드에서만 가능)
- 또는 CMD 창에서 출력되는 로그 확인

## 개발 모드 실행

```bash
npm run electron:dev
```

## 프로덕션 빌드 및 패키징

```bash
# 전체 과정
npm run electron:package

# 또는 단계별로
npm run build              # Next.js 빌드
npm run electron:package   # Electron 패키징
```

## 주요 기능

- **F11**: 전체 화면 모드 토글
- **ESC**: 전체 화면 모드 종료
- 1080x1920 콘텐츠를 화면 크기에 맞게 자동 스케일링

## 기술 스택

- Electron 39.1.2
- Next.js 15.5.2 (Standalone mode)
- React 19.0.0
- Supabase
- TailwindCSS + shadcn/ui
