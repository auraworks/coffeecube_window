# PWA 설정 가이드

## 개요
이 프로젝트는 PWA(Progressive Web App)로 구성되어 있습니다. 별도의 설치 프로그램 없이 웹 브라우저에서 앱처럼 사용할 수 있습니다.

## 필수 설정

### 1. 환경 변수 설정
다른 PC에서 실행하려면 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. PWA 아이콘 생성
`public` 폴더에 다음 아이콘들을 추가해야 합니다:

- `icon-192x192.png` (192x192px)
- `icon-256x256.png` (256x256px)
- `icon-384x384.png` (384x384px)
- `icon-512x512.png` (512x512px)

#### 아이콘 생성 방법:
1. 기존 `logo.svg` 파일을 사용
2. 온라인 도구 사용: https://realfavicongenerator.net/
3. 또는 아래 명령어로 자동 생성 (ImageMagick 필요):

```bash
# logo.svg를 PNG로 변환
convert logo.svg -resize 192x192 public/icon-192x192.png
convert logo.svg -resize 256x256 public/icon-256x256.png
convert logo.svg -resize 384x384 public/icon-384x384.png
convert logo.svg -resize 512x512 public/icon-512x512.png
```

### 3. 스크린샷 (선택사항)
PWA 스토어 등록을 위해 스크린샷을 추가할 수 있습니다:

- `screenshot-wide.png` (1920x1080px) - 데스크톱용
- `screenshot-narrow.png` (1080x1920px) - 모바일용

## 설치 및 실행

### 개발 환경
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

개발 모드에서는 Service Worker가 비활성화됩니다.

### 프로덕션 빌드
```bash
# 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## PWA 설치 방법

### 데스크톱 (Chrome/Edge)
1. 웹사이트 접속
2. 주소창 오른쪽의 설치 아이콘(+) 클릭
3. "설치" 버튼 클릭

### 모바일 (Android)
1. 웹사이트 접속
2. 메뉴(⋮) → "홈 화면에 추가" 선택
3. "추가" 버튼 클릭

### 모바일 (iOS)
1. Safari에서 웹사이트 접속
2. 공유 버튼(□↑) 클릭
3. "홈 화면에 추가" 선택
4. "추가" 버튼 클릭

## 주요 기능

### 오프라인 지원
- 캐싱 전략을 통해 오프라인에서도 기본 기능 사용 가능
- 네트워크 연결이 끊어지면 `/offline` 페이지 표시

### 캐싱 전략
- **이미지/폰트**: StaleWhileRevalidate (캐시 우선, 백그라운드 업데이트)
- **JS/CSS**: StaleWhileRevalidate (24시간 캐시)
- **API 데이터**: NetworkFirst (네트워크 우선, 실패 시 캐시)
- **페이지**: NetworkFirst (최신 데이터 우선)

## 배포

### Vercel 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

### 다른 호스팅
1. `npm run build` 실행
2. `.next` 폴더를 서버에 업로드
3. Node.js 서버에서 `npm start` 실행

## 문제 해결

### 하얀 화면이 나타나는 경우
1. `.env.local` 파일 확인
2. `npm install` 재실행
3. `.next` 폴더 삭제 후 재빌드
4. 브라우저 콘솔(F12)에서 에러 확인

### Service Worker 업데이트
브라우저에서 강력 새로고침:
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

### 캐시 초기화
```javascript
// 브라우저 콘솔에서 실행
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.unregister());
  });
}
```

## 장점

### Electron 대비 PWA의 장점
1. **간편한 배포**: 웹 URL만 공유하면 됨
2. **자동 업데이트**: 새로고침만으로 최신 버전 사용
3. **크로스 플랫폼**: Windows, Mac, Linux, Android, iOS 모두 지원
4. **용량 절약**: 별도 설치 파일 불필요
5. **유지보수 용이**: 서버에서 한 번만 업데이트하면 모든 사용자에게 적용

## 참고 자료
- [Next.js PWA 문서](https://github.com/shadowwalker/next-pwa)
- [PWA 가이드](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
