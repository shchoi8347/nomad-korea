/**
 * DashboardPage — Page Object Model
 *
 * 대시보드 페이지(/dashboard)의 locator와 액션을 캡슐화합니다.
 */
import { type Page, type Locator } from '@playwright/test'
import { ROUTES } from '../helpers/test-utils'

export class DashboardPage {
  readonly page: Page

  readonly logoutButton: Locator
  readonly welcomeMessage: Locator

  constructor(page: Page) {
    this.page = page

    this.logoutButton = page.getByRole('button', { name: /로그아웃/ })
    this.welcomeMessage = page.locator('[data-testid="welcome-message"]')
  }

  /** 대시보드 페이지로 이동 */
  async goto() {
    await this.page.goto(ROUTES.dashboard)
  }

  /** 로그아웃 */
  async logout() {
    await this.logoutButton.click()
  }
}
