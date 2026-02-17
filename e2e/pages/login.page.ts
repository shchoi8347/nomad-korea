/**
 * LoginPage — Page Object Model
 *
 * 로그인 페이지(/login)의 locator와 액션을 캡슐화합니다.
 */
import { type Page, type Locator } from '@playwright/test'
import { ROUTES } from '../helpers/test-utils'

export class LoginPage {
  readonly page: Page

  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator
  readonly errorMessage: Locator
  readonly registerLink: Locator

  constructor(page: Page) {
    this.page = page

    this.emailInput = page.getByLabel('이메일')
    this.passwordInput = page.getByLabel('비밀번호')
    this.submitButton = page.getByRole('button', { name: /로그인/ })
    this.errorMessage = page.locator('[data-testid="error-message"]')
    this.registerLink = page.getByRole('link', { name: /회원가입/ })
  }

  /** 로그인 페이지로 이동 */
  async goto() {
    await this.page.goto(ROUTES.login)
  }

  /** 이메일 + 비밀번호 입력 후 제출 */
  async login(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }
}
