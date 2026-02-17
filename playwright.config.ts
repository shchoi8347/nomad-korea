import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright E2E 테스트 설정
 *
 * 유닛 테스트 (Vitest): npm run test
 * E2E 테스트 (Playwright): npm run test:e2e
 */
export default defineConfig({
  // 테스트 파일 위치
  testDir: './e2e/tests',

  // 각 테스트의 최대 실행 시간
  timeout: 30_000,

  // expect() assertion 최대 대기 시간
  expect: {
    timeout: 5_000,
  },

  // CI 환경에서는 재시도 없이, 로컬에서는 1회 재시도
  retries: process.env.CI ? 2 : 1,

  // 병렬 실행 워커 수
  workers: process.env.CI ? 1 : undefined,

  // 테스트 리포터
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  // 모든 프로젝트에 적용되는 공통 설정
  use: {
    // 앱 기본 URL
    baseURL: 'http://localhost:3000',

    // 테스트 실패 시 트레이스 저장 (첫 번째 재시도부터)
    trace: 'on-first-retry',

    // 테스트 실패 시 스크린샷 저장
    screenshot: 'only-on-failure',

    // 테스트 실패 시 비디오 저장
    video: 'retain-on-failure',
  },

  // 테스트할 브라우저 프로젝트
  // TODO: 실제 테스트 작성 시 auth setup 프로젝트 추가
  //   - name: 'setup' (testMatch: 'e2e/fixtures/auth.setup.ts')
  //   - name: 'chromium' with storageState (dependencies: ['setup'])
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // 테스트 실행 전 Next.js 개발 서버 자동 시작
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },

  // 결과물 저장 위치
  outputDir: 'test-results',
})
