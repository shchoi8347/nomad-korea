# nomad-korea — CLAUDE.md

한국 디지털 노마드를 위한 도시 정보 플랫폼.
도시 검색/필터/정렬, 좋아요/싫어요, 리뷰 기능을 제공한다.

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4, shadcn/ui (Radix UI) |
| 백엔드 | Supabase (PostgreSQL, Auth, Storage) |
| 유닛 테스트 | Vitest 4 + React Testing Library |
| E2E 테스트 | Playwright 1.58 (Chromium) |
| 언어 | TypeScript 5 |

---

## 주요 명령어

```bash
npm run dev           # 개발 서버 (http://localhost:3000)
npm run build         # 프로덕션 빌드
npm run test          # 유닛 테스트 (Vitest, 1회 실행)
npm run test:watch    # 유닛 테스트 (watch 모드)
npm run test:e2e      # E2E 테스트 실행 (next dev 자동 시작)
npm run test:e2e:ui   # Playwright UI 모드
npm run test:e2e:report  # 마지막 리포트 열기
```

---

## 프로젝트 구조

```
nomad-korea/
├── app/                        # Next.js App Router 페이지
│   ├── page.tsx                # 홈 (/)
│   ├── cities/[id]/page.tsx    # 도시 상세 (/cities/:id)
│   ├── login/page.tsx          # 로그인
│   ├── register/page.tsx       # 회원가입
│   ├── dashboard/page.tsx      # 대시보드 (로그인 필요)
│   └── api/auth/               # 인증 API 라우트
├── components/
│   ├── cities/city-card.tsx    # 도시 카드 컴포넌트
│   ├── home/                   # 홈 페이지 섹션 컴포넌트
│   │   ├── popular-cities.tsx  # 검색/필터/정렬 통합 컨테이너
│   │   ├── filter-section.tsx  # 예산/지역/환경/계절 필터 (Radix Select)
│   │   └── sort-dropdown.tsx   # 정렬 드롭다운 (Radix Select)
│   └── ui/
│       └── like-dislike-buttons.tsx  # 좋아요/싫어요 (낙관적 업데이트)
├── lib/
│   ├── types.ts                # 공통 타입 (City, Review, Cafe 등)
│   ├── utils.ts                # cn() 유틸리티
│   └── supabase/
│       ├── client.ts           # 브라우저용 Supabase 클라이언트
│       ├── server.ts           # 서버용 Supabase 클라이언트
│       └── queries.ts          # DB 쿼리 함수 (getCities, getCityById 등)
├── __tests__/                  # 유닛 테스트 (Vitest)
├── e2e/                        # E2E 테스트 (Playwright)
├── playwright.config.ts
└── vitest.config.ts
```

---

## 핵심 구현 패턴

### 좋아요/싫어요 (`like-dislike-buttons.tsx`)
- **낙관적 업데이트**: 클릭 즉시 UI 반영 → RPC 호출 → 실패 시 롤백
- **RPC**: `handle_city_like(p_city_id, p_old_action, p_new_action)` SECURITY DEFINER 함수
- anon/authenticated 롤 모두 허용 (비로그인 사용자도 동작)

### Supabase 쿼리 (`queries.ts`)
- DB snake_case → TypeScript camelCase 매핑 (mapCity, mapCafe, mapReview)
- `createClient()`는 서버 컴포넌트에서 `await`로 호출

---

## 유닛 테스트 구조 (`__tests__/`)

Vitest + React Testing Library + jsdom 환경

```
__tests__/
├── lib/
│   ├── utils.test.ts                   # cn() 함수 (7개)
│   └── supabase/queries.test.ts        # mapCity/mapCafe/mapReview/getCities 등 (30개)
└── components/
    ├── cities/city-card.test.tsx        # CityCard 렌더링/링크/뱃지 (18개)
    ├── home/popular-cities.test.tsx     # 검색/필터/정렬/좋아요 (22개)
    └── ui/like-dislike-buttons.test.tsx # 낙관적 업데이트/RPC/롤백 (23개)
```

**주의사항:**
- Radix UI Select는 jsdom에서 `hasPointerCapture` 미구현으로 작동 불가
- `FilterSection`, `SortDropdown`은 테스트에서 네이티브 `<select>`로 모킹
- 상호작용은 `userEvent.selectOptions()` 사용 (click 체인 불가)

---

## E2E 테스트 구조 (`e2e/`)

Playwright 1.58 + Chromium, 실제 브라우저에서 Next.js 앱과 Supabase를 연동하여 검증

### 폴더 구조

```
e2e/
├── fixtures/
│   ├── index.ts            # POM을 fixture로 주입하는 커스텀 test 객체
│   │                       # (실제 테스트 작성 시 이 파일에서 import)
│   └── auth.setup.ts       # 로그인 후 storageState를 e2e/.auth/user.json에 저장
│                           # (playwright.config.ts의 'setup' 프로젝트에서 실행)
├── helpers/
│   └── test-utils.ts       # ROUTES, TEST_USER, CITY_IDS 상수 모음
├── pages/                  # Page Object Model (POM)
│   ├── home.page.ts        # HomePage: searchInput, budgetFilter, cityCards, likeButton()
│   ├── city-detail.page.ts # CityDetailPage: cityName, reviewItems
│   ├── login.page.ts       # LoginPage: emailInput, login() 메서드
│   ├── register.page.ts    # RegisterPage: 회원가입 폼, register() 메서드
│   └── dashboard.page.ts   # DashboardPage: logoutButton, logout() 메서드
└── tests/                  # 테스트 스펙 파일
    ├── home/
    │   ├── search.spec.ts          # 한글/영문/대소문자/빈결과/복원 (6개)
    │   ├── filter.spec.ts          # 예산/지역/환경/계절/복합/초기화 (10개)
    │   ├── sort.spec.ts            # likes-desc/asc, name-asc/desc (5개)
    │   └── like-dislike.spec.ts    # +1/-1/전환/DB 영속성 (6개)
    ├── cities/
    │   └── city-detail.spec.ts     # 카드 클릭/정보/지표/not-found (6개)
    └── auth/
        ├── login.spec.ts           # 성공/실패/리다이렉트 (5개)
        ├── register.spec.ts        # 성공/중복/불일치/형식 (5개)
        └── signout.spec.ts         # 로그아웃 후 세션 만료 (3개)
```

### 사용 패턴

```typescript
// 테스트 작성 시 fixtures에서 import (POM 자동 주입)
import { test, expect } from '../../fixtures'
import { ROUTES } from '../../helpers/test-utils'

test('검색 테스트', async ({ homePage }) => {
  await homePage.goto()
  await homePage.search('제주')
  await expect(page.getByText('제주시')).toBeVisible()
})
```

### Auth Setup 패턴 (실제 테스트 작성 시)

`playwright.config.ts`에서 `setup` 프로젝트 주석 해제 후 사용:

```typescript
// playwright.config.ts projects 수정
{ name: 'setup', testMatch: 'e2e/fixtures/auth.setup.ts' },
{
  name: 'chromium',
  use: { storageState: 'e2e/.auth/user.json' },
  dependencies: ['setup'],
},
```

### 환경변수 (`e2e/helpers/test-utils.ts`)

```
E2E_TEST_EMAIL     # 테스트용 Supabase 계정 이메일
E2E_TEST_PASSWORD  # 테스트용 Supabase 계정 비밀번호
```

### .gitignore 항목

```
/test-results/       # Playwright 실패 아티팩트
/playwright-report/  # HTML 리포트
/e2e/.auth/          # 로그인 storageState (보안)
```

---

## 테스트 전략 요약

| 레이어 | 도구 | 대상 | 속도 |
|--------|------|------|------|
| 유닛 | Vitest + jsdom | 컴포넌트 로직, 쿼리 매핑 | ~9초 (100개) |
| E2E | Playwright + Chromium | 실제 유저 플로우, DB 영속성 | 분 단위 (45개) |
