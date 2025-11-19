/**
 * 테스트 모드 응답 설정
 *
 * Supabase에서 가져온 송신 명령은 그대로 사용하고,
 * 수신 응답값만 이 리스트에서 버튼별로 반환합니다.
 *
 * 사용 방법:
 * 1. buttonMockResponses 객체에 버튼명을 키로 하여 응답 배열 설정
 * 2. 각 버튼의 명령이 실행될 때마다 해당 버튼의 응답 리스트에서 순차적으로 반환
 * 3. delayMs로 각 응답의 지연 시간 설정
 */

export interface MockResponse {
  // 수신될 응답 신호
  receive: string;
  // 응답 지연 시간 (ms)
  delayMs: number;
  // 응답 성공 여부 (false면 타임아웃 시뮬레이션)
  shouldSucceed: boolean;
}

/**
 * 버튼별 테스트 응답 설정
 * 각 버튼명을 키로 하여 해당 버튼의 명령 시퀀스에 대한 응답을 정의합니다.
 */
export const buttonMockResponses: Record<string, MockResponse[]> = {
  // 관리자 페이지 버튼들의 mock 응답 추가 가능
  중량초기화: [
    {
      receive: "(OK)",
      delayMs: 500,
      shouldSucceed: true,
    },
  ],
};

/**
 * 기본 테스트 응답 리스트 (버튼명이 매칭되지 않을 때 사용)
 */
export const mockResponses: MockResponse[] = [
  {
    receive: "(SS1P)",
    delayMs: 500,
    shouldSucceed: true,
  },
  {
    receive: "(OK)",
    delayMs: 800,
    shouldSucceed: true,
  },
];

/**
 * 전역 테스트 설정
 */
export const globalTestConfig = {
  // 디버그 모드 (콘솔에 상세 로그 출력)
  debugMode: true,

  // 기본 응답 지연 시간 (mockResponses에 설정이 없을 때)
  defaultDelayMs: 500,

  // 배열 범위를 벗어났을 때 동작
  // 'repeat-last': 마지막 응답 반복
  // 'cycle': 처음부터 다시 반복
  outOfBoundsBehavior: "repeat-last" as "repeat-last" | "cycle",
};

/**
 * 현재 응답 인덱스 (내부 상태)
 * 버튼별로 별도의 인덱스를 관리
 */
const currentResponseIndexMap: Record<string, number> = {};

/**
 * 응답 인덱스 초기화
 */
export function resetResponseIndex(buttonName?: string): void {
  if (buttonName) {
    currentResponseIndexMap[buttonName] = 0;
    if (globalTestConfig.debugMode) {
      console.log(`[테스트 모드] 응답 인덱스 초기화 (버튼: ${buttonName})`);
    }
  } else {
    // 전체 초기화
    Object.keys(currentResponseIndexMap).forEach((key) => {
      currentResponseIndexMap[key] = 0;
    });
    if (globalTestConfig.debugMode) {
      console.log("[테스트 모드] 모든 응답 인덱스 초기화");
    }
  }
}

/**
 * 다음 테스트 응답 가져오기
 * @param buttonName 버튼명 (옵션)
 */
export function getNextMockResponse(buttonName?: string): MockResponse {
  // 버튼명이 제공되고 해당 버튼의 응답이 정의되어 있으면 사용
  const responses =
    buttonName && buttonMockResponses[buttonName]
      ? buttonMockResponses[buttonName]
      : mockResponses;

  if (responses.length === 0) {
    // 응답이 하나도 없으면 기본값 반환
    return {
      receive: "OK",
      delayMs: globalTestConfig.defaultDelayMs,
      shouldSucceed: true,
    };
  }

  // 버튼별 인덱스 가져오기
  const indexKey = buttonName || "default";
  if (currentResponseIndexMap[indexKey] === undefined) {
    currentResponseIndexMap[indexKey] = 0;
  }
  const currentIndex = currentResponseIndexMap[indexKey];

  let response: MockResponse;

  if (currentIndex < responses.length) {
    // 정상 범위 내
    response = responses[currentIndex];
  } else {
    // 범위를 벗어난 경우
    if (globalTestConfig.outOfBoundsBehavior === "cycle") {
      // 처음부터 다시
      const cycleIndex = currentIndex % responses.length;
      response = responses[cycleIndex];
    } else {
      // 마지막 응답 반복
      response = responses[responses.length - 1];
    }
  }

  if (globalTestConfig.debugMode) {
    console.log(
      `[테스트 모드] 응답 인덱스 ${currentIndex} (버튼: ${
        buttonName || "기본"
      }): ${response.receive} (${response.delayMs}ms)`
    );
  }

  currentResponseIndexMap[indexKey]++;
  return response;
}

/**
 * 현재 응답 인덱스 조회
 * @param buttonName 버튼명 (옵션)
 */
export function getCurrentResponseIndex(buttonName?: string): number {
  const indexKey = buttonName || "default";
  return currentResponseIndexMap[indexKey] || 0;
}

/**
 * 총 응답 개수 조회
 * @param buttonName 버튼명 (옵션)
 */
export function getTotalResponseCount(buttonName?: string): number {
  if (buttonName && buttonMockResponses[buttonName]) {
    return buttonMockResponses[buttonName].length;
  }
  return mockResponses.length;
}
