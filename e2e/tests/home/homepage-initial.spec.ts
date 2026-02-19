/**
 * 홈 페이지 — 초기 상태 E2E 테스트
 *
 * 커버 시나리오:
 *  로고 존재 확인
 *  도시 카드 목록 존재 확인
 *  필터 초기 상태 (미적용) 확인
 *  필터 미적용 시 전체 도시 표시 확인
 */
import { test, expect } from '../../fixtures'

test.describe('홈페이지 초기 상태', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto()
  })

  test('홈페이지에 로고(노마드코리아)가 존재한다', async ({ page }) => {
    const logo = page.getByRole('link', { name: /노마드코리아/ })
    await expect(logo).toBeVisible()
    await expect(logo).toHaveAttribute('href', '/')
  })

  test('홈페이지에 도시 카드들이 존재한다', async ({ page }) => {
    // 도시 리스트 섹션의 h3 제목들 (각 카드의 도시명)
    const cityHeadings = page.locator('#cities h3[class]').filter({ hasNotText: /필터/ })
    const count = await cityHeadings.count()
    expect(count).toBeGreaterThan(0)
  })

  test('처음 접속하면 필터가 적용되어 있지 않다', async ({ page }) => {
    // 필터 헤딩에 적용 개수가 표시되지 않음 ("필터"만 표시, "필터 (N)" 아님)
    const filterHeading = page.getByRole('heading', { name: '필터', exact: true })
    await expect(filterHeading).toBeVisible()

    // 초기화 버튼이 보이지 않음 (필터 적용 시에만 나타남)
    const resetButton = page.getByRole('button', { name: /초기화/ })
    await expect(resetButton).toBeHidden()
  })

  test('필터 미적용 시 데이터베이스의 모든 도시가 카드로 나열된다', async ({ page }) => {
    // "N개 도시" 텍스트에서 표시된 도시 수 추출
    const resultText = page.getByText(/\d+개 도시/)
    await expect(resultText).toBeVisible()
    const text = await resultText.textContent()
    const displayedCount = parseInt(text!.match(/(\d+)개 도시/)![1], 10)

    // 실제 렌더링된 도시 카드 수와 일치하는지 확인
    // 도시 카드는 /cities/로 시작하는 링크를 가진 카드 내부에 위치
    const cityCardLinks = page.locator('#cities a[href^="/cities/"]')
    await expect(cityCardLinks).toHaveCount(displayedCount)

    // 최소 1개 이상의 도시가 있어야 함
    expect(displayedCount).toBeGreaterThan(0)
  })
})
