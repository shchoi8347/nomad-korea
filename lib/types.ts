export interface City {
  id: string;
  name: string;
  nameEn: string;
  region: string;
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
