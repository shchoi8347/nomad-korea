import {
  getCities,
  getCityById,
  getCafesByCityId,
  getReviewsByCityId,
  getRecentReviews,
} from '@/lib/supabase/queries'

vi.mock('@/lib/supabase/server')

import { createClient } from '@/lib/supabase/server'

// ---------------------------------------------------------------------------
// Helper: mock Supabase chained builder
// ---------------------------------------------------------------------------

function mockSupabase(resolvedValue: { data: unknown; error: unknown }) {
  const builder: Record<string, unknown> = {}
  const chain = () => builder

  builder.select = chain
  builder.order = chain
  builder.eq = chain
  builder.limit = () => Promise.resolve(resolvedValue)
  builder.single = () => Promise.resolve(resolvedValue)
  builder.then = (resolve: (v: unknown) => void) =>
    Promise.resolve(resolvedValue).then(resolve)

  const client = { from: () => builder }
  vi.mocked(createClient).mockResolvedValue(
    client as unknown as Awaited<ReturnType<typeof createClient>>
  )
}

// ---------------------------------------------------------------------------
// Shared mock rows
// ---------------------------------------------------------------------------

const baseCityRow = {
  id: 'city-1',
  name: '서울',
  name_en: 'Seoul',
  region_detail: '서울특별시',
  description: '대한민국 수도',
  images: ['img1.jpg'],
  overall_rating: '4.5',
  cost_of_living: 3000000,
  internet_speed: 500,
  safety_score: '4.2',
  current_weather: { temp: 25, feelsLike: 27, condition: 'Sunny' },
  air_quality: { aqi: 50, level: 'Good' },
  metrics: { cafeCount: 100, coworkingCount: 20, transportScore: 4.8, cultureScore: 4.5 },
  review_count: 120,
  bookmark_count: 300,
  rank: 1,
  tags: ['도시', '카페'],
  likes: 500,
  dislikes: 10,
  budget_range: '100~200만원',
  region: '수도권',
  environments: ['도심선호'],
  best_season: '봄',
}

const baseCafeRow = {
  id: 'cafe-1',
  city_id: 'city-1',
  name: '스타벅스 강남점',
  address: '서울 강남구',
  wifi_speed: 100,
  has_power_outlet: true,
  noise_level: 'moderate',
  price_range: 'medium',
  rating: '4.3',
  images: ['cafe1.jpg'],
}

const baseReviewRow = {
  id: 'review-1',
  user_id: 'user-1',
  city_id: 'city-1',
  overall_rating: '4.0',
  ratings: { internet: 4, cost: 3, safety: 5, culture: 4, transport: 4 },
  content: '좋은 도시입니다.',
  images: [],
  stay_duration: '1개월',
  occupation: '개발자',
  recommended_season: ['spring', 'fall'],
  helpful_count: 10,
  comment_count: 3,
  created_at: '2024-01-01T00:00:00Z',
  is_verified: true,
  profiles: { name: '홍길동', avatar_url: 'https://example.com/avatar.jpg' },
  cities: { name: '서울' },
}

// ===========================================================================
// mapCity() — getCities() / getCityById()를 통해 간접 테스트
// ===========================================================================

describe('mapCity()', () => {
  it('기본 필드(id, name, nameEn, description)를 올바르게 매핑한다', async () => {
    mockSupabase({ data: [baseCityRow], error: null })
    const cities = await getCities()
    expect(cities[0].id).toBe('city-1')
    expect(cities[0].name).toBe('서울')
    expect(cities[0].nameEn).toBe('Seoul')
    expect(cities[0].description).toBe('대한민국 수도')
  })

  it('current_weather JSON을 currentWeather 객체로 변환한다', async () => {
    mockSupabase({ data: [baseCityRow], error: null })
    const cities = await getCities()
    expect(cities[0].currentWeather).toEqual({ temp: 25, feelsLike: 27, condition: 'Sunny' })
  })

  it('air_quality JSON을 airQuality 객체로 변환한다', async () => {
    mockSupabase({ data: [baseCityRow], error: null })
    const cities = await getCities()
    expect(cities[0].airQuality).toEqual({ aqi: 50, level: 'Good' })
  })

  it('metrics JSON을 metrics 객체로 변환한다', async () => {
    mockSupabase({ data: [baseCityRow], error: null })
    const cities = await getCities()
    expect(cities[0].metrics).toEqual({
      cafeCount: 100,
      coworkingCount: 20,
      transportScore: 4.8,
      cultureScore: 4.5,
    })
  })

  it('overall_rating 문자열을 Number()로 변환한다', async () => {
    mockSupabase({ data: [baseCityRow], error: null })
    const cities = await getCities()
    expect(typeof cities[0].overallRating).toBe('number')
    expect(cities[0].overallRating).toBe(4.5)
  })

  it('safety_score 문자열을 Number()로 변환한다', async () => {
    mockSupabase({ data: [baseCityRow], error: null })
    const cities = await getCities()
    expect(typeof cities[0].safetyScore).toBe('number')
    expect(cities[0].safetyScore).toBe(4.2)
  })

  it('rank가 null이면 undefined로 변환한다', async () => {
    mockSupabase({ data: [{ ...baseCityRow, rank: null }], error: null })
    const cities = await getCities()
    expect(cities[0].rank).toBeUndefined()
  })

  it('rank가 숫자값이면 그대로 유지한다', async () => {
    mockSupabase({ data: [baseCityRow], error: null })
    const cities = await getCities()
    expect(cities[0].rank).toBe(1)
  })

  it('snake_case 컬럼을 camelCase 필드로 변환한다', async () => {
    mockSupabase({ data: [baseCityRow], error: null })
    const cities = await getCities()
    expect(cities[0].costOfLiving).toBe(3000000)
    expect(cities[0].internetSpeed).toBe(500)
    expect(cities[0].reviewCount).toBe(120)
    expect(cities[0].bookmarkCount).toBe(300)
  })
})

// ===========================================================================
// mapCafe() — getCafesByCityId()를 통해 간접 테스트
// ===========================================================================

describe('mapCafe()', () => {
  it('기본 필드(id, cityId, name, address)를 올바르게 매핑한다', async () => {
    mockSupabase({ data: [baseCafeRow], error: null })
    const cafes = await getCafesByCityId('city-1')
    expect(cafes[0].id).toBe('cafe-1')
    expect(cafes[0].cityId).toBe('city-1')
    expect(cafes[0].name).toBe('스타벅스 강남점')
    expect(cafes[0].address).toBe('서울 강남구')
  })

  it('rating 문자열을 Number()로 변환한다', async () => {
    mockSupabase({ data: [baseCafeRow], error: null })
    const cafes = await getCafesByCityId('city-1')
    expect(typeof cafes[0].rating).toBe('number')
    expect(cafes[0].rating).toBe(4.3)
  })

  it('snake_case 컬럼을 camelCase 필드로 변환한다', async () => {
    mockSupabase({ data: [baseCafeRow], error: null })
    const cafes = await getCafesByCityId('city-1')
    expect(cafes[0].wifiSpeed).toBe(100)
    expect(cafes[0].hasPowerOutlet).toBe(true)
    expect(cafes[0].noiseLevel).toBe('moderate')
    expect(cafes[0].priceRange).toBe('medium')
  })
})

// ===========================================================================
// mapReview() — getReviewsByCityId()를 통해 간접 테스트
// ===========================================================================

describe('mapReview()', () => {
  it('기본 필드(id, userId, content, helpfulCount)를 올바르게 매핑한다', async () => {
    mockSupabase({ data: [baseReviewRow], error: null })
    const reviews = await getReviewsByCityId('city-1')
    expect(reviews[0].id).toBe('review-1')
    expect(reviews[0].userId).toBe('user-1')
    expect(reviews[0].content).toBe('좋은 도시입니다.')
    expect(reviews[0].helpfulCount).toBe(10)
  })

  it('profiles.name을 userName으로 매핑한다', async () => {
    mockSupabase({ data: [baseReviewRow], error: null })
    const reviews = await getReviewsByCityId('city-1')
    expect(reviews[0].userName).toBe('홍길동')
  })

  it('profiles.avatar_url을 userAvatar로 매핑한다', async () => {
    mockSupabase({ data: [baseReviewRow], error: null })
    const reviews = await getReviewsByCityId('city-1')
    expect(reviews[0].userAvatar).toBe('https://example.com/avatar.jpg')
  })

  it('profiles가 null이면 userName을 "알 수 없음"으로 설정한다', async () => {
    mockSupabase({ data: [{ ...baseReviewRow, profiles: null }], error: null })
    const reviews = await getReviewsByCityId('city-1')
    expect(reviews[0].userName).toBe('알 수 없음')
  })

  it('profiles가 null이면 userAvatar를 ""으로 설정한다', async () => {
    mockSupabase({ data: [{ ...baseReviewRow, profiles: null }], error: null })
    const reviews = await getReviewsByCityId('city-1')
    expect(reviews[0].userAvatar).toBe('')
  })

  it('cities.name을 cityName으로 매핑한다', async () => {
    mockSupabase({ data: [baseReviewRow], error: null })
    const reviews = await getReviewsByCityId('city-1')
    expect(reviews[0].cityName).toBe('서울')
  })

  it('cities가 null이면 cityName을 ""으로 설정한다', async () => {
    mockSupabase({ data: [{ ...baseReviewRow, cities: null }], error: null })
    const reviews = await getReviewsByCityId('city-1')
    expect(reviews[0].cityName).toBe('')
  })

  it('stay_duration이 null이면 stayDuration을 ""으로 설정한다', async () => {
    mockSupabase({ data: [{ ...baseReviewRow, stay_duration: null }], error: null })
    const reviews = await getReviewsByCityId('city-1')
    expect(reviews[0].stayDuration).toBe('')
  })

  it('occupation이 null이면 occupation을 ""으로 설정한다', async () => {
    mockSupabase({ data: [{ ...baseReviewRow, occupation: null }], error: null })
    const reviews = await getReviewsByCityId('city-1')
    expect(reviews[0].occupation).toBe('')
  })
})

// ===========================================================================
// getCities()
// ===========================================================================

describe('getCities()', () => {
  it('정상 조회 시 City[] 배열을 반환한다', async () => {
    mockSupabase({ data: [baseCityRow, { ...baseCityRow, id: 'city-2', rank: 2 }], error: null })
    const cities = await getCities()
    expect(Array.isArray(cities)).toBe(true)
    expect(cities).toHaveLength(2)
    expect(cities[0].id).toBe('city-1')
  })

  it('데이터가 빈 배열이면 []을 반환한다', async () => {
    mockSupabase({ data: [], error: null })
    const cities = await getCities()
    expect(cities).toEqual([])
  })

  it('Supabase 에러 발생 시 []을 반환한다', async () => {
    mockSupabase({ data: null, error: new Error('DB error') })
    const cities = await getCities()
    expect(cities).toEqual([])
  })
})

// ===========================================================================
// getCityById()
// ===========================================================================

describe('getCityById()', () => {
  it('존재하는 ID로 조회하면 City 객체를 반환한다', async () => {
    mockSupabase({ data: baseCityRow, error: null })
    const city = await getCityById('city-1')
    expect(city).not.toBeNull()
    expect(city?.id).toBe('city-1')
    expect(city?.name).toBe('서울')
  })

  it('data가 null이면 null을 반환한다', async () => {
    mockSupabase({ data: null, error: null })
    const city = await getCityById('non-existent')
    expect(city).toBeNull()
  })

  it('Supabase 에러 발생 시 null을 반환한다', async () => {
    mockSupabase({ data: null, error: new Error('Not found') })
    const city = await getCityById('city-1')
    expect(city).toBeNull()
  })
})

// ===========================================================================
// getRecentReviews()
// ===========================================================================

describe('getRecentReviews()', () => {
  it('정상 조회 시 Review[] 배열을 반환한다', async () => {
    mockSupabase({ data: [baseReviewRow], error: null })
    const reviews = await getRecentReviews()
    expect(Array.isArray(reviews)).toBe(true)
    expect(reviews[0].id).toBe('review-1')
  })

  it('limit 기본값 3이 적용된다', async () => {
    const threeRows = [
      baseReviewRow,
      { ...baseReviewRow, id: 'review-2' },
      { ...baseReviewRow, id: 'review-3' },
    ]
    mockSupabase({ data: threeRows, error: null })
    const reviews = await getRecentReviews()
    expect(reviews).toHaveLength(3)
  })

  it('Supabase 에러 발생 시 []을 반환한다', async () => {
    mockSupabase({ data: null, error: new Error('DB error') })
    const reviews = await getRecentReviews()
    expect(reviews).toEqual([])
  })
})
