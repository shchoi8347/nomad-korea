/**
 * 홈 페이지 — 검색 기능 E2E 테스트
 *
 * 커버 시나리오:
 *  - 한글 검색 → 매칭 도시만 표시
 *  - 영문 소문자 검색 → 매칭 도시만 표시
 *  - 영문 대문자 검색 → case-insensitive 작동
 *  - 결과 없는 검색어 → 빈 상태 메시지 표시
 *  - 검색어 삭제 → 전체 목록 복원
 *  - 검색 중 결과 카운트 업데이트
 */
import { test } from '@playwright/test'

test.describe('홈 검색', () => {
  test.skip('한글 검색어 입력 시 매칭 도시만 표시된다', async () => {})
  test.skip('영문 소문자 검색 시 매칭 도시만 표시된다', async () => {})
  test.skip('영문 대문자 검색 시 case-insensitive로 매칭된다', async () => {})
  test.skip('매칭 결과 없는 검색어 입력 시 빈 상태 메시지가 표시된다', async () => {})
  test.skip('검색어를 지우면 전체 도시 목록이 복원된다', async () => {})
  test.skip('검색 결과에 따라 "N개 도시" 카운트가 업데이트된다', async () => {})
})
