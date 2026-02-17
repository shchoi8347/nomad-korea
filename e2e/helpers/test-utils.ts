/**
 * E2E 테스트 공통 헬퍼
 *
 * URL 상수, 공통 유틸리티 함수를 모아 놓는 곳
 */

// ── URL 상수 ─────────────────────────────────────────────────────────────────

export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  city: (id: string) => `/cities/${id}`,
} as const

// ── 테스트용 계정 정보 ─────────────────────────────────────────────────────

export const TEST_USER = {
  email: process.env.E2E_TEST_EMAIL ?? 'test@example.com',
  password: process.env.E2E_TEST_PASSWORD ?? 'test1234!',
} as const

// ── 공통 도시 ID (실제 DB에 존재하는 도시) ────────────────────────────────

export const CITY_IDS = {
  jeju: 'jeju',
  seoul: 'seoul-gangnam',
  busan: 'busan-haeundae',
} as const
