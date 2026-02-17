/**
 * RegisterPage — Page Object Model
 *
 * 회원가입 페이지(/register)의 locator와 액션을 캡슐화합니다.
 */
import { type Page, type Locator } from '@playwright/test'
import { ROUTES } from '../helpers/test-utils'

export class RegisterPage {
  readonly page: Page

  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly confirmPasswordInput: Locator
  readonly submitButton: Locator
  readonly errorMessage: Locator
  readonly loginLink: Locator

  constructor(page: Page) {
    this.page = page

    this.emailInput = page.getByLabel('이메일')
    this.passwordInput = page.getByLabel('비밀번호', { exact: true })
    this.confirmPasswordInput = page.getByLabel('비밀번호 확인')
    this.submitButton = page.getByRole('button', { name: /회원가입/ })
    this.errorMessage = page.locator('[data-testid="error-message"]')
    this.loginLink = page.getByRole('link', { name: /로그인/ })
  }

  /** 회원가입 페이지로 이동 */
  async goto() {
    await this.page.goto(ROUTES.register)
  }

  /** 회원가입 폼 입력 후 제출 */
  async register(email: string, password: string, confirmPassword?: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.confirmPasswordInput.fill(confirmPassword ?? password)
    await this.submitButton.click()
  }
}
