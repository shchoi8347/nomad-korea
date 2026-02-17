/**
 * 인증 — 로그인 E2E 테스트
 *
 * 커버 시나리오:
 *  - 올바른 자격증명 → /dashboard로 리다이렉트
 *  - 잘못된 비밀번호 → 에러 메시지 표시
 *  - 존재하지 않는 이메일 → 에러 메시지 표시
 *  - 이메일 미입력 → 유효성 검사 에러
 *  - 비로그인 상태로 /dashboard 접근 → /login으로 리다이렉트
 */
import { test } from '@playwright/test'

test.describe('로그인', () => {
  test.skip('올바른 자격증명으로 로그인 시 대시보드로 이동한다', async () => {})
  test.skip('잘못된 비밀번호 입력 시 에러 메시지가 표시된다', async () => {})
  test.skip('존재하지 않는 이메일 입력 시 에러 메시지가 표시된다', async () => {})
  test.skip('이메일 미입력 시 유효성 검사 에러가 표시된다', async () => {})
  test.skip('비로그인 상태에서 /dashboard 접근 시 /login으로 리다이렉트된다', async () => {})
})
