import { render, screen } from '@testing-library/react'
import { CityCard } from '@/components/cities/city-card'
import type { City } from '@/lib/types'

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => <a href={href} {...props}>{children}</a>,
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    rpc: vi.fn().mockResolvedValue({ data: { likes: 456, dislikes: 12 }, error: null }),
  })),
}))

const mockCity: City = {
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

describe('CityCard', () => {
  // ── 기본 렌더링 (7개) ──────────────────────────────────
  describe('기본 렌더링', () => {
    beforeEach(() => {
      render(<CityCard city={mockCity} />)
    })

    it('city.name을 렌더링한다', () => {
      expect(screen.getByText('제주시')).toBeInTheDocument()
    })

    it('city.nameEn을 렌더링한다', () => {
      expect(screen.getByText('Jeju')).toBeInTheDocument()
    })

    it('city.budgetRange를 렌더링한다', () => {
      expect(screen.getByText('100~200만원')).toBeInTheDocument()
    })

    it('city.region을 렌더링한다', () => {
      expect(screen.getByText('제주도')).toBeInTheDocument()
    })

    it('city.environments 배열의 각 항목이 Badge로 렌더링된다', () => {
      expect(screen.getByText('자연친화')).toBeInTheDocument()
      expect(screen.getByText('카페작업')).toBeInTheDocument()
    })

    it('city.bestSeason을 렌더링한다', () => {
      expect(screen.getByText('봄')).toBeInTheDocument()
    })

    it('city.reviewCount를 "💬 120" 형태로 렌더링한다', () => {
      expect(screen.getByText('💬 120')).toBeInTheDocument()
    })
  })

  // ── 랭크 뱃지 (5개) ───────────────────────────────────
  describe('랭크 뱃지', () => {
    it('rank=1이면 "🔥 #1" 텍스트가 존재한다', () => {
      render(<CityCard city={{ ...mockCity, rank: 1 }} />)
      expect(screen.getByText('🔥 #1')).toBeInTheDocument()
    })

    it('rank=2이면 "⭐ #2" 텍스트가 존재한다', () => {
      render(<CityCard city={{ ...mockCity, rank: 2 }} />)
      expect(screen.getByText('⭐ #2')).toBeInTheDocument()
    })

    it('rank=3이면 "⭐ #3" 텍스트가 존재한다', () => {
      render(<CityCard city={{ ...mockCity, rank: 3 }} />)
      expect(screen.getByText('⭐ #3')).toBeInTheDocument()
    })

    it('rank=4이면 뱃지가 표시되지 않는다', () => {
      render(<CityCard city={{ ...mockCity, rank: 4 }} />)
      expect(screen.queryByText(/🔥/)).not.toBeInTheDocument()
      expect(screen.queryByText(/⭐ #/)).not.toBeInTheDocument()
    })

    it('rank=undefined이면 뱃지가 표시되지 않는다', () => {
      const { rank: _rank, ...cityWithoutRank } = mockCity
      render(<CityCard city={cityWithoutRank as City} />)
      expect(screen.queryByText(/🔥/)).not.toBeInTheDocument()
      expect(screen.queryByText(/⭐ #/)).not.toBeInTheDocument()
    })
  })

  // ── 링크 구조 (3개) ───────────────────────────────────
  describe('링크 구조', () => {
    it('Link의 href가 "/cities/jeju"이다', () => {
      render(<CityCard city={mockCity} />)
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/cities/jeju')
    })

    it('이미지(alt=city.name)가 Link 내부에 위치한다', () => {
      render(<CityCard city={mockCity} />)
      const link = screen.getByRole('link')
      const image = screen.getByAltText('제주시')
      expect(link).toContainElement(image)
    })

    it('LikeDislikeButtons가 Link 외부(a 태그 밖)에 위치한다', () => {
      render(<CityCard city={mockCity} />)
      const link = screen.getByRole('link')
      const likeButton = screen.getByRole('button', { name: /👍/ })
      expect(link).not.toContainElement(likeButton)
    })
  })

  // ── LikeDislikeButtons 연동 (3개) ─────────────────────
  describe('LikeDislikeButtons 연동', () => {
    it('city.likes가 LikeDislikeButtons에 전달되어 "👍 456"이 표시된다', () => {
      render(<CityCard city={mockCity} />)
      expect(screen.getByRole('button', { name: /👍 456/ })).toBeInTheDocument()
    })

    it('city.dislikes가 LikeDislikeButtons에 전달되어 "👎 12"가 표시된다', () => {
      render(<CityCard city={mockCity} />)
      expect(screen.getByRole('button', { name: /👎 12/ })).toBeInTheDocument()
    })

    it('onLikeUpdate prop이 없어도 에러 없이 렌더링된다', () => {
      expect(() => render(<CityCard city={mockCity} />)).not.toThrow()
      expect(screen.getByText('제주시')).toBeInTheDocument()
    })
  })
})
