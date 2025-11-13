<h1 align="center">☕ Coffee Cube Kiosk PWA</h1>

<p align="center">
 커피박 수거 시스템 - Progressive Web App
</p>

<p align="center">
  <a href="#features"><strong>주요 기능</strong></a> ·
  <a href="#quick-start"><strong>빠른 시작</strong></a> ·
  <a href="#pwa-setup"><strong>PWA 설정</strong></a> ·
  <a href="#deployment"><strong>배포</strong></a>
</p>
<br/>

## Features

### 🚀 PWA (Progressive Web App)
- **설치 불필요**: 웹 브라우저에서 바로 사용 가능
- **오프라인 지원**: 네트워크 없이도 기본 기능 사용
- **자동 업데이트**: 새로고침만으로 최신 버전 적용
- **크로스 플랫폼**: Windows, Mac, Linux, Android, iOS 모두 지원
- **홈 화면 추가**: 앱처럼 설치하여 사용 가능

### 🛠 기술 스택
- **[Next.js 15](https://nextjs.org)** - App Router, Server Components
- **[Supabase](https://supabase.com)** - 인증 및 데이터베이스
- **[TailwindCSS](https://tailwindcss.com)** - 스타일링
- **[shadcn/ui](https://ui.shadcn.com/)** - UI 컴포넌트
- **[next-pwa](https://github.com/shadowwalker/next-pwa)** - PWA 지원

### ✨ 주요 기능
- 키오스크 모드 지원
- 다크/라이트 테마
- 반응형 디자인
- Service Worker 캐싱
- 오프라인 페이지

## Quick Start

### 1. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. 의존성 설치

```bash
npm install
```

### 3. PWA 아이콘 생성

```bash
npm run generate:icons
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 5. 프로덕션 빌드

```bash
npm run build
npm start
```

## PWA Setup

자세한 PWA 설정 방법은 [PWA_SETUP.md](./PWA_SETUP.md) 문서를 참고하세요.

### PWA 설치 방법

#### 데스크톱 (Chrome/Edge)
1. 웹사이트 접속
2. 주소창 오른쪽의 설치 아이콘(+) 클릭
3. "설치" 버튼 클릭

#### 모바일 (Android)
1. Chrome에서 웹사이트 접속
2. 메뉴(⋮) → "홈 화면에 추가"
3. "추가" 버튼 클릭

#### 모바일 (iOS)
1. Safari에서 웹사이트 접속
2. 공유 버튼(□↑) 클릭
3. "홈 화면에 추가"
4. "추가" 버튼 클릭

## Deployment

### Vercel 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

### 다른 호스팅

1. 프로덕션 빌드: `npm run build`
2. `.next` 폴더를 서버에 업로드
3. Node.js 서버에서 `npm start` 실행

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

   ```bash
   npx create-next-app --example with-supabase with-supabase-app
   ```

   ```bash
   yarn create next-app --example with-supabase with-supabase-app
   ```

   ```bash
   pnpm create next-app --example with-supabase with-supabase-app
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd with-supabase-app
   ```

4. Rename `.env.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://supabase.com/dashboard/project/_?showConnect=true)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

6. This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## Feedback and issues

Please file feedback and issues over on the [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose).

## More Supabase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)
