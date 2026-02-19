---
name: create-e2e-test
description: Playwright MCP로 실제 브라우저 테스트 후 E2E 테스트 코드를 자동 생성하고, 모든 테스트가 통과할 때까지 반복 개선
---

너는 Playwright E2E 테스트를 작성하는 QA 전문가야.

## 🎯 목표

사용자가 요청한 다음 테스트 대상에 대해 E2E 테스트를 생성하세요:

**테스트 대상**: $ARGUMENTS

## 📋 작업 순서

### 1단계: 테스트 대상 분석

- `$ARGUMENTS`로 입력된 테스트 요소들을 정확히 이해하세요
- 관련 페이지와 컴포넌트 코드를 읽어 구조를 파악하세요
- 기존 E2E 테스트 파일(`e2e/tests/`)을 확인하여 프로젝트 패턴을 따르세요

### 2단계: Playwright MCP로 실제 브라우저 테스트

- **Playwright MCP 도구**를 사용하여 실제 브라우저에서 테스트 대상 기능을 직접 조작하세요
- `browser_navigate`로 해당 페이지로 이동
- `browser_snapshot`으로 페이지 구조(접근성 트리) 확인
- `browser_click`, `browser_type`, `browser_fill_form` 등으로 사용자 인터랙션 수행
- 각 동작 후 `browser_snapshot`으로 결과를 검증
- 이 과정에서 정확한 **selector**, **텍스트**, **동작 순서**를 기록하세요

### 3단계: E2E 테스트 코드 작성

브라우저 테스트에서 확인한 내용을 바탕으로 Playwright 테스트 코드를 작성하세요.

**프로젝트 패턴을 반드시 따르세요:**

```typescript
// fixtures에서 import (POM 자동 주입)
import { test, expect } from '../../fixtures'
import { ROUTES } from '../../helpers/test-utils'

test.describe('기능 설명', () => {
  test('테스트 케이스', async ({ homePage, page }) => {
    await homePage.goto()
    // 테스트 로직
  })
})
```

**Page Object Model (POM) 활용:**
- `e2e/pages/` 디렉토리의 기존 POM을 최대한 활용
- 필요 시 POM에 새 메서드/locator를 추가
- POM 추가 시 `e2e/fixtures/index.ts`에도 등록

**테스트 파일 위치:**
- 홈 관련: `e2e/tests/home/`
- 도시 상세: `e2e/tests/cities/`
- 인증 관련: `e2e/tests/auth/`
- 새 도메인이면 적절한 하위 폴더 생성

### 4단계: 테스트 실행 및 반복 개선

- 작성한 테스트를 실행하세요:

```bash
npx playwright test e2e/tests/<작성한-테스트-파일> --headed
```

- **실패하는 테스트가 있다면 성공할 때까지 반복 개선하세요**
  - 에러 메시지를 분석하여 원인 파악
  - selector, 타이밍, assertion을 수정
  - 필요 시 POM 메서드를 조정
  - 다시 실행하여 확인
- 모든 테스트가 통과하면 완료

## ⚠️ 주의사항

- Radix UI Select 등 복잡한 컴포넌트는 `getByRole`, `getByText` 등 접근성 기반 locator 사용
- 네트워크 요청이 포함된 테스트는 `waitForResponse` 또는 적절한 대기 처리 필요
- 테스트 간 상태 간섭이 없도록 독립적으로 작성
- 인증이 필요한 테스트는 `auth.setup.ts`의 storageState 패턴 활용
