export interface City {
  id: string;
  name: string;
  nameEn: string;
  regionDetail: string;
  description: string;
  images: string[];
  overallRating: number;
  costOfLiving: number;
  internetSpeed: number;
  safetyScore: number;
  currentWeather: {
    temp: number;
    feelsLike: number;
    condition: string;
  };
  airQuality: {
    aqi: number;
    level: string;
  };
  metrics: {
    cafeCount: number;
    coworkingCount: number;
    transportScore: number;
    cultureScore: number;
  };
  reviewCount: number;
  bookmarkCount: number;
  rank?: number;
  tags: string[];
  likes: number;
  dislikes: number;
  budgetRange: BudgetRange;
  region: Region;
  environments: Environment[];
  bestSeason: BestSeason;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  cityId: string;
  cityName: string;
  overallRating: number;
  ratings: {
    costSatisfaction: number;
    internetQuality: number;
    workEnvironment: number;
    amenities: number;
    community: number;
    transport: number;
    nature: number;
  };
  content: string;
  images: string[];
  stayDuration: string;
  occupation: string;
  recommendedSeason: string[];
  helpfulCount: number;
  commentCount: number;
  createdAt: string;
  isVerified: boolean;
}

export interface Cafe {
  id: string;
  cityId: string;
  name: string;
  address: string;
  wifiSpeed: number;
  hasPowerOutlet: boolean;
  noiseLevel: number;
  priceRange: number;
  rating: number;
  images: string[];
}

export type ViewMode = "grid" | "list" | "map";
export type SortOption = "rating" | "cost-low" | "cost-high" | "internet" | "reviews";

// 필터 관련 타입
export type BudgetRange = "100만원 이하" | "100~200만원" | "200만원 이상";
export type Region = "수도권" | "경상도" | "전라도" | "강원도" | "제주도" | "충청도";
export type Environment = "자연친화" | "도심선호" | "카페작업" | "코워킹 필수";
export type BestSeason = "봄" | "여름" | "가을" | "겨울";

export interface FilterState {
  budget: BudgetRange[];
  regions: Region[];
  environments: Environment[];
  seasons: BestSeason[];
}

// 도시별 좋아요/싫어요 상태
export interface CityLikeState {
  cityId: string;
  likes: number;
  dislikes: number;
  userAction: "like" | "dislike" | null;
}
