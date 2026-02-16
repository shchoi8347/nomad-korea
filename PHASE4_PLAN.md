# Phase 4 Implementation Plan: 좋아요 수 기준 정렬 기능 구현

## Context

SPEC.md에 정의된 Phase 4 요구사항에 따라 좋아요 수를 기준으로 도시 리스트를 정렬하여 표시합니다. 좋아요 버튼 클릭 시 정렬 순서가 동적으로 변경되도록 구현합니다.

**Phase 4에 정의된 내용만 구현하며, 추가 기능은 구현하지 않습니다.**

**참고:** 필터 속성 추가와 좋아요/싫어요 초기값 설정은 이미 Phase 2, 3에서 완료되었으므로, Phase 4에서는 정렬 기능만 구현합니다.

---

## Implementation Approach

복잡한 구현보다 쉽고 간결한 방법을 선택하고, SOLID 원칙을 지키며 구현합니다:

1. **State Lifting**: 좋아요/싫어요 상태를 부모 컴포넌트로 올려서 정렬 가능하게 함
2. **Simple Sorting**: JavaScript의 `.sort()` 메서드로 간단하게 정렬
3. **Reactive Updates**: 좋아요 클릭 시 즉시 재정렬
4. **Type Safety**: TypeScript 타입 체크를 통과하도록 수정
5. **Incremental Verification**: 각 단계마다 typecheck 실행하여 검증

---

## Tasks to Complete

### ✅ Task 1: 도시별 좋아요/싫어요 상태 관리 타입 정의

**수정할 파일:**
- `lib/types.ts`

**추가할 타입:**
```typescript
// 도시별 좋아요/싫어요 상태
export interface CityLikeState {
  cityId: string;
  likes: number;
  dislikes: number;
  userAction: "like" | "dislike" | null;
}
```

**검증:**
- `npx tsc --noEmit` 실행하여 타입 정의 확인

---

### ✅ Task 2: PopularCities에서 도시 데이터 상태 관리

**수정할 파일:**
- `components/home/popular-cities.tsx`

**수정 내용:**
기존의 정적 데이터를 상태로 관리하여 정렬 가능하게 변경

```typescript
"use client";

import { useState, useMemo } from "react";
import { CityCard } from "@/components/cities/city-card";
import { getTopCities } from "@/lib/mock-data";
import { FilterSection } from "@/components/home/filter-section";
import type { City, CityLikeState } from "@/lib/types";

export function PopularCities() {
  const initialCities = getTopCities(10); // 모든 도시 가져오기

  // 도시별 좋아요/싫어요 상태 관리
  const [likeStates, setLikeStates] = useState<CityLikeState[]>(
    initialCities.map((city) => ({
      cityId: city.id,
      likes: city.likes,
      dislikes: city.dislikes,
      userAction: null,
    }))
  );

  // 좋아요 수 기준으로 정렬된 도시 리스트 (useMemo로 최적화)
  const sortedCities = useMemo(() => {
    const citiesWithLikes = initialCities.map((city) => {
      const likeState = likeStates.find((state) => state.cityId === city.id);
      return {
        ...city,
        likes: likeState?.likes ?? city.likes,
        dislikes: likeState?.dislikes ?? city.dislikes,
      };
    });

    // 좋아요 수 기준 내림차순 정렬
    return citiesWithLikes.sort((a, b) => b.likes - a.likes);
  }, [initialCities, likeStates]);

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
      <FilterSection />

      <div className="container mt-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">도시 리스트</h2>
          <p className="mt-2 text-muted-foreground">
            좋아요 수 기준으로 정렬됩니다
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sortedCities.map((city) => {
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
      </div>
    </section>
  );
}
```

**구현 세부사항:**
1. **"use client" 디렉티브 추가**: useState 사용을 위해 클라이언트 컴포넌트로 변경
2. **likeStates 상태**: 각 도시의 좋아요/싫어요 상태를 배열로 관리
3. **sortedCities**: useMemo를 사용하여 좋아요 수 기준 정렬 (성능 최적화)
4. **handleLikeUpdate**: 자식 컴포넌트에서 좋아요/싫어요 업데이트 시 호출되는 콜백
5. **설명 텍스트 변경**: "가장 많은 노마드들이 선택한 도시" → "좋아요 수 기준으로 정렬됩니다"

**검증:**
- `npx tsc --noEmit` 실행
- CityCard props가 변경되었으므로 오류 발생 예상 (Task 3에서 수정)

---

### ✅ Task 3: CityCard를 제어 컴포넌트로 변경

**수정할 파일:**
- `components/cities/city-card.tsx`

**수정 내용:**
기존의 비제어 컴포넌트(내부 상태 관리)를 제어 컴포넌트(부모에서 상태 관리)로 변경

```typescript
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { City } from "@/lib/types";
import { LikeDislikeButtons } from "@/components/ui/like-dislike-buttons";

interface CityCardProps {
  city: City;
  initialUserAction?: "like" | "dislike" | null;
  onLikeUpdate?: (
    cityId: string,
    newLikes: number,
    newDislikes: number,
    newUserAction: "like" | "dislike" | null
  ) => void;
}

export function CityCard({ city, initialUserAction = null, onLikeUpdate }: CityCardProps) {
  return (
    <Card className="overflow-hidden transition-all">
      {/* 이미지 및 기타 정보는 그대로 유지 */}
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
        {/* 도시 이름 및 필터 정보는 그대로 유지 */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold">{city.name}</h3>
          <p className="text-sm text-muted-foreground">{city.nameEn}</p>
        </div>

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

          {/* LikeDislikeButtons에 제어 props 전달 */}
          <div className="border-t pt-2">
            <LikeDislikeButtons
              initialLikes={city.likes}
              initialDislikes={city.dislikes}
              initialUserAction={initialUserAction}
              onUpdate={
                onLikeUpdate
                  ? (likes, dislikes, userAction) =>
                      onLikeUpdate(city.id, likes, dislikes, userAction)
                  : undefined
              }
            />
          </div>

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

**구체적인 수정:**
1. **Props 추가**: `initialUserAction`, `onLikeUpdate` (선택적)
2. **LikeDislikeButtons에 props 전달**: 부모로부터 받은 콜백을 전달
3. **onLikeUpdate가 없으면**: 기존처럼 독립적으로 작동 (하위 호환성 유지)

**검증:**
- `npx tsc --noEmit` 실행
- LikeDislikeButtons props가 변경되었으므로 오류 발생 예상 (Task 4에서 수정)

---

### ✅ Task 4: LikeDislikeButtons를 제어 컴포넌트로 변경

**수정할 파일:**
- `components/ui/like-dislike-buttons.tsx`

**수정 내용:**
부모로부터 받은 콜백으로 상태 변경을 알림

```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface LikeDislikeButtonsProps {
  initialLikes: number;
  initialDislikes: number;
  initialUserAction?: "like" | "dislike" | null;
  onUpdate?: (
    likes: number,
    dislikes: number,
    userAction: "like" | "dislike" | null
  ) => void;
}

export function LikeDislikeButtons({
  initialLikes,
  initialDislikes,
  initialUserAction = null,
  onUpdate,
}: LikeDislikeButtonsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userAction, setUserAction] = useState<"like" | "dislike" | null>(initialUserAction);

  const updateState = (
    newLikes: number,
    newDislikes: number,
    newUserAction: "like" | "dislike" | null
  ) => {
    setLikes(newLikes);
    setDislikes(newDislikes);
    setUserAction(newUserAction);

    // 부모 컴포넌트에 변경 알림
    if (onUpdate) {
      onUpdate(newLikes, newDislikes, newUserAction);
    }
  };

  const handleLike = () => {
    if (userAction === "like") {
      // 이미 좋아요 상태 → 취소
      updateState(likes - 1, dislikes, null);
    } else if (userAction === "dislike") {
      // 싫어요 상태 → 좋아요로 전환 (상호 배타적)
      updateState(likes + 1, dislikes - 1, "like");
    } else {
      // 아무 상태도 아님 → 좋아요 추가
      updateState(likes + 1, dislikes, "like");
    }
  };

  const handleDislike = () => {
    if (userAction === "dislike") {
      // 이미 싫어요 상태 → 취소
      updateState(likes, dislikes - 1, null);
    } else if (userAction === "like") {
      // 좋아요 상태 → 싫어요로 전환 (상호 배타적)
      updateState(likes - 1, dislikes + 1, "dislike");
    } else {
      // 아무 상태도 아님 → 싫어요 추가
      updateState(likes, dislikes + 1, "dislike");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        className={
          userAction === "like"
            ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
            : "hover:bg-gray-100"
        }
      >
        👍 {likes}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDislike}
        className={
          userAction === "dislike"
            ? "bg-red-50 text-red-600 hover:bg-red-100"
            : "hover:bg-gray-100"
        }
      >
        👎 {dislikes}
      </Button>
    </div>
  );
}
```

**구체적인 수정:**
1. **Props 추가**: `initialUserAction`, `onUpdate` (선택적)
2. **updateState 헬퍼 함수**: 상태 업데이트 시 부모에게도 알림
3. **onUpdate가 없으면**: 기존처럼 독립적으로 작동 (하위 호환성 유지)

**검증:**
- `npx tsc --noEmit` 실행
- 모든 타입 오류가 해결되었는지 확인

---

### ✅ Task 5: 최종 검증 및 테스트

**검증 체크리스트:**

1. **타입 체크:**
   - [ ] `npx tsc --noEmit` 통과

2. **정렬 기능 테스트:**
   - [ ] 초기 로드 시 좋아요 수 기준으로 정렬되는지 확인
   - [ ] 좋아요 버튼 클릭 시 정렬 순서가 동적으로 변경되는지 확인
   - [ ] 싫어요 버튼은 정렬에 영향을 주지 않는지 확인

3. **기존 기능 유지 확인:**
   - [ ] 좋아요/싫어요 버튼이 정상 작동하는지 확인
   - [ ] 상호 배타적 동작이 유지되는지 확인
   - [ ] 필터 정보가 정상적으로 표시되는지 확인

4. **성능 확인:**
   - [ ] useMemo로 불필요한 재정렬이 방지되는지 확인
   - [ ] 버튼 클릭 시 부드럽게 재정렬되는지 확인

5. **빌드 테스트:**
   - [ ] `npm run build` 실행하여 프로덕션 빌드 성공 확인

---

## Critical Files to Modify

### 수정할 파일:
1. `lib/types.ts` - CityLikeState 타입 추가
2. `components/home/popular-cities.tsx` - 상태 관리 및 정렬 로직 구현
3. `components/cities/city-card.tsx` - 제어 컴포넌트로 변경
4. `components/ui/like-dislike-buttons.tsx` - 제어 컴포넌트로 변경

---

## Implementation Steps (순서대로 진행)

1. **Task 1**: CityLikeState 타입 정의
2. **Task 2**: PopularCities에서 상태 관리 및 정렬 로직 구현
3. **Task 3**: CityCard를 제어 컴포넌트로 변경
4. **Task 4**: LikeDislikeButtons를 제어 컴포넌트로 변경
5. **Task 5**: 최종 검증

**각 Task 완료 후:**
- `npx tsc --noEmit` 실행
- 문제가 있으면 즉시 수정
- SPEC.md의 해당 체크박스에 체크

---

## Notes

- **Phase 4에 정의된 내용만 구현**하며, Phase 5의 필터링 기능은 구현하지 않습니다.
- **좋아요 수 기준 정렬**이 핵심이므로, 정렬 로직에 집중합니다.
- **상태 끌어올리기 (Lifting State Up)**: 좋아요 상태를 부모로 올려서 정렬 가능하게 만듭니다.
- **하위 호환성 유지**: onUpdate가 없으면 기존처럼 독립적으로 작동합니다.
- **useMemo 최적화**: 불필요한 재정렬을 방지하여 성능을 최적화합니다.

---

## Architecture Decision

### 상태 관리 패턴: Lifting State Up

**왜 상태를 부모로 올렸나요?**
- 각 CityCard가 독립적으로 좋아요 상태를 관리하면, 부모에서 정렬할 수 없음
- 좋아요 수가 변경되면 즉시 정렬 순서가 변경되어야 함
- 부모 컴포넌트(PopularCities)에서 모든 도시의 좋아요 상태를 관리하여 정렬 가능

**트레이드오프:**
- ✅ 장점: 정렬 가능, 중앙 집중식 상태 관리
- ❌ 단점: 컴포넌트 복잡도 증가, Props drilling

**대안:**
- Context API 또는 Zustand 같은 전역 상태 관리 라이브러리
- 하지만 Phase 4에서는 간단한 Lifting State Up으로 충분

---

## Performance Considerations

1. **useMemo 사용**:
   - likeStates가 변경될 때만 재정렬
   - 불필요한 재정렬 방지

2. **정렬 복잡도**:
   - O(n log n) - JavaScript의 .sort() 사용
   - 10개 도시이므로 성능 문제 없음

3. **리렌더링 최적화**:
   - 좋아요 클릭 시 해당 도시만 상태 업데이트
   - useMemo로 정렬된 배열만 재계산

---

## Testing Scenarios

### 시나리오 1: 초기 정렬 확인
- 페이지 로드 시 좋아요 수가 많은 도시가 먼저 표시되는지 확인
- 현재 데이터: 서울 강남(503) > 제주시(456) > 부산(421) > ...

### 시나리오 2: 좋아요 클릭 후 재정렬
1. 경주(123 좋아요)의 좋아요 버튼 클릭
2. 경주의 좋아요가 124로 증가
3. 정렬 순서가 즉시 변경되는지 확인

### 시나리오 3: 순위 역전
1. 가장 아래 도시(경주, 123)의 좋아요를 여러 번 클릭
2. 좋아요가 500을 넘으면 1등으로 올라가는지 확인
3. 부드럽게 위치가 변경되는지 확인

### 시나리오 4: 좋아요 취소 후 재정렬
1. 1등 도시의 좋아요 클릭 (활성화)
2. 다시 클릭 (취소)
3. 좋아요 수가 감소하고 순위가 내려가는지 확인

---

## Expected Behavior

### 초기 상태 (좋아요 수 기준 정렬):
```
1. 서울 강남 (👍 503)
2. 제주시 (👍 456)
3. 부산 해운대 (👍 421)
4. 강릉 (👍 389)
5. 전주 (👍 267)
6. 대구 (👍 234)
7. 여수 (👍 198)
8. 속초 (👍 178)
9. 춘천 (👍 145)
10. 경주 (👍 123)
```

### 경주 좋아요 클릭 후:
```
경주: 123 → 124 (순위 변화 없음, 여전히 10등)
```

### 경주를 여러 번 클릭하여 400 이상으로 만든 후:
```
1. 서울 강남 (👍 503)
2. 제주시 (👍 456)
3. 부산 해운대 (👍 421)
4. 경주 (👍 400+) ← 10등 → 4등으로 상승!
5. 강릉 (👍 389)
...
```

---

## Future Enhancements (Phase 4 이후)

Phase 4에서는 구현하지 않지만, Phase 5에서 추가될 기능:
- 필터 선택에 따른 도시 리스트 필터링
- 필터와 정렬의 조합 (필터링 후 정렬)
- 정렬 옵션 추가 (좋아요순, 최신순, 이름순 등)
- 애니메이션 효과 (정렬 시 부드러운 전환)
