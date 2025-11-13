# 키오스크 모드 가이드

## 개요
이 애플리케이션은 1080x1920 해상도의 키오스크 디스플레이에 최적화되어 있습니다.
브라우저와 Electron 모두에서 동일한 레이아웃으로 표시됩니다.

## 화면 표시 방식

### 개발 환경 (브라우저)
- **1080x1920 컨테이너**가 화면 중앙에 표시됩니다
- 배경은 어두운 색상으로 표시되어 키오스크 영역을 명확히 구분합니다
- 화면 크기에 맞게 자동으로 스케일 조정됩니다
- 우측 상단에 키오스크 모드 토글 버튼이 표시됩니다 (개발 모드만)

### 실제 키오스크 환경
- **풀스크린**으로 표시됩니다
- 1080x1920 해상도에 정확히 맞춰집니다
- 메뉴바와 프레임이 숨겨집니다

## 브라우저에서 테스트

### 1. 개발 서버 실행
```bash
npm run dev
```

### 2. 브라우저에서 확인
http://localhost:3000 접속

### 3. 개발자 도구로 확인
1. F12를 눌러 개발자 도구 열기
2. 디바이스 툴바 토글 (Ctrl+Shift+M)
3. Dimensions를 "Responsive"로 설정
4. 가로: 1080, 세로: 1920 입력

### 4. 풀스크린 모드 테스트
- F11 키를 누르거나
- 우측 상단의 "풀스크린 시작" 버튼 클릭

## Electron에서 실행

### 개발 모드
```bash
npm run electron:dev
```
- 1080x1920 크기의 창으로 표시
- 프레임과 메뉴바 표시
- 개발자 도구 사용 가능

### 프로덕션 빌드
```bash
npm run electron:build
```
- 자동으로 풀스크린 키오스크 모드
- 프레임과 메뉴바 숨김
- ESC 키로 종료 불가 (진정한 키오스크 모드)

## 주요 기술 구현

### 1. Next.js Viewport 설정
```typescript
export const viewport: Viewport = {
  width: 1080,
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
```

### 2. CSS 키오스크 컨테이너
```css
.kiosk-container {
  width: 1080px;
  height: 1920px;
  margin: 0 auto;
  background: white;
  position: relative;
  overflow: hidden;
}
```

### 3. 반응형 스케일 조정
- 큰 화면: 1080x1920 컨테이너를 중앙에 배치하고 스케일 조정
- 작은 화면: 100vw x 100vh로 풀스크린 표시

### 4. Electron 키오스크 모드
```javascript
{
  fullscreen: !isDev,  // 프로덕션에서 풀스크린
  kiosk: !isDev,       // 프로덕션에서 키오스크 모드
  frame: isDev,        // 개발 모드에서만 프레임
  autoHideMenuBar: true
}
```

## 실제 키오스크 배포 시 주의사항

1. **해상도 확인**: 키오스크 디스플레이가 1080x1920 해상도인지 확인
2. **브라우저 설정**: 
   - 자동 로그인 설정
   - 시작 페이지를 애플리케이션 URL로 설정
   - 키오스크 모드로 실행 (`--kiosk` 플래그)
3. **Electron 사용 시**:
   - 빌드된 exe 파일을 시작 프로그램에 등록
   - 자동 재시작 스크립트 구성

## 문제 해결

### 화면이 잘리는 경우
- 브라우저 줌 레벨을 100%로 설정
- 개발자 도구에서 디바이스 픽셀 비율 확인

### 스케일이 맞지 않는 경우
- CSS의 transform scale 값 확인
- 브라우저 캐시 삭제 후 새로고침

### Electron에서 풀스크린이 안 되는 경우
- NODE_ENV가 production으로 설정되었는지 확인
- kiosk 모드 설정 확인
