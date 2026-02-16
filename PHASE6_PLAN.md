# Phase 6 Implementation Plan: 검색 및 정렬 옵션 확장

## Context

Phase 1-5에서 구현한 필터링 및 정렬 기능을 확장하여 사용자가 더 쉽게 원하는 도시를 찾을 수 있도록 합니다. 검색바를 추가하고, 다양한 정렬 옵션을 제공하며, 검색 + 필터 + 정렬이 통합적으로 작동하도록 개선합니다.

**Phase 6는 사용자 경험(UX)을 크게 향상시키는 단계입니다.**

---

## Implementation Approach

복잡한 구현보다 쉽고 간결한 방법을 선택하고, SOLID 원칙을 지키며 구현합니다:

1. **Search State Management**: 검색어 상태를 PopularCities에서 관리
2. **Debounced Search**: 입력 지연을 적용하여 성능 최적화 (선택사항)
3. **Sorting Options**: 드롭다운으로 정렬 기준 선택
4. **Unified Filtering**: 검색 + 필터 + 정렬을 하나의 useMemo로 통합
5. **Type Safety**: TypeScript 타입 체크를 통과하도록 수정
6. **Incremental Verification**: 각 단계마다 typecheck 실행하여 검증

---

## Tasks to Complete

### ✅ Task 1: 검색바 UI 컴포넌트 구현

**생성할 파일:**
- `components/home/search-bar.tsx`

**구현 내용:**
```typescript
"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultCount: number;
}

export function SearchBar({ searchQuery, onSearchChange, resultCount }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="도시 이름으로 검색..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
      {searchQuery && (
        <p className="mt-2 text-sm text-muted-foreground">
          "{searchQuery}" 검색 결과: {resultCount}개 도시
        </p>
      )}
    </div>
  );
}
```

**구체적인 수정:**
1. lucide-react의 Search 아이콘 사용
2. 제어 컴포넌트 패턴 (searchQuery props)
3. 검색 결과 개수 표시
4. shadcn/ui Input 컴포넌트 활용

**검증:**
- `npx tsc --noEmit` 실행
- lucide-react 패키지 설치 필요 시: `npm install lucide-react`

---

### ✅ Task 2: 정렬 옵션 드롭다운 구현

**생성할 파일:**
- `components/home/sort-dropdown.tsx`

**구현 내용:**
```typescript
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SortOption = "likes-desc" | "likes-asc" | "name-asc" | "name-desc";

interface SortDropdownProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function SortDropdown({ sortBy, onSortChange }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">정렬:</span>
      <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="likes-desc">👍 좋아요 많은 순</SelectItem>
          <SelectItem value="likes-asc">👍 좋아요 적은 순</SelectItem>
          <SelectItem value="name-asc">🔤 이름 오름차순</SelectItem>
          <SelectItem value="name-desc">🔤 이름 내림차순</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
```

**구체적인 수정:**
1. SortOption 타입 정의 (export)
2. shadcn/ui Select 컴포넌트 사용
3. 4가지 정렬 옵션 제공
4. 제어 컴포넌트 패턴

**검증:**
- `npx tsc --noEmit` 실행

---

### ✅ Task 3: PopularCities에서 검색 + 정렬 통합

**수정할 파일:**
- `components/home/popular-cities.tsx`

**수정 내용:**
검색 상태와 정렬 상태 추가, 필터링 로직 확장

```typescript
"use client";

import { useState, useMemo } from "react";
import { CityCard } from "@/components/cities/city-card";
import { getTopCities } from "@/lib/mock-data";
import { FilterSection } from "@/components/home/filter-section";
import { SearchBar } from "@/components/home/search-bar";
import { SortDropdown, SortOption } from "@/components/home/sort-dropdown";
import { Button } from "@/components/ui/button";
import type { CityLikeState, BudgetRange, Region, Environment, BestSeason } from "@/lib/types";

export function PopularCities() {
  const initialCities = getTopCities(10);

  // 검색 상태 관리
  const [searchQuery, setSearchQuery] = useState("");

  // 정렬 상태 관리
  const [sortBy, setSortBy] = useState<SortOption>("likes-desc");

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
    setSearchQuery("");
    setSortBy("likes-desc");
  };

  // 검색 + 필터링 + 정렬된 도시 리스트 (useMemo로 최적화)
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

    // 2. 검색 필터링
    let filtered = citiesWithLikes;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (city) =>
          city.name.toLowerCase().includes(query) ||
          city.nameEn.toLowerCase().includes(query)
      );
    }

    // 3. 필터링 (기존 로직)
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

    // 4. 정렬
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "likes-desc":
          return b.likes - a.likes;
        case "likes-asc":
          return a.likes - b.likes;
        case "name-asc":
          return a.name.localeCompare(b.name, "ko");
        case "name-desc":
          return b.name.localeCompare(a.name, "ko");
        default:
          return 0;
      }
    });
  }, [
    initialCities,
    likeStates,
    searchQuery,
    selectedBudget,
    selectedRegions,
    selectedEnvironments,
    selectedSeasons,
    sortBy,
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
            {filteredAndSortedCities.length}개 도시
          </p>
        </div>

        {/* 검색바 + 정렬 드롭다운 */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              resultCount={filteredAndSortedCities.length}
            />
          </div>
          <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
        </div>

        {filteredAndSortedCities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-semibold text-muted-foreground">
              {searchQuery
                ? `"${searchQuery}" 검색 결과가 없습니다`
                : "선택한 필터에 맞는 도시가 없습니다"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              다른 검색어나 필터를 선택하거나 초기화 버튼을 눌러주세요
            </p>
            <Button variant="outline" className="mt-4" onClick={handleResetFilters}>
              전체 초기화
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
1. **검색 필터링**: 도시 이름(한글/영문) 모두 검색 가능
2. **정렬 로직**: switch 문으로 4가지 정렬 처리
3. **한글 정렬**: localeCompare("ko") 사용
4. **빈 결과 메시지**: 검색과 필터 구분
5. **전체 초기화**: 검색 + 필터 + 정렬 모두 초기화

**검증:**
- `npx tsc --noEmit` 실행

---

### ✅ Task 4: 최종 검증 및 통합 테스트

**검증 체크리스트:**

1. **타입 체크:**
   - [ ] `npx tsc --noEmit` 통과

2. **검색 기능 테스트:**
   - [ ] 도시 이름(한글) 검색 정상 작동
   - [ ] 도시 이름(영문) 검색 정상 작동
   - [ ] 검색 결과 개수 표시
   - [ ] 검색어 입력 시 실시간 필터링

3. **정렬 기능 테스트:**
   - [ ] "좋아요 많은 순" 정렬 정상 작동
   - [ ] "좋아요 적은 순" 정렬 정상 작동
   - [ ] "이름 오름차순" 정렬 정상 작동 (한글 가나다순)
   - [ ] "이름 내림차순" 정렬 정상 작동

4. **검색 + 필터 + 정렬 통합:**
   - [ ] 검색 + 필터 조합 시 정상 작동
   - [ ] 검색 + 정렬 조합 시 정상 작동
   - [ ] 필터 + 정렬 조합 시 정상 작동
   - [ ] 검색 + 필터 + 정렬 모두 조합 시 정상 작동
   - [ ] 좋아요 클릭 시 정렬 유지되며 재정렬

5. **UI/UX 확인:**
   - [ ] 검색바 디자인 일관성
   - [ ] 정렬 드롭다운 접근성
   - [ ] 빈 결과 메시지 적절성
   - [ ] 전체 초기화 버튼 정상 작동
   - [ ] 반응형 디자인 (모바일/데스크톱)

6. **성능 확인:**
   - [ ] useMemo 최적화 작동 확인
   - [ ] 검색 입력 시 렉 없이 반응
   - [ ] 정렬 변경 시 즉시 반영

---

## Critical Files to Modify/Create

### 생성할 파일:
1. `components/home/search-bar.tsx` - 검색바 컴포넌트
2. `components/home/sort-dropdown.tsx` - 정렬 드롭다운 컴포넌트

### 수정할 파일:
1. `components/home/popular-cities.tsx` - 검색 + 정렬 상태 관리 및 로직 통합

---

## Implementation Steps (순서대로 진행)

1. **Task 1**: 검색바 UI 컴포넌트 구현
2. **Task 2**: 정렬 옵션 드롭다운 구현
3. **Task 3**: PopularCities에서 검색 + 정렬 통합
4. **Task 4**: 최종 검증 및 통합 테스트

**각 Task 완료 후:**
- `npx tsc --noEmit` 실행
- 문제가 있으면 즉시 수정

---

## Notes

- **검색은 클라이언트 사이드에서 처리**합니다 (가짜 데이터 사용 중).
- **Debounce는 선택사항**입니다 (10개 도시이므로 성능 문제 없음).
- **정렬 옵션은 확장 가능**합니다 (예: 예산 순, 지역 순 등).
- **useMemo 최적화**로 불필요한 재계산 방지.
- **한글 정렬**은 localeCompare("ko")를 사용하여 정확하게 처리.

---

## Testing Scenarios

### 시나리오 1: 검색만 사용
- 검색어 "강" 입력
- 결과: 강릉, 강남 (도시 이름에 "강" 포함)

### 시나리오 2: 검색 + 필터
- 검색어 "부산" 입력 + 지역 "경상도" 선택
- 결과: 부산 해운대

### 시나리오 3: 검색 + 정렬
- 검색어 "서울" 입력 + 정렬 "이름 오름차순"
- 결과: 서울 강남 (검색 결과를 이름순으로 정렬)

### 시나리오 4: 정렬만 변경
- 정렬 "이름 오름차순" 선택
- 결과: 강남, 강릉, 경주, 대구, 부산, 속초, 전주, 제주, 춘천 순서

### 시나리오 5: 전체 조합
- 검색어 "강" + 지역 "강원도" + 정렬 "좋아요 적은 순"
- 결과: 강릉만 표시 (좋아요 적은 순)

### 시나리오 6: 전체 초기화
- 여러 검색/필터/정렬 적용
- "전체 초기화" 버튼 클릭
- 결과: 검색어 지워짐, 필터 모두 해제, 정렬 "좋아요 많은 순"으로 초기화

---

## Performance Considerations

1. **useMemo 사용**:
   - 검색어, 필터, 정렬 상태가 변경될 때만 재계산
   - 불필요한 필터링/정렬 방지

2. **검색 복잡도**:
   - O(n) - 배열 순회 (10개 도시)
   - 성능 문제 없음

3. **정렬 복잡도**:
   - O(n log n) - JavaScript의 .sort()
   - 필터링 후 정렬이므로 데이터 수가 줄어듦

4. **Debounce (선택사항)**:
   - 현재는 10개 도시로 성능 문제 없음
   - 향후 도시 수 증가 시 useDebounce 훅 추가 고려

---

## UI Improvements

### 검색바:
- 왼쪽에 돋보기 아이콘 (lucide-react)
- 플레이스홀더: "도시 이름으로 검색..."
- 검색 결과 개수 표시 (검색어 입력 시에만)

### 정렬 드롭다운:
- 라벨: "정렬:"
- 4가지 옵션 (좋아요↓, 좋아요↑, 이름↑, 이름↓)
- 이모지로 직관성 향상

### 레이아웃:
- 검색바 + 정렬을 한 줄에 배치 (데스크톱)
- 모바일에서는 세로로 배치 (flex-col → flex-row)

---

## Expected Behavior

### 초기 상태:
```
도시 리스트
10개 도시

[검색바: 도시 이름으로 검색...]  [정렬: 👍 좋아요 많은 순 ▼]

1. 서울 강남 (👍 503)
2. 제주시 (👍 456)
...
```

### 검색어 "강" 입력:
```
도시 리스트
2개 도시

[검색바: 강]  [정렬: 👍 좋아요 많은 순 ▼]
"강" 검색 결과: 2개 도시

1. 서울 강남 (👍 503)
2. 강릉 (👍 389)
```

### 정렬 "이름 오름차순" 선택:
```
도시 리스트
10개 도시

[검색바: 도시 이름으로 검색...]  [정렬: 🔤 이름 오름차순 ▼]

1. 강남 (👍 503)
2. 강릉 (👍 389)
3. 경주 (👍 123)
4. 대구 (👍 234)
...
```

---

## Next Steps (Phase 7 이후)

Phase 6 완료 후 고려할 수 있는 추가 기능:
1. **Phase 7: 도시 상세 모달** - 카드 클릭 시 상세 정보 표시
2. **Phase 8: 북마크 기능** - 관심 도시 저장 (localStorage)
3. **Phase 9: Dashboard 개선** - 북마크한 도시 목록 표시
4. **Phase 10: Supabase 연동** - 실제 인증 및 데이터 저장

---

## Dependencies

### 필요한 패키지:
- `lucide-react` - 검색 아이콘 (설치 필요 시: `npm install lucide-react`)
- shadcn/ui의 Input, Select 컴포넌트 (이미 설치됨)

### 설치 명령어:
```bash
npm install lucide-react
```

---

Phase 6 완료 시 사용자는 검색, 필터, 정렬을 자유롭게 조합하여 원하는 도시를 쉽게 찾을 수 있습니다! 🔍
