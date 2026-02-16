# Phase 3 Implementation Plan: 필터 시스템 구현 및 카드 구조 개선

## Context

SPEC.md에 정의된 Phase 3 요구사항에 따라 4가지 필터 카테고리(예산, 지역, 환경, 최고 계절)를 정의하고 UI를 구현합니다. 도시 카드 구조를 변경하여 필터 정보를 Key-Value 형태로 표시합니다.

**Phase 3에 정의된 내용만 구현하며, Phase 4의 실제 필터링 로직은 구현하지 않습니다.**

---

## Implementation Approach

복잡한 구현보다 쉽고 간결한 방법을 선택하고, SOLID 원칙을 지키며 구현합니다:

1. **Single Responsibility**: 필터 UI와 카드 표시를 분리
2. **Simple & Clean**: 타입 정의 → City 타입 확장 → 필터 UI 구현 → 카드 구조 변경 순서로 진행
3. **Type Safety**: TypeScript 타입 체크를 통과하도록 수정
4. **UI Only**: Phase 3에서는 필터 UI와 카드 표시만 구현 (실제 필터링은 Phase 4에서)
5. **Incremental Verification**: 각 단계마다 typecheck 실행하여 검증

---

## Tasks to Complete

### ✅ Task 1: 필터 관련 타입 정의

**수정할 파일:**
- `lib/types.ts`

**추가할 타입:**
```typescript
// 예산 필터 옵션
export type BudgetRange = "100만원 이하" | "100~200만원" | "200만원 이상";

// 지역 필터 옵션
export type Region = "수도권" | "경상도" | "전라도" | "강원도" | "제주도" | "충청도";

// 환경 필터 옵션 (복수 선택 가능)
export type Environment = "자연친화" | "도심선호" | "카페작업" | "코워킹 필수";

// 최고 계절 필터 옵션
export type BestSeason = "봄" | "여름" | "가을" | "겨울";

// 필터 상태 인터페이스 (Phase 4에서 사용)
export interface FilterState {
  budget: BudgetRange[];
  regions: Region[];
  environments: Environment[];
  seasons: BestSeason[];
}
```

**City 인터페이스 확장:**
```typescript
export interface City {
  // ... 기존 필드들 ...
  likes: number;
  dislikes: number;

  // 추가할 필터 관련 필드
  budgetRange: BudgetRange;        // 예산 범위
  region: Region;                   // 지역
  environments: Environment[];      // 환경 (배열 - 복수 가능)
  bestSeason: BestSeason;          // 최고 계절
}
```

**검증:**
- `npx tsc --noEmit` 실행하여 타입 정의 확인 (Mock 데이터 수정 전까지는 오류 발생 예상)

---

### ✅ Task 2: Mock 데이터에 필터 속성 추가

**수정할 파일:**
- `lib/mock-data.ts`

**각 도시별 필터 값 할당:**

| 도시 | budgetRange | region | environments | bestSeason |
|------|-------------|--------|--------------|------------|
| 제주시 | "200만원 이상" | "제주도" | ["자연친화", "카페작업"] | "봄" |
| 강릉 | "100~200만원" | "강원도" | ["자연친화", "카페작업"] | "여름" |
| 부산 해운대 | "100~200만원" | "경상도" | ["도심선호", "카페작업"] | "여름" |
| 전주 | "100만원 이하" | "전라도" | ["자연친화", "카페작업"] | "가을" |
| 서울 강남 | "200만원 이상" | "수도권" | ["도심선호", "코워킹 필수"] | "봄" |
| 속초 | "100만원 이하" | "강원도" | ["자연친화"] | "여름" |
| 춘천 | "100만원 이하" | "강원도" | ["자연친화", "카페작업"] | "봄" |
| 대구 | "100~200만원" | "경상도" | ["도심선호"] | "가을" |
| 여수 | "100~200만원" | "전라도" | ["자연친화"] | "가을" |
| 경주 | "100만원 이하" | "경상도" | ["자연친화"] | "봄" |

**예시:**
```typescript
{
  id: "jeju",
  name: "제주시",
  // ... 기존 필드들 ...
  likes: 456,
  dislikes: 12,
  // 추가
  budgetRange: "200만원 이상",
  region: "제주도",
  environments: ["자연친화", "카페작업"],
  bestSeason: "봄",
},
```

**검증:**
- `npx tsc --noEmit` 실행하여 타입 오류 해결 확인
- 모든 도시에 필터 필드가 추가되었는지 확인

---

### ✅ Task 3: FilterSection 컴포넌트 생성

**생성할 파일:**
- `components/home/filter-section.tsx`

**컴포넌트 구조:**
```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { BudgetRange, Region, Environment, BestSeason } from "@/lib/types";

export function FilterSection() {
  // Phase 3에서는 UI만 구현, 실제 필터링은 Phase 4에서
  const [selectedBudget, setSelectedBudget] = useState<BudgetRange[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<Region[]>([]);
  const [selectedEnvironments, setSelectedEnvironments] = useState<Environment[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<BestSeason[]>([]);

  // 예산 옵션
  const budgetOptions: BudgetRange[] = ["100만원 이하", "100~200만원", "200만원 이상"];

  // 지역 옵션
  const regionOptions: Region[] = ["수도권", "경상도", "전라도", "강원도", "제주도", "충청도"];

  // 환경 옵션
  const environmentOptions: Environment[] = ["자연친화", "도심선호", "카페작업", "코워킹 필수"];

  // 계절 옵션
  const seasonOptions: BestSeason[] = ["봄", "여름", "가을", "겨울"];

  // 필터 토글 핸들러
  const toggleFilter = <T,>(selected: T[], item: T, setSelected: (items: T[]) => void) => {
    if (selected.includes(item)) {
      setSelected(selected.filter(i => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  return (
    <section className="border-b bg-muted/30 py-6">
      <div className="container">
        <div className="space-y-4">
          {/* 예산 필터 */}
          <div>
            <h3 className="mb-2 text-sm font-semibold">💵 예산</h3>
            <div className="flex flex-wrap gap-2">
              {budgetOptions.map((budget) => (
                <Button
                  key={budget}
                  variant={selectedBudget.includes(budget) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter(selectedBudget, budget, setSelectedBudget)}
                >
                  {budget}
                </Button>
              ))}
            </div>
          </div>

          {/* 지역 필터 */}
          <div>
            <h3 className="mb-2 text-sm font-semibold">📍 지역</h3>
            <div className="flex flex-wrap gap-2">
              {regionOptions.map((region) => (
                <Button
                  key={region}
                  variant={selectedRegions.includes(region) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter(selectedRegions, region, setSelectedRegions)}
                >
                  {region}
                </Button>
              ))}
            </div>
          </div>

          {/* 환경 필터 */}
          <div>
            <h3 className="mb-2 text-sm font-semibold">🌿 환경</h3>
            <div className="flex flex-wrap gap-2">
              {environmentOptions.map((env) => (
                <Button
                  key={env}
                  variant={selectedEnvironments.includes(env) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter(selectedEnvironments, env, setSelectedEnvironments)}
                >
                  {env}
                </Button>
              ))}
            </div>
          </div>

          {/* 계절 필터 */}
          <div>
            <h3 className="mb-2 text-sm font-semibold">🍂 최고 계절</h3>
            <div className="flex flex-wrap gap-2">
              {seasonOptions.map((season) => (
                <Button
                  key={season}
                  variant={selectedSeasons.includes(season) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter(selectedSeasons, season, setSelectedSeasons)}
                >
                  {season}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**구현 세부사항:**
- 각 필터는 독립적인 섹션으로 구성
- 버튼 클릭 시 선택/해제 토글
- 선택된 항목은 `variant="default"` (파란색), 미선택은 `variant="outline"`
- Phase 3에서는 UI만 구현, 실제 필터링 로직은 Phase 4에서 추가

**검증:**
- `npx tsc --noEmit` 실행
- 브라우저에서 필터 UI가 정상적으로 표시되는지 확인

---

### ✅ Task 4: PopularCities에 FilterSection 추가

**수정할 파일:**
- `components/home/popular-cities.tsx`

**수정 내용:**
```typescript
import { CityCard } from "@/components/cities/city-card";
import { getTopCities } from "@/lib/mock-data";
import { FilterSection } from "@/components/home/filter-section"; // 추가

export function PopularCities() {
  const topCities = getTopCities(8);

  return (
    <section className="py-16">
      {/* 필터 섹션 추가 */}
      <FilterSection />

      <div className="container mt-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">도시 리스트</h2>
          <p className="mt-2 text-muted-foreground">
            가장 많은 노마드들이 선택한 도시
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {topCities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

**검증:**
- `npx tsc --noEmit` 실행
- 브라우저에서 필터 섹션이 도시 리스트 위에 표시되는지 확인

---

### ✅ Task 5: CityCard 구조 변경 - 필터 정보 Key-Value 표시

**수정할 파일:**
- `components/cities/city-card.tsx`

**수정 내용:**
기존의 비용, 인터넷 속도, 날씨, 공기질 정보를 제거하고, 필터 정보를 Key-Value 형태로 표시

```typescript
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { City } from "@/lib/types";
import { LikeDislikeButtons } from "@/components/ui/like-dislike-buttons";

interface CityCardProps {
  city: City;
}

export function CityCard({ city }: CityCardProps) {
  return (
    <Card className="overflow-hidden transition-all">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={city.images[0]}
          alt={city.name}
          fill
          className="object-cover transition-transform"
        />
        {city.rank && city.rank <= 3 && (
          <Badge className="absolute left-3 top-3 bg-orange-500">
            {city.rank === 1 ? "🔥 #1" : `⭐ #${city.rank}`}
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold">{city.name}</h3>
          <p className="text-sm text-muted-foreground">{city.nameEn}</p>
        </div>

        {/* 필터 정보를 Key-Value 형태로 표시 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">예산</span>
            <span className="font-medium">{city.budgetRange}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">지역</span>
            <span className="font-medium">{city.region}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">환경</span>
            <div className="flex flex-wrap gap-1 justify-end">
              {city.environments.map((env) => (
                <Badge key={env} variant="secondary" className="text-xs">
                  {env}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">최고 계절</span>
            <span className="font-medium">{city.bestSeason}</span>
          </div>

          {/* 좋아요/싫어요 버튼 */}
          <div className="border-t pt-2">
            <LikeDislikeButtons
              initialLikes={city.likes}
              initialDislikes={city.dislikes}
            />
          </div>

          {/* 리뷰/북마크 정보 유지 */}
          <div className="flex items-center justify-between border-t pt-2 text-xs text-muted-foreground">
            <span>💬 {city.reviewCount}</span>
            <span>👁️ {(city.bookmarkCount / 100).toFixed(1)}K</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

**구조 변경 사항:**
- ❌ 제거: 💵 비용, 📡 인터넷 속도, 🌡️ 날씨, 💨 공기질
- ✅ 추가: 예산, 지역, 환경, 최고 계절 (Key-Value 형태)
- 환경은 배열이므로 Badge 컴포넌트로 복수 표시
- 나머지 구조는 유지 (좋아요/싫어요, 리뷰/북마크)

**검증:**
- `npx tsc --noEmit` 실행
- 브라우저에서 카드 레이아웃 확인
- Key-Value 형태가 읽기 쉽게 표시되는지 확인

---

### ✅ Task 6: 최종 검증 및 테스트

**검증 체크리스트:**

1. **타입 체크:**
   - [ ] `npx tsc --noEmit` 통과

2. **필터 UI 확인:**
   - [ ] 4가지 필터 카테고리가 모두 표시되는지 확인
   - [ ] 예산 필터의 모든 옵션이 정확히 표시되는지 확인 (3개)
   - [ ] 지역 필터의 모든 옵션이 정확히 표시되는지 확인 (6개)
   - [ ] 환경 필터의 모든 옵션이 정확히 표시되는지 확인 (4개)
   - [ ] 최고 계절 필터의 모든 옵션이 정확히 표시되는지 확인 (4개)
   - [ ] 필터 버튼 클릭 시 선택/해제가 정상 작동하는지 확인
   - [ ] 선택된 필터가 시각적으로 구분되는지 확인 (파란색 vs 회색)

3. **카드 구조 확인:**
   - [ ] 도시 카드에 "예산" 정보가 Key-Value로 표시되는지 확인
   - [ ] 도시 카드에 "지역" 정보가 Key-Value로 표시되는지 확인
   - [ ] 도시 카드에 "환경" 정보가 Key-Value로 표시되는지 확인
   - [ ] 도시 카드에 "최고 계절" 정보가 Key-Value로 표시되는지 확인
   - [ ] 환경이 복수인 경우 Badge로 잘 표시되는지 확인
   - [ ] Key-Value 형태가 읽기 쉽게 표시되는지 확인
   - [ ] 카드 레이아웃이 깔끔하고 정보가 잘 구조화되어 있는지 확인

4. **기존 기능 유지 확인:**
   - [ ] 좋아요/싫어요 버튼이 정상 작동하는지 확인
   - [ ] 리뷰/북마크 정보가 표시되는지 확인

5. **빌드 테스트:**
   - [ ] `npm run build` 실행하여 프로덕션 빌드 성공 확인

---

## Critical Files to Modify

### 수정할 파일:
1. `lib/types.ts` - 필터 타입 정의 및 City interface 확장
2. `lib/mock-data.ts` - 모든 도시에 필터 속성 추가
3. `components/home/popular-cities.tsx` - FilterSection 추가
4. `components/cities/city-card.tsx` - 카드 구조 변경 (필터 정보 표시)

### 생성할 파일:
1. `components/home/filter-section.tsx` - 필터 UI 컴포넌트

---

## Implementation Steps (순서대로 진행)

1. **Task 1**: 필터 관련 타입 정의
2. **Task 2**: Mock 데이터에 필터 속성 추가
3. **Task 3**: FilterSection 컴포넌트 생성
4. **Task 4**: PopularCities에 FilterSection 추가
5. **Task 5**: CityCard 구조 변경
6. **Task 6**: 최종 검증

**각 Task 완료 후:**
- `npx tsc --noEmit` 실행
- 문제가 있으면 즉시 수정
- SPEC.md의 해당 체크박스에 체크

---

## Notes

- **Phase 3에 정의된 내용만 구현**하며, Phase 4의 실제 필터링 로직은 구현하지 않습니다.
- **필터 UI는 동작하지만 결과에 영향을 주지 않음** - 선택/해제만 가능하고, 도시 리스트는 변경되지 않습니다.
- **카드 구조를 대폭 변경**하여 기존의 날씨/인터넷 속도 정보 대신 필터 정보를 표시합니다.
- **Key-Value 형태**로 정보를 표시하여 가독성을 높입니다.
- **환경 필터는 배열**이므로 Badge로 복수 표시합니다.
- Phase 4에서 실제 필터링 로직을 추가할 예정입니다.

---

## UI Design Guidelines

### 필터 섹션 스타일:
- **배경**: `bg-muted/30` (연한 회색 배경)
- **구분선**: `border-b` (하단 구분선)
- **여백**: `py-6` (상하 여백)
- **선택된 필터**: `variant="default"` (파란색)
- **미선택 필터**: `variant="outline"` (회색 테두리)

### 카드 Key-Value 스타일:
- **Key**: `text-muted-foreground` (회색 텍스트)
- **Value**: `font-medium` (중간 굵기)
- **환경 Badge**: `variant="secondary"` (회색 배경)
- **간격**: `space-y-2` (세로 간격)

### 아이콘:
- 예산: 💵
- 지역: 📍
- 환경: 🌿
- 최고 계절: 🍂

---

## Data Mapping Strategy

### 예산 범위 결정 로직:
- costOfLiving < 1,000,000 → "100만원 이하"
- 1,000,000 ≤ costOfLiving < 2,000,000 → "100~200만원"
- costOfLiving ≥ 2,000,000 → "200만원 이상"

### 지역 매핑:
- 제주시 → "제주도"
- 강릉, 속초, 춘천 → "강원도"
- 부산, 대구, 경주 → "경상도"
- 전주, 여수 → "전라도"
- 서울 강남 → "수도권"

### 환경 결정 기준:
- 자연 태그 있음 → "자연친화"
- 도심 태그 있음 → "도심선호"
- cafeCount > 80 → "카페작업"
- coworkingCount > 15 → "코워킹 필수"

### 최고 계절 할당:
- 바다/해변 도시 → "여름"
- 산/자연 도시 → "봄" 또는 "가을"
- 도시 지역 → "봄"

---

## Performance Considerations

- FilterSection은 클라이언트 컴포넌트 ("use client")
- 각 필터 상태를 독립적으로 관리 (useState)
- Phase 4에서 필터 상태를 부모 컴포넌트로 올려서 실제 필터링 구현 예정
- Badge 컴포넌트는 재사용 가능하도록 shadcn/ui 사용

---

## Future Enhancements (Phase 3 이후)

Phase 3에서는 구현하지 않지만, Phase 4에서 추가될 기능:
- 필터 선택에 따른 실제 도시 리스트 필터링
- 필터 조합 (AND/OR 로직)
- 필터 초기화 버튼
- 선택된 필터 개수 표시
- URL 쿼리 파라미터로 필터 상태 저장

---

## Testing Scenarios

### 시나리오 1: 필터 UI 테스트
- 예산 필터에서 "100만원 이하" 클릭
- 버튼이 파란색으로 변경되는지 확인
- 다시 클릭하면 회색으로 돌아가는지 확인

### 시나리오 2: 복수 필터 선택
- 지역 필터에서 "강원도", "제주도" 동시 선택
- 두 버튼 모두 파란색으로 표시되는지 확인

### 시나리오 3: 카드 정보 확인
- 제주시 카드에서:
  - 예산: "200만원 이상"
  - 지역: "제주도"
  - 환경: "자연친화", "카페작업" (2개 Badge)
  - 최고 계절: "봄"
- 모든 정보가 Key-Value 형태로 깔끔하게 표시되는지 확인

### 시나리오 4: 반응형 확인
- 모바일 화면에서 필터 버튼이 줄바꿈되는지 확인
- 카드 레이아웃이 모바일에서도 깔끔한지 확인
