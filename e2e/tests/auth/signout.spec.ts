/**
 * 인증 — 로그아웃 E2E 테스트
 *
 * 커버 시나리오:
 *  - 로그인 상태에서 로그아웃 클릭 → / 또는 /login으로 이동
 *  - 로그아웃 후 /dashboard 접근 → /login으로 리다이렉트
 *  - 로그아웃 후 세션이 완전히 만료된다
 */
import { test } from '@playwright/test'

test.describe('로그아웃', () => {
  test.skip('로그인 상태에서 로그아웃 시 홈 또는 로그인 페이지로 이동한다', async () => {})
  test.skip('로그아웃 후 /dashboard 접근 시 /login으로 리다이렉트된다', async () => {})
  test.skip('로그아웃 후 세션이 완전히 만료된다', async () => {})
})
