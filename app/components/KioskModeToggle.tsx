"use client";

import { useEffect, useState } from "react";

export default function KioskModeToggle() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // 개발 환경에서만 표시
    if (process.env.NODE_ENV !== 'development') return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // F11 키로 풀스크린 토글
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // 프로덕션 환경에서는 렌더링하지 않음
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 text-white px-4 py-2 rounded-lg text-sm">
      <div className="flex flex-col gap-2">
        <div>키오스크 모드 (1080x1920)</div>
        <div className="text-xs opacity-70">
          F11: 풀스크린 토글 {isFullscreen ? '(활성)' : '(비활성)'}
        </div>
        <button
          onClick={toggleFullscreen}
          className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary/80"
        >
          {isFullscreen ? '풀스크린 종료' : '풀스크린 시작'}
        </button>
      </div>
    </div>
  );
}
