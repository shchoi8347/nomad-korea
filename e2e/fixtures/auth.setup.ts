/**
 * Auth Setup — Playwright Global Setup
 *
 * 로그인 플로우를 한 번 실행하여 storageState(쿠키/토큰)를
 * e2e/.auth/user.json 에 저장합니다.
 *
 * playwright.config.ts의 'setup' 프로젝트에서 testMatch로 지정됩니다.
 * 이후 'chromium' 프로젝트는 저장된 storageState를 재사용하여
 * 매 테스트마다 로그인을 반복하지 않습니다.
 *
 * 실제 구현은 테스트 작성 단계에서 채워집니다.
 */
import { test as setup, expect } from '@playwright/test'
import { ROUTES, TEST_USER } from '../helpers/test-utils'

const AUTH_FILE = 'e2e/.auth/user.json'

setup('로그인 상태 저장', async ({ page }) => {
  // TODO: 실제 로그인 로직 구현
  // await page.goto(ROUTES.login)
  // await page.getByLabel('이메일').fill(TEST_USER.email)
  // await page.getByLabel('비밀번호').fill(TEST_USER.password)
  // await page.getByRole('button', { name: '로그인' }).click()
  // await expect(page).toHaveURL(ROUTES.dashboard)
  // await page.context().storageState({ path: AUTH_FILE })

  // placeholder: 빈 storageState 저장
  await page.context().storageState({ path: AUTH_FILE })
})
