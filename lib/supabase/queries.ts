import { createClient } from './server'
import type { City, Cafe, Review } from '@/lib/types'
import type { Tables } from '@/lib/database.types'

// DB row → 프론트엔드 타입 매퍼
function mapCity(row: Tables<'cities'>): City {
  const weather = row.current_weather as { temp: number; feelsLike: number; condition: string }
  const airQuality = row.air_quality as { aqi: number; level: string }
  const metrics = row.metrics as {
    cafeCount: number
    coworkingCount: number
    transportScore: number
    cultureScore: number
  }

  return {
    id: row.id,
    name: row.name,
    nameEn: row.name_en,
    regionDetail: row.region_detail,
    description: row.description,
    images: row.images,
    overallRating: Number(row.overall_rating),
    costOfLiving: row.cost_of_living,
    internetSpeed: row.internet_speed,
    safetyScore: Number(row.safety_score),
    currentWeather: weather,
    airQuality: airQuality,
    metrics: metrics,
    reviewCount: row.review_count,
    bookmarkCount: row.bookmark_count,
    rank: row.rank ?? undefined,
    tags: row.tags,
    likes: row.likes,
    dislikes: row.dislikes,
    budgetRange: row.budget_range as City['budgetRange'],
    region: row.region as City['region'],
    environments: row.environments as City['environments'],
    bestSeason: row.best_season as City['bestSeason'],
  }
}

function mapCafe(row: Tables<'cafes'>): Cafe {
  return {
    id: row.id,
    cityId: row.city_id,
    name: row.name,
    address: row.address,
    wifiSpeed: row.wifi_speed,
    hasPowerOutlet: row.has_power_outlet,
    noiseLevel: row.noise_level,
    priceRange: row.price_range,
    rating: Number(row.rating),
    images: row.images,
  }
}

function mapReview(
  row: Tables<'reviews'> & {
    profiles: { name: string; avatar_url: string | null } | null
    cities: { name: string } | null
  }
): Review {
  const ratings = row.ratings as Review['ratings']

  return {
    id: row.id,
    userId: row.user_id,
    userName: row.profiles?.name ?? '알 수 없음',
    userAvatar: row.profiles?.avatar_url ?? '',
    cityId: row.city_id,
    cityName: row.cities?.name ?? '',
    overallRating: Number(row.overall_rating),
    ratings,
    content: row.content,
    images: row.images,
    stayDuration: row.stay_duration ?? '',
    occupation: row.occupation ?? '',
    recommendedSeason: row.recommended_season,
    helpfulCount: row.helpful_count,
    commentCount: row.comment_count,
    createdAt: row.created_at,
    isVerified: row.is_verified,
  }
}

// 도시 전체 목록 (rank 순 정렬)
export async function getCities(): Promise<City[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .order('rank', { ascending: true })

  if (error || !data) return []
  return data.map(mapCity)
}

// 도시 단건 조회
export async function getCityById(id: string): Promise<City | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return mapCity(data)
}

// 도시별 카페 목록
export async function getCafesByCityId(cityId: string): Promise<Cafe[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cafes')
    .select('*')
    .eq('city_id', cityId)

  if (error || !data) return []
  return data.map(mapCafe)
}

// 도시별 리뷰 목록
export async function getReviewsByCityId(cityId: string): Promise<Review[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('*, profiles(name, avatar_url), cities(name)')
    .eq('city_id', cityId)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data.map(mapReview)
}

// 최근 리뷰 (홈 화면용)
export async function getRecentReviews(limit = 3): Promise<Review[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('*, profiles(name, avatar_url), cities(name)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error || !data) return []
  return data.map(mapReview)
}

// 유저의 도시 좋아요 상태 조회
export async function getUserCityLike(
  userId: string,
  cityId: string
): Promise<'like' | 'dislike' | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('city_likes')
    .select('action')
    .eq('user_id', userId)
    .eq('city_id', cityId)
    .single()

  return (data?.action as 'like' | 'dislike') ?? null
}
