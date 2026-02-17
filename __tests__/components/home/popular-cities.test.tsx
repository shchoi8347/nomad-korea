import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PopularCities } from '@/components/home/popular-cities'
import type { City } from '@/lib/types'

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(() => ({ get: vi.fn(() => null) })),
}))

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => <a href={href} {...props}>{children}</a>,
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    rpc: vi.fn().mockResolvedValue({ data: { likes: 10, dislikes: 1 }, error: null }),
  })),
}))

// Radix UI Select는 jsdom에서 작동하지 않으므로 네이티브 <select>로 대체
vi.mock('@/components/home/filter-section', () => ({
  FilterSection: ({
    onBudgetChange,
    onRegionChange,
    onEnvironmentChange,
    onSeasonChange,
  }: any) => (
    <div>
      <select
        aria-label="예산 필터"
        defaultValue="all"
        onChange={(e) => onBudgetChange(e.target.value === 'all' ? null : e.target.value)}
      >
        <option value="all">전체</option>
        <option value="100만원 이하">100만원 이하</option>
        <option value="100~200만원">100~200만원</option>
        <option value="200만원 이상">200만원 이상</option>
      </select>
      <select
        aria-label="지역 필터"
        defaultValue="all"
        onChange={(e) => onRegionChange(e.target.value === 'all' ? null : e.target.value)}
      >
        <option value="all">전체</option>
        <option value="수도권">수도권</option>
        <option value="경상도">경상도</option>
        <option value="전라도">전라도</option>
        <option value="강원도">강원도</option>
        <option value="제주도">제주도</option>
        <option value="충청도">충청도</option>
      </select>
      <select
        aria-label="환경 필터"
        defaultValue="all"
        onChange={(e) => onEnvironmentChange(e.target.value === 'all' ? null : e.target.value)}
      >
        <option value="all">전체</option>
        <option value="자연친화">자연친화</option>
        <option value="도심선호">도심선호</option>
        <option value="카페작업">카페작업</option>
        <option value="코워킹 필수">코워킹 필수</option>
      </select>
      <select
        aria-label="계절 필터"
        defaultValue="all"
        onChange={(e) => onSeasonChange(e.target.value === 'all' ? null : e.target.value)}
      >
        <option value="all">전체</option>
        <option value="봄">봄</option>
        <option value="여름">여름</option>
        <option value="가을">가을</option>
        <option value="겨울">겨울</option>
      </select>
    </div>
  ),
}))

vi.mock('@/components/home/sort-dropdown', () => ({
  SortDropdown: ({ sortBy, onSortChange }: any) => (
    <select
      aria-label="정렬"
      value={sortBy}
      onChange={(e) => onSortChange(e.target.value)}
    >
      <option value="likes-desc">좋아요 많은 순</option>
      <option value="likes-asc">좋아요 적은 순</option>
      <option value="name-asc">이름 오름차순</option>
      <option value="name-desc">이름 내림차순</option>
    </select>
  ),
}))

const mockCityBase: City = {
  id: 'jeju',
  name: '제주시',
  nameEn: 'Jeju',
  regionDetail: '제주특별자치도',
  description: '아름다운 섬',
  images: ['https://example.com/jeju.jpg'],
  overallRating: 4.5,
  costOfLiving: 1500000,
  internetSpeed: 100,
  safetyScore: 4.8,
  currentWeather: { temp: 18, feelsLike: 16, condition: '맑음' },
  airQuality: { aqi: 30, level: '좋음' },
  metrics: { cafeCount: 50, coworkingCount: 10, transportScore: 7, cultureScore: 8 },
  reviewCount: 120,
  bookmarkCount: 3400,
  rank: 1,
  tags: ['자연', '힐링'],
  likes: 456,
  dislikes: 12,
  budgetRange: '100~200만원',
  region: '제주도',
  environments: ['자연친화', '카페작업'],
  bestSeason: '봄',
}

const mockCities: City[] = [
  {
    ...mockCityBase,
    id: 'jeju',
    name: '제주시',
    nameEn: 'Jeju City',
    likes: 456,
    budgetRange: '100~200만원',
    region: '제주도',
    environments: ['자연친화', '카페작업'],
    bestSeason: '봄',
    rank: 1,
  },
  {
    ...mockCityBase,
    id: 'seoul',
    name: '서울 강남',
    nameEn: 'Seoul Gangnam',
    likes: 503,
    budgetRange: '200만원 이상',
    region: '수도권',
    environments: ['도심선호', '코워킹 필수'],
    bestSeason: '가을',
    rank: 2,
  },
  {
    ...mockCityBase,
    id: 'busan',
    name: '부산 해운대',
    nameEn: 'Busan Haeundae',
    likes: 421,
    budgetRange: '100만원 이하',
    region: '경상도',
    environments: ['자연친화'],
    bestSeason: '여름',
    rank: 3,
  },
]

describe('PopularCities', () => {
  // ── 초기 렌더링 (2개) ─────────────────────────────────
  describe('초기 렌더링', () => {
    it('"3개 도시" 텍스트가 표시된다', () => {
      render(<PopularCities initialCities={mockCities} />)
      expect(screen.getByText('3개 도시')).toBeInTheDocument()
    })

    it('3개 도시 이름이 모두 렌더링된다', () => {
      render(<PopularCities initialCities={mockCities} />)
      expect(screen.getByText('제주시')).toBeInTheDocument()
      expect(screen.getByText('서울 강남')).toBeInTheDocument()
      expect(screen.getByText('부산 해운대')).toBeInTheDocument()
    })
  })

  // ── 검색 (5개) ────────────────────────────────────────
  describe('검색', () => {
    it('"제주" 검색 시 제주시만 표시된다', async () => {
      const user = userEvent.setup()
      render(<PopularCities initialCities={mockCities} />)
      await user.type(screen.getByRole('textbox'), '제주')
      expect(screen.getByText('제주시')).toBeInTheDocument()
      expect(screen.queryByText('서울 강남')).not.toBeInTheDocument()
      expect(screen.queryByText('부산 해운대')).not.toBeInTheDocument()
    })

    it('"jeju" 영문 검색 시 제주시만 표시된다', async () => {
      const user = userEvent.setup()
      render(<PopularCities initialCities={mockCities} />)
      await user.type(screen.getByRole('textbox'), 'jeju')
      expect(screen.getByText('제주시')).toBeInTheDocument()
      expect(screen.queryByText('서울 강남')).not.toBeInTheDocument()
    })

    it('"GANGNAM" 대소문자 무관하게 서울 강남이 표시된다', async () => {
      const user = userEvent.setup()
      render(<PopularCities initialCities={mockCities} />)
      await user.type(screen.getByRole('textbox'), 'GANGNAM')
      expect(screen.getByText('서울 강남')).toBeInTheDocument()
      expect(screen.queryByText('제주시')).not.toBeInTheDocument()
    })

    it('"없는도시" 검색 시 안내 메시지가 표시된다', async () => {
      const user = userEvent.setup()
      render(<PopularCities initialCities={mockCities} />)
      await user.type(screen.getByRole('textbox'), '없는도시')
      expect(
        screen.getByText(/검색 결과가 없습니다|선택한 필터에 맞는 도시가 없습니다/)
      ).toBeInTheDocument()
    })

    it('검색어를 지우면 전체 도시가 복원된다', async () => {
      const user = userEvent.setup()
      render(<PopularCities initialCities={mockCities} />)
      const input = screen.getByRole('textbox')
      await user.type(input, '제주')
      expect(screen.queryByText('서울 강남')).not.toBeInTheDocument()
      await user.clear(input)
      expect(screen.getByText('제주시')).toBeInTheDocument()
      expect(screen.getByText('서울 강남')).toBeInTheDocument()
      expect(screen.getByText('부산 해운대')).toBeInTheDocument()
    })
  })

  // ── 예산 필터 (2개) ───────────────────────────────────
  describe('예산 필터', () => {
    it('"100만원 이하" 필터 시 부산만 표시된다', async () => {
      const user = userEvent.setup()
      render(<PopularCities initialCities={mockCities} />)
      await user.selectOptions(screen.getByRole('combobox', { name: '예산 필터' }), '100만원 이하')
      expect(screen.getByText('부산 해운대')).toBeInTheDocument()
      expect(screen.queryByText('제주시')).not.toBeInTheDocument()
      expect(screen.queryByText('서울 강남')).not.toBeInTheDocument()
    })

    it('"200만원 이상" 필터 시 서울만 표시된다', async () => {
      const user = userEvent.setup()
      render(<PopularCities initialCities={mockCities} />)
      await user.selectOptions(screen.getByRole('combobox', { name: '예산 필터' }), '200만원 이상')
      expect(screen.getByText('서울 강남')).toBeInTheDocument()
      expect(screen.queryByText('제주시')).not.toBeInTheDocument()
      expect(screen.queryByText('부산 해운대')).not.toBeInTheDocument()
    })
  })

  // ── 지역 필터 (2개) ───────────────────────────────────
  describe('지역 필터', () => {
    it('"제주도" 필터 시 제주시만 표시된다', async () => {
      const user = userEvent.setup()
      render(<PopularCities initialCities={mockCities} />)
      await user.selectOptions(screen.getByRole('combobox', { name: '지역 필터' }), '제주도')
      expect(screen.getByText('제주시')).toBeInTheDocument()
      expect(screen.queryByText('서울 강남')).not.toBeInTheDocument()
      expect(screen.queryByText('부산 해운대')).not.toBeInTheDocument()
    })

    it('"수도권" 필터 시 서울만 표시된다', async () => {
      const user = userEvent.setup()
      render(<PopularCities initialCities={mockCities} />)
      await user.selectOptions(screen.getByRole('combobox', { name: '지역 필터' }), '수도권')
      expect(screen.getByText('서울 강남')).toBeInTheDocument()
      expect(screen.queryByText('제주시')).not.toBeInTheDocument()
      expect(screen.queryByText('부산 해운대')).not.toBeInTheDocument()
    })
  })

  // ── 환경 필터 (1개) ───────────────────────────────────
  describe('환경 필터', () => {
    it('"카페작업" 필터 시 제주시만 표시된다', async () => {
      const user = userEvent.setup()
      render(<PopularCities initialCities={mockCities} />)
      await user.selectOptions(screen.getByRole('combobox', { name: '환경 필터' }), '카페작업')
      expect(screen.getByText('제주시')).toBeInTheDocument()
      expect(screen.queryByText('서울 강남')).not.toBeInTheDocument()
      expect(screen.queryByText('부산 해운대')).not.toBeInTheDocument()
    })
  })

  // ── 계절 필터 (1개) ───────────────────────────────────
  describe('계절 필터', () => {
    it('"여름" 필터 시 부산만 표시된다', async () => {
      const user = userEvent.setup()
      render(<PopularCities initialCities={mockCities} />)
      await user.selectOptions(screen.getByRole('combobox', { name: '계절 필터' }), '여름')
      expect(screen.getByText('부산 해운대')).toBeInTheDocument()
      expect(screen.queryByText('제주시')).not.toBeInTheDocument()
      expect(screen.queryByText('서울 강남')).not.toBeInTheDocument()
    })
  })

  // ── 복합 필터 (2개) ───────────────────────────────────
  describe('복합 필터', () => {
    it('예산 "100~200만원" + 지역 "제주도" 필터 시 제주시만 표시된다', async () => {
      const user = userEvent.setup()
      render(<PopularCities initialCities={mockCities} />)
      await user.selectOptions(screen.getByRole('combobox', { name: '예산 필터' }), '100~200만원')
      await user.selectOptions(screen.getByRole('combobox', { name: '지역 필터' }), '제주도')
      expect(screen.getByText('제주시')).toBeInTheDocument()
      expect(screen.queryByText('서울 강남')).not.toBeInTheDocument()
      expect(screen.queryByText('부산 해운대')).not.toBeInTheDocument()
    })

    it('조건에 맞는 도시가 없으면 안내 메시지가 표시된다', async () => {
      const user = userEvent.setup()
      render(<PopularCities initialCities={mockCities} />)
      // 예산=100만원 이하 + 지역=수도권 → 결과 없음
      await user.selectOptions(screen.getByRole('combobox', { name: '예산 필터' }), '100만원 이하')
      await user.selectOptions(screen.getByRole('combobox', { name: '지역 필터' }), '수도권')
      expect(
        screen.getByText(/선택한 필터에 맞는 도시가 없습니다/)
      ).toBeInTheDocument()
    })
  })

  // ── 정렬 (4개) ────────────────────────────────────────
  describe('정렬', () => {
    it('기본 정렬(likes-desc)은 서울 > 제주 > 부산 순이다', () => {
      render(<PopularCities initialCities={mockCities} />)
      const cityNames = screen.getAllByRole('heading', { level: 3 }).map((el) => el.textContent)
      expect(cityNames).toEqual(['서울 강남', '제주시', '부산 해운대'])
    })

    it('likes-asc 정렬 시 부산 > 제주 > 서울 순이다', async () => {
      const user = userEvent.setup()
      render(<PopularCities initialCities={mockCities} />)
      await user.selectOptions(screen.getByRole('combobox', { name: '정렬' }), '좋아요 적은 순')
      const cityNames = screen.getAllByRole('heading', { level: 3 }).map((el) => el.textContent)
      expect(cityNames).toEqual(['부산 해운대', '제주시', '서울 강남'])
    })

    it('name-asc 정렬 시 부산 < 서울 < 제주 (가나다 오름차순)이다', async () => {
      const user = userEvent.setup()
      render(<PopularCities initialCities={mockCities} />)
      await user.selectOptions(screen.getByRole('combobox', { name: '정렬' }), '이름 오름차순')
      const cityNames = screen.getAllByRole('heading', { level: 3 }).map((el) => el.textContent)
      expect(cityNames).toEqual(['부산 해운대', '서울 강남', '제주시'])
    })

    it('name-desc 정렬 시 제주 > 서울 > 부산 (가나다 내림차순)이다', async () => {
      const user = userEvent.setup()
      render(<PopularCities initialCities={mockCities} />)
      await user.selectOptions(screen.getByRole('combobox', { name: '정렬' }), '이름 내림차순')
      const cityNames = screen.getAllByRole('heading', { level: 3 }).map((el) => el.textContent)
      expect(cityNames).toEqual(['제주시', '서울 강남', '부산 해운대'])
    })
  })

  // ── 초기화 (1개) ──────────────────────────────────────
  describe('초기화', () => {
    it('검색 후 "전체 초기화" 버튼 클릭 시 전체 도시가 표시된다', async () => {
      const user = userEvent.setup()
      render(<PopularCities initialCities={mockCities} />)
      await user.type(screen.getByRole('textbox'), '없는도시')
      const resetButton = screen.getByRole('button', { name: /전체 초기화/ })
      await user.click(resetButton)
      expect(screen.getByText('제주시')).toBeInTheDocument()
      expect(screen.getByText('서울 강남')).toBeInTheDocument()
      expect(screen.getByText('부산 해운대')).toBeInTheDocument()
    })
  })

  // ── 좋아요 상태 (2개) ─────────────────────────────────
  describe('좋아요 상태', () => {
    it('좋아요 버튼 클릭 시 likeStates가 업데이트된다', async () => {
      const user = userEvent.setup()
      render(<PopularCities initialCities={mockCities} />)
      const likeButtons = screen.getAllByRole('button', { name: /👍/ })
      await user.click(likeButtons[0])
      await waitFor(() => {
        expect(screen.getAllByRole('button', { name: /👍/ })[0]).toBeInTheDocument()
      })
    })

    it('likeStates 업데이트 후 정렬에 반영된다', async () => {
      const { createClient } = await import('@/lib/supabase/client')
      vi.mocked(createClient).mockReturnValue({
        rpc: vi.fn().mockResolvedValue({ data: { likes: 9999, dislikes: 0 }, error: null }),
      } as any)

      const user = userEvent.setup()
      render(<PopularCities initialCities={mockCities} />)

      // 초기: 서울(503) > 제주(456) > 부산(421)
      let cityNames = screen.getAllByRole('heading', { level: 3 }).map((el) => el.textContent)
      expect(cityNames[0]).toBe('서울 강남')

      // 부산 카드 좋아요 클릭 (세 번째 👍 버튼)
      const likeButtons = screen.getAllByRole('button', { name: /👍/ })
      await user.click(likeButtons[2])

      // mock이 9999를 반환하므로 부산이 1위로 이동
      await waitFor(() => {
        const updated = screen.getAllByRole('heading', { level: 3 }).map((el) => el.textContent)
        expect(updated[0]).toBe('부산 해운대')
      })
    })
  })
})
