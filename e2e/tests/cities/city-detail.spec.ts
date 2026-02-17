/**
 * 도시 상세 페이지 — E2E 테스트
 *
 * 커버 시나리오:
 *  - 도시 카드 클릭 → /cities/[id] 로 이동
 *  - 도시 이름, 지역, 설명 등 기본 정보 렌더링 확인
 *  - 생활비, 인터넷 속도, 안전 점수 등 지표 표시 확인
 *  - 카페 목록 표시 확인
 *  - 리뷰 목록 표시 확인
 *  - 존재하지 않는 도시 ID → not-found 페이지
 */
import { test } from '@playwright/test'

test.describe('도시 상세 페이지', () => {
  test.skip('홈에서 도시 카드 클릭 시 상세 페이지로 이동한다', async () => {})
  test.skip('도시 이름과 지역 정보가 올바르게 표시된다', async () => {})
  test.skip('생활비, 인터넷 속도, 안전 점수 지표가 표시된다', async () => {})
  test.skip('카페 목록이 표시된다', async () => {})
  test.skip('리뷰 목록이 표시된다', async () => {})
  test.skip('존재하지 않는 도시 ID로 접근 시 not-found 페이지가 표시된다', async () => {})
})
