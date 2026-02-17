/**
 * HomePage — Page Object Model
 *
 * 홈 페이지(/)의 locator와 액션을 캡슐화합니다.
 *
 * 주요 영역:
 *  - 검색바 (SearchBar)
 *  - 필터 (FilterSection: 예산, 지역, 환경, 계절)
 *  - 정렬 드롭다운 (SortDropdown)
 *  - 도시 카드 목록 (CityCard × N)
 *  - 좋아요/싫어요 버튼 (LikeDislikeButtons)
 *  - 빈 상태 메시지 (결과 없음)
 */
import { type Page, type Locator } from '@playwright/test'
import { ROUTES } from '../helpers/test-utils'

export class HomePage {
  readonly page: Page

  // ── 검색 ────────────────────────────────────────────────────────────────
  readonly searchInput: Locator

  // ── 필터 ────────────────────────────────────────────────────────────────
  readonly budgetFilter: Locator
  readonly regionFilter: Locator
  readonly environmentFilter: Locator
  readonly seasonFilter: Locator
  readonly resetButton: Locator

  // ── 정렬 ────────────────────────────────────────────────────────────────
  readonly sortDropdown: Locator

  // ── 결과 ────────────────────────────────────────────────────────────────
  readonly cityCards: Locator
  readonly emptyMessage: Locator
  readonly resultCount: Locator

  constructor(page: Page) {
    this.page = page

    // 검색
    this.searchInput = page.getByRole('textbox')

    // 필터 (SelectTrigger의 aria 속성 또는 data-testid로 구분 — 실제 구현 시 조정)
    this.budgetFilter = page.getByLabel('예산')
    this.regionFilter = page.getByLabel('지역')
    this.environmentFilter = page.getByLabel('환경')
    this.seasonFilter = page.getByLabel('최고 계절')
    this.resetButton = page.getByRole('button', { name: /초기화|전체 초기화/ })

    // 정렬
    this.sortDropdown = page.getByLabel('정렬')

    // 결과
    this.cityCards = page.locator('[data-testid="city-card"]')
    this.emptyMessage = page.getByText(/검색 결과가 없습니다|선택한 필터에 맞는 도시가 없습니다/)
    this.resultCount = page.locator('text=/\\d+개 도시/')
  }

  /** 홈 페이지로 이동 */
  async goto() {
    await this.page.goto(ROUTES.home)
  }

  /** 검색어 입력 */
  async search(query: string) {
    await this.searchInput.fill(query)
  }

  /** 도시 카드의 이름 목록 반환 */
  async getCityNames(): Promise<string[]> {
    return this.page.getByRole('heading', { level: 3 }).allTextContents()
  }

  /** 특정 도시 카드의 좋아요 버튼 반환 */
  likeButton(index: number): Locator {
    return this.page.getByRole('button', { name: /👍/ }).nth(index)
  }

  /** 특정 도시 카드의 싫어요 버튼 반환 */
  dislikeButton(index: number): Locator {
    return this.page.getByRole('button', { name: /👎/ }).nth(index)
  }
}
