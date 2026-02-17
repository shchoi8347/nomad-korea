/**
 * Custom Playwright Fixtures
 *
 * 모든 spec 파일은 '@playwright/test' 대신 이 파일에서 test를 import합니다.
 *
 *   import { test, expect } from '@/e2e/fixtures'
 *   (또는 상대경로 '../../fixtures')
 *
 * 현재는 base test를 그대로 re-export합니다.
 * 인증 상태, 공통 page fixture 등은 테스트 작성 단계에서 확장됩니다.
 */
import { test as base, expect } from '@playwright/test'
import { HomePage } from '../pages/home.page'
import { LoginPage } from '../pages/login.page'
import { RegisterPage } from '../pages/register.page'
import { DashboardPage } from '../pages/dashboard.page'
import { CityDetailPage } from '../pages/city-detail.page'

// Fixture 타입 정의
type Pages = {
  homePage: HomePage
  loginPage: LoginPage
  registerPage: RegisterPage
  dashboardPage: DashboardPage
  cityDetailPage: CityDetailPage
}

// base test에 POM fixture 주입
export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page))
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page))
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page))
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page))
  },
  cityDetailPage: async ({ page }, use) => {
    await use(new CityDetailPage(page))
  },
})

export { expect }
