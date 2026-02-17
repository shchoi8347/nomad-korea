/**
 * CityDetailPage — Page Object Model
 *
 * 도시 상세 페이지(/cities/[id])의 locator와 액션을 캡슐화합니다.
 *
 * 주요 영역:
 *  - 도시 기본 정보 (이름, 지역, 설명 등)
 *  - 지표 섹션 (생활비, 인터넷 속도, 안전 점수 등)
 *  - 날씨 / 대기질
 *  - 카페 목록
 *  - 리뷰 목록
 */
import { type Page, type Locator } from '@playwright/test'
import { ROUTES } from '../helpers/test-utils'

export class CityDetailPage {
  readonly page: Page

  // ── 기본 정보 ────────────────────────────────────────────────────────────
  readonly cityName: Locator
  readonly cityRegion: Locator

  // ── 리뷰 ────────────────────────────────────────────────────────────────
  readonly reviewItems: Locator

  constructor(page: Page) {
    this.page = page

    this.cityName = page.getByRole('heading', { level: 1 })
    this.cityRegion = page.locator('[data-testid="city-region"]')
    this.reviewItems = page.locator('[data-testid="review-item"]')
  }

  /** 도시 상세 페이지로 이동 */
  async goto(cityId: string) {
    await this.page.goto(ROUTES.city(cityId))
  }
}
