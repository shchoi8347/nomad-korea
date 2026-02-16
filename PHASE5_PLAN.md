# Phase 5 Implementation Plan: 필터링 기능 구현 및 최종 통합 테스트

## Context

SPEC.md에 정의된 Phase 5 요구사항에 따라 필터 선택에 따라 도시 리스트를 동적으로 필터링하는 기능을 구현합니다. 필터링과 정렬이 함께 작동하도록 통합하고, 모든 기능이 정상 작동하는지 최종 검증합니다.

**Phase 5는 프로젝트의 마지막 단계이므로, 모든 기능을 통합하고 최종 검증합니다.**

---

## Implementation Approach

복잡한 구현보다 쉽고 간결한 방법을 선택하고, SOLID 원칙을 지키며 구현합니다:

1. **Lifting State Up**: 필터 상태를 PopularCities로 올려서 필터링 가능하게 함
2. **Simple Filtering**: JavaScript의 `.filter()` 메서드로 간단하게 필터링
3. **Filter + Sort**: 필터링 후 정렬 (useMemo로 최적화)
4. **Type Safety**: TypeScript 타입 체크를 통과하도록 수정
5. **Incremental Verification**: 각 단계마다 typecheck 실행하여 검증

---

## Tasks to Complete

### ✅ Task 1: FilterSection을 제어 컴포넌트로 변경

**수정할 파일:**
- `components/home/filter-section.tsx`

**수정 내용:**
필터 상태를 props로 받고, 변경 시 부모에게 알림

```typescript
"use client";

import { Button } from "@/components/ui/button";
import type { BudgetRange, Region, Environment, BestSeason } from "@/lib/types";

interface FilterSectionProps {
  selectedBudget: BudgetRange[];
  selectedRegions: Region[];
  selectedEnvironments: Environment[];
  selectedSeasons: BestSeason[];
  onBudgetChange: (budget: BudgetRange[]) => void;
  onRegionChange: (regions: Region[]) => void;
  onEnvironmentChange: (environments: Environment[]) => void;
  onSeasonChange: (seasons: BestSeason[]) => void;
  onReset: () => void;
}

export function FilterSection({
  selectedBudget,
  selectedRegions,
  selectedEnvironments,
  selectedSeasons,
  onBudgetChange,
  onRegionChange,
  onEnvironmentChange,
  onSeasonChange,
  onReset,
}: FilterSectionProps) {
  // 옵션 정의
  const budgetOptions: BudgetRange[] = ["100만원 이하", "100~200만원", "200만원 이상"];
  const regionOptions: Region[] = ["수도권", "경상도", "전라도", "강원도", "제주도", "충청도"];
  const environmentOptions: Environment[] = ["자연친화", "도심선호", "카페작업", "코워킹 필수"];
  const seasonOptions: BestSeason[] = ["봄", "여름", "가을", "겨울"];

  // 필터 토글 핸들러
  const toggleFilter = <T,>(selected: T[], item: T, onChange: (items: T[]) => void) => {
    if (selected.includes(item)) {
      onChange(selected.filter(i => i !== item));
    } else {
      onChange([...selected, item]);
    }
  };

  // 선택된 필터 개수 계산
  const totalFilters =
    selectedBudget.length +
    selectedRegions.length +
    selectedEnvironments.length +
    selectedSeasons.length;

  return (
    <section className="border-b bg-muted/30 py-6">
      <div className="container">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            필터 {totalFilters > 0 && `(${totalFilters})`}
          </h3>
          {totalFilters > 0 && (
            <Button variant="outline" size="sm" onClick={onReset}>
              초기화
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {/* 예산 필터 */}
          <div>
            <h4 className="mb-2 text-sm font-semibold">💵 예산</h4>
            <div className="flex flex-wrap gap-2">
              {budgetOptions.map((budget) => (
                <Button
                  key={budget}
                  variant={selectedBudget.includes(budget) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter(selectedBudget, budget, onBudgetChange)}
                >
                  {budget}
                </Button>
              ))}
            </div>
          </div>

          {/* 지역 필터 */}
          <div>
            <h4 className="mb-2 text-sm font-semibold">📍 지역</h4>
            <div className="flex flex-wrap gap-2">
              {regionOptions.map((region) => (
                <Button
                  key={region}
                  variant={selectedRegions.includes(region) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter(selectedRegions, region, onRegionChange)}
                >
                  {region}
                </Button>
              ))}
            </div>
          </div>

          {/* 환경 필터 */}
          <div>
            <h4 className="mb-2 text-sm font-semibold">🌿 환경</h4>
            <div className="flex flex-wrap gap-2">
              {environmentOptions.map((env) => (
                <Button
                  key={env}
                  variant={selectedEnvironments.includes(env) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter(selectedEnvironments, env, onEnvironmentChange)}
                >
                  {env}
                </Button>
              ))}
            </div>
          </div>

          {/* 계절 필터 */}
          <div>
            <h4 className="mb-2 text-sm font-semibold">🍂 최고 계절</h4>
            <div className="flex flex-wrap gap-2">
              {seasonOptions.map((season) => (
                <Button
                  key={season}
                  variant={selectedSeasons.includes(season) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter(selectedSeasons, season, onSeasonChange)}
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

**구체적인 수정:**
1. Props 추가: 선택된 필터 상태와 onChange 콜백
2. 내부 useState 제거 (제어 컴포넌트로 변경)
3. 필터 개수 표시 추가
4. 초기화 버튼 추가

**검증:**
- `npx tsc --noEmit` 실행
- PopularCities에서 props 전달 필요 (Task 2에서 수정)

---

### ✅ Task 2: PopularCities에서 필터링 로직 구현

**수정할 파일:**
- `components/home/popular-cities.tsx`

**수정 내용:**
필터 상태 관리 및 필터링 + 정렬 통합

```typescript
"use client";

import { useState, useMemo } from "react";
import { CityCard } from "@/components/cities/city-card";
import { getTopCities } from "@/lib/mock-data";
import { FilterSection } from "@/components/home/filter-section";
import type { City, CityLikeState, BudgetRange, Region, Environment, BestSeason } from "@/lib/types";

export function PopularCities() {
  const initialCities = getTopCities(10);

  // 필터 상태 관리
  const [selectedBudget, setSelectedBudget] = useState<BudgetRange[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<Region[]>([]);
  const [selectedEnvironments, setSelectedEnvironments] = useState<Environment[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<BestSeason[]>([]);

  // 좋아요 상태 관리
  const [likeStates, setLikeStates] = useState<CityLikeState[]>(
    initialCities.map((city) => ({
      cityId: city.id,
      likes: city.likes,
      dislikes: city.dislikes,
      userAction: null,
    }))
  );

  // 필터 초기화
  const handleResetFilters = () => {
    setSelectedBudget([]);
    setSelectedRegions([]);
    setSelectedEnvironments([]);
    setSelectedSeasons([]);
  };

  // 필터링 + 정렬된 도시 리스트 (useMemo로 최적화)
  const filteredAndSortedCities = useMemo(() => {
    // 1. 좋아요 상태 반영
    const citiesWithLikes = initialCities.map((city) => {
      const likeState = likeStates.find((state) => state.cityId === city.id);
      return {
        ...city,
        likes: likeState?.likes ?? city.likes,
        dislikes: likeState?.dislikes ?? city.dislikes,
      };
    });

    // 2. 필터링
    let filtered = citiesWithLikes;

    // 예산 필터
    if (selectedBudget.length > 0) {
      filtered = filtered.filter((city) => selectedBudget.includes(city.budgetRange));
    }

    // 지역 필터
    if (selectedRegions.length > 0) {
      filtered = filtered.filter((city) => selectedRegions.includes(city.region));
    }

    // 환경 필터 (배열이므로 일부 포함되면 OK)
    if (selectedEnvironments.length > 0) {
      filtered = filtered.filter((city) =>
        selectedEnvironments.some((env) => city.environments.includes(env))
      );
    }

    // 계절 필터
    if (selectedSeasons.length > 0) {
      filtered = filtered.filter((city) => selectedSeasons.includes(city.bestSeason));
    }

    // 3. 좋아요 수 기준 내림차순 정렬
    return filtered.sort((a, b) => b.likes - a.likes);
  }, [
    initialCities,
    likeStates,
    selectedBudget,
    selectedRegions,
    selectedEnvironments,
    selectedSeasons,
  ]);

  // 좋아요/싫어요 업데이트 핸들러
  const handleLikeUpdate = (
    cityId: string,
    newLikes: number,
    newDislikes: number,
    newUserAction: "like" | "dislike" | null
  ) => {
    setLikeStates((prev) =>
      prev.map((state) =>
        state.cityId === cityId
          ? { ...state, likes: newLikes, dislikes: newDislikes, userAction: newUserAction }
          : state
      )
    );
  };

  return (
    <section className="py-16">
      <FilterSection
        selectedBudget={selectedBudget}
        selectedRegions={selectedRegions}
        selectedEnvironments={selectedEnvironments}
        selectedSeasons={selectedSeasons}
        onBudgetChange={setSelectedBudget}
        onRegionChange={setSelectedRegions}
        onEnvironmentChange={setSelectedEnvironments}
        onSeasonChange={setSelectedSeasons}
        onReset={handleResetFilters}
      />

      <div className="container mt-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">도시 리스트</h2>
          <p className="mt-2 text-muted-foreground">
            {filteredAndSortedCities.length}개 도시 · 좋아요 수 기준으로 정렬됩니다
          </p>
        </div>

        {filteredAndSortedCities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-semibold text-muted-foreground">
              선택한 필터에 맞는 도시가 없습니다
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              다른 필터를 선택하거나 초기화 버튼을 눌러주세요
            </p>
            <Button variant="outline" className="mt-4" onClick={handleResetFilters}>
              필터 초기화
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredAndSortedCities.map((city) => {
              const likeState = likeStates.find((state) => state.cityId === city.id);
              return (
                <CityCard
                  key={city.id}
                  city={city}
                  initialUserAction={likeState?.userAction ?? null}
                  onLikeUpdate={handleLikeUpdate}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
```

**구현 세부사항:**
1. **필터 상태 관리**: 4가지 필터 상태 (useState)
2. **필터링 로직**: 선택된 필터에 따라 도시 필터링
3. **환경 필터**: some() 사용하여 일부 포함되면 OK
4. **정렬**: 필터링 후 좋아요 수 기준 정렬
5. **결과 없음 처리**: 빈 배열일 때 메시지 표시
6. **도시 개수 표시**: "10개 도시"

**검증:**
- `npx tsc --noEmit` 실행
- Button import 필요 (Task 2에서 추가)

---

### ✅ Task 3: 최종 검증 및 통합 테스트

**검증 체크리스트:**

1. **타입 체크:**
   - [ ] `npx tsc --noEmit` 통과

2. **필터링 기능 테스트:**
   - [ ] 예산 필터 선택 시 해당 예산 도시만 표시
   - [ ] 지역 필터 선택 시 해당 지역 도시만 표시
   - [ ] 환경 필터 선택 시 해당 환경 포함 도시만 표시
   - [ ] 계절 필터 선택 시 해당 계절 도시만 표시
   - [ ] 다중 필터 조합 시 AND 조건으로 필터링

3. **필터링 + 정렬 통합:**
   - [ ] 필터링된 결과가 좋아요 순으로 정렬
   - [ ] 좋아요 클릭 시 필터링 상태 유지하며 재정렬

4. **UI/UX 확인:**
   - [ ] 선택된 필터 개수 표시
   - [ ] 초기화 버튼 정상 작동
   - [ ] 필터링 결과 없을 때 메시지 표시
   - [ ] 도시 개수 표시

5. **전체 기능 통합 테스트:**
   - [ ] 좋아요/싫어요 기능 정상 작동
   - [ ] 네비게이션 정상 작동
   - [ ] 인증 페이지 정상 작동
   - [ ] 반응형 디자인 정상 작동

6. **빌드 테스트:**
   - [ ] `npm run build` 실행하여 프로덕션 빌드 성공 확인

---

## Critical Files to Modify

### 수정할 파일:
1. `components/home/filter-section.tsx` - 제어 컴포넌트로 변경
2. `components/home/popular-cities.tsx` - 필터 상태 관리 및 필터링 로직 구현

---

## Implementation Steps (순서대로 진행)

1. **Task 1**: FilterSection을 제어 컴포넌트로 변경
2. **Task 2**: PopularCities에서 필터링 로직 구현
3. **Task 3**: 최종 검증 및 통합 테스트

**각 Task 완료 후:**
- `npx tsc --noEmit` 실행
- 문제가 있으면 즉시 수정
- SPEC.md의 해당 체크박스에 체크

---

## Notes

- **Phase 5는 최종 단계**이므로 모든 기능을 통합하고 검증합니다.
- **필터링 + 정렬 통합**이 핵심입니다.
- **useMemo 최적화**로 불필요한 재계산 방지
- **빈 결과 처리**로 UX 개선

---

## Filtering Logic

### 예산 필터 (OR 조건):
```typescript
if (selectedBudget.length > 0) {
  filtered = filtered.filter((city) => selectedBudget.includes(city.budgetRange));
}
```

### 지역 필터 (OR 조건):
```typescript
if (selectedRegions.length > 0) {
  filtered = filtered.filter((city) => selectedRegions.includes(city.region));
}
```

### 환경 필터 (OR 조건, 배열 일부 포함):
```typescript
if (selectedEnvironments.length > 0) {
  filtered = filtered.filter((city) =>
    selectedEnvironments.some((env) => city.environments.includes(env))
  );
}
```

### 계절 필터 (OR 조건):
```typescript
if (selectedSeasons.length > 0) {
  filtered = filtered.filter((city) => selectedSeasons.includes(city.bestSeason));
}
```

### 다중 필터 (AND 조건):
각 필터는 순차적으로 적용되므로, 모든 조건을 만족하는 도시만 최종 결과에 포함됩니다.

---

## Testing Scenarios

### 시나리오 1: 단일 필터
- 예산 "100만원 이하" 선택
- 결과: 전주, 속초, 춘천, 경주 (4개)

### 시나리오 2: 다중 필터 (AND)
- 예산 "100만원 이하" + 지역 "강원도" 선택
- 결과: 속초, 춘천 (2개)

### 시나리오 3: 환경 필터 (일부 포함)
- 환경 "카페작업" 선택
- 결과: 제주시, 강릉, 부산, 전주, 춘천 (환경에 "카페작업" 포함)

### 시나리오 4: 필터 초기화
- 여러 필터 선택
- 초기화 버튼 클릭
- 결과: 모든 도시 표시 (10개)

### 시나리오 5: 결과 없음
- 예산 "200만원 이상" + 지역 "강원도" 선택
- 결과: 빈 배열 (해당 조건 만족하는 도시 없음)
- "선택한 필터에 맞는 도시가 없습니다" 메시지 표시

### 시나리오 6: 필터링 + 정렬
- 지역 "강원도" 선택
- 결과: 강릉(389), 속초(178), 춘천(145) - 좋아요 순 정렬
- 춘천 좋아요 클릭
- 결과: 강릉(389), 춘천(146), 속초(178) - 재정렬

---

## Performance Considerations

1. **useMemo 사용**:
   - 필터 상태와 좋아요 상태가 변경될 때만 재계산
   - 불필요한 필터링/정렬 방지

2. **필터링 복잡도**:
   - O(n) - 각 필터마다 배열 순회
   - 총 O(4n) = O(n) - 10개 도시이므로 성능 문제 없음

3. **정렬 복잡도**:
   - O(n log n) - JavaScript의 .sort() 사용
   - 필터링 후 정렬이므로 데이터 수가 줄어듦

---

## Expected Behavior

### 초기 상태 (필터 없음):
```
10개 도시 · 좋아요 수 기준으로 정렬됩니다

1. 서울 강남 (👍 503)
2. 제주시 (👍 456)
3. 부산 해운대 (👍 421)
...
10. 경주 (👍 123)
```

### 지역 "강원도" 선택:
```
3개 도시 · 좋아요 수 기준으로 정렬됩니다

1. 강릉 (👍 389)
2. 속초 (👍 178)
3. 춘천 (👍 145)
```

### 예산 "100만원 이하" + 지역 "강원도" 선택:
```
2개 도시 · 좋아요 수 기준으로 정렬됩니다

1. 속초 (👍 178)
2. 춘천 (👍 145)
```

### 예산 "200만원 이상" + 지역 "강원도" 선택:
```
선택한 필터에 맞는 도시가 없습니다
다른 필터를 선택하거나 초기화 버튼을 눌러주세요

[필터 초기화 버튼]
```

---

## UI Improvements

### 필터 섹션:
- 필터 개수 표시: "필터 (3)"
- 초기화 버튼: 필터가 선택되었을 때만 표시
- h3/h4 태그로 접근성 개선

### 도시 리스트:
- 도시 개수 표시: "3개 도시"
- 빈 결과 메시지: 중앙 정렬, 안내 문구
- 초기화 버튼: 빈 결과에서도 제공

---

## Final Integration

Phase 5 완료 후 전체 기능:
1. ✅ 네비게이션 단순화 (홈, 로그인, 회원가입)
2. ✅ 좋아요/싫어요 기능 (여러 번 클릭 가능)
3. ✅ 필터 UI (4가지 카테고리)
4. ✅ 도시 카드 Key-Value 표시
5. ✅ 좋아요 수 기준 정렬
6. ✅ **필터링 기능** ← Phase 5
7. ✅ **필터링 + 정렬 통합** ← Phase 5

전체 프로젝트 완료! 🎉
