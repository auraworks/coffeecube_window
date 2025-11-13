# 🚀 Coffee Cube PWA 설치 가이드

다른 PC에서 Coffee Cube 키오스크를 설치하고 실행하는 방법입니다.

## 📋 사전 준비

### 1. Node.js 설치
- Node.js 18 이상 필요 (현재 22 버전 권장)
- 다운로드: https://nodejs.org/

### 2. Git 설치 (선택사항)
- Git으로 프로젝트를 클론하려면 필요
- 다운로드: https://git-scm.com/

## 📦 설치 방법

### 방법 1: Git Clone (권장)

```bash
# 1. 프로젝트 클론
git clone [repository-url]
cd coffeecube_window

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
# .env.local 파일 생성 (아래 참고)

# 4. PWA 아이콘 생성
npm run generate:icons

# 5. 개발 서버 실행
npm run dev
```

### 방법 2: ZIP 파일 다운로드

1. 프로젝트 ZIP 파일 다운로드
2. 압축 해제
3. 터미널/명령 프롬프트 열기
4. 프로젝트 폴더로 이동
5. 아래 명령어 실행:

```bash
npm install
npm run generate:icons
npm run dev
```

## 🔑 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> ⚠️ **중요**: 환경 변수가 없으면 앱이 제대로 작동하지 않습니다!

### Supabase 키 확인 방법
1. [Supabase Dashboard](https://app.supabase.com) 접속
2. 프로젝트 선택
3. Settings → API 메뉴
4. `URL`과 `anon public` 키 복사

## 🖥️ 실행 방법

### 개발 모드
```bash
npm run dev
```
- 주소: http://localhost:3000
- 핫 리로드 지원
- Service Worker 비활성화

### 프로덕션 모드
```bash
npm run build
npm start
```
- 주소: http://localhost:3000
- 최적화된 빌드
- Service Worker 활성화
- PWA 기능 전체 활성화

## 🌐 PWA로 설치하기

### Windows/Mac (Chrome/Edge)
1. 브라우저에서 `http://localhost:3000` 접속
2. 주소창 오른쪽의 **설치** 아이콘(⊕) 클릭
3. "설치" 버튼 클릭
4. 데스크톱에 앱 아이콘 생성됨

### Android
1. Chrome에서 사이트 접속
2. 메뉴(⋮) → "홈 화면에 추가"
3. "추가" 버튼 클릭

### iOS
1. Safari에서 사이트 접속
2. 공유 버튼(□↑) 클릭
3. "홈 화면에 추가" 선택
4. "추가" 버튼 클릭

## 🔧 문제 해결

### 하얀 화면만 나타나는 경우

#### 1. 환경 변수 확인
```bash
# .env.local 파일이 존재하는지 확인
dir .env.local  # Windows
ls .env.local   # Mac/Linux
```

#### 2. 의존성 재설치
```bash
# node_modules 삭제
rm -rf node_modules  # Mac/Linux
rmdir /s node_modules  # Windows

# 재설치
npm install
```

#### 3. 캐시 삭제
```bash
# .next 폴더 삭제
rm -rf .next  # Mac/Linux
rmdir /s .next  # Windows

# 재빌드
npm run dev
```

#### 4. 브라우저 콘솔 확인
1. F12 키 눌러 개발자 도구 열기
2. Console 탭에서 에러 메시지 확인
3. Network 탭에서 실패한 요청 확인

### 포트 충돌 (Port already in use)

```bash
# 다른 포트로 실행
PORT=3001 npm run dev  # Mac/Linux
set PORT=3001 && npm run dev  # Windows
```

### Node.js 버전 확인

```bash
node -v  # v18.0.0 이상이어야 함
npm -v   # 9.0.0 이상 권장
```

## 📱 네트워크 접속 (다른 기기에서 접속)

같은 네트워크의 다른 기기에서 접속하려면:

1. 개발 서버 실행 시 표시되는 Network 주소 확인:
   ```
   - Local:   http://localhost:3000
   - Network: http://192.168.x.x:3000  ← 이 주소 사용
   ```

2. 다른 기기에서 Network 주소로 접속

3. 방화벽에서 3000번 포트 허용 필요할 수 있음

## 🚀 프로덕션 배포

### Vercel (권장)
```bash
npm i -g vercel
vercel
```

### 자체 서버
```bash
# 빌드
npm run build

# PM2로 실행 (권장)
npm i -g pm2
pm2 start npm --name "coffeecube" -- start

# 또는 직접 실행
npm start
```

## 📞 지원

문제가 계속되면 다음 정보와 함께 문의하세요:
- Node.js 버전 (`node -v`)
- npm 버전 (`npm -v`)
- 운영체제
- 브라우저 콘솔 에러 메시지
- 터미널 에러 메시지

## ✅ 체크리스트

설치 전 확인사항:
- [ ] Node.js 18+ 설치됨
- [ ] npm 사용 가능
- [ ] `.env.local` 파일 생성됨
- [ ] Supabase 키 설정됨
- [ ] `npm install` 완료
- [ ] `npm run generate:icons` 완료
- [ ] `npm run dev` 실행됨
- [ ] 브라우저에서 접속 가능

모두 체크되었다면 정상 작동합니다! 🎉
