# Phase 2 Implementation Plan: 좋아요/싫어요 기능 구현

## Context

SPEC.md에 정의된 Phase 2 요구사항에 따라 별점 평점을 대체하여 좋아요/싫어요 버튼 시스템을 구현합니다. 버튼 클릭 시 아이콘 색상 변경 및 숫자 증감 기능을 추가하고, "이번 달 인기 도시 TOP 10" 제목을 "도시 리스트"로 변경합니다.

**Phase 2에 정의된 내용만 구현하며, 추가 기능은 구현하지 않습니다.**

---

## Implementation Approach

복잡한 구현보다 쉽고 간결한 방법을 선택하고, SOLID 원칙을 지키며 구현합니다:

1. **Single Responsibility**: 좋아요/싫어요 로직을 별도 컴포넌트로 분리
2. **Simple & Clean**: 타입 수정 → Mock 데이터 수정 → 컴포넌트 구현 → UI 통합 순서로 진행
3. **Type Safety**: TypeScript 타입 체크를 통과하도록 수정
4. **Client-Side State**: React useState를 사용한 간단한 상태 관리 (Phase 2에서는 서버 연동 없음)
5. **Incremental Verification**: 각 단계마다 lint와 typecheck 실행하여 검증

---

## Tasks to Complete

### ✅ Task 1: City 타입에 좋아요/싫어요 필드 추가

**수정할 파일:**
- `lib/types.ts`

**수정 내용:**
```typescript
export interface City {
  id: string;
  name: string;
  nameEn: string;
  region: string;
  description: string;
  images: string[];
  overallRating: number; // Phase 2에서는 유지하지만 UI에는 미표시
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
  // 추가할 필드
  likes: number;      // 좋아요 수
  dislikes: number;   // 싫어요 수
}
```

**구체적인 수정:**
1. City interface의 마지막 부분에 `likes: number;` 추가
2. `dislikes: number;` 추가

**검증:**
- `npx tsc --noEmit` 실행하여 타입 오류 확인 (Mock 데이터에 필드 추가 전까지는 오류 발생 예상)

---

### ✅ Task 2: Mock 데이터에 좋아요/싫어요 초기값 추가

**수정할 파일:**
- `lib/mock-data.ts`

**수정 내용:**
각 도시 데이터 객체에 `likes`와 `dislikes` 초기값 추가

**예시:**
```typescript
{
  id: "jeju",
  name: "제주시",
  nameEn: "Jeju City",
  // ... 기존 필드들 ...
  tags: ["해변", "카페", "자연", "관광"],
  likes: 324,      // 추가
  dislikes: 12,    // 추가
},
```

**구체적인 수정:**
1. mockCities 배열의 모든 도시 객체에 likes, dislikes 필드 추가
2. 다양한 초기값 설정 (예: likes는 50~500 사이, dislikes는 5~50 사이)
3. 인기 도시일수록 likes가 높고 dislikes가 낮도록 설정

**검증:**
- `npx tsc --noEmit` 실행하여 타입 오류 해결 확인
- 모든 도시에 필드가 추가되었는지 확인

---

### ✅ Task 3: LikeDislikeButtons 컴포넌트 생성

**생성할 파일:**
- `components/ui/like-dislike-buttons.tsx`

**컴포넌트 구조:**
```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface LikeDislikeButtonsProps {
  initialLikes: number;
  initialDislikes: number;
}

export function LikeDislikeButtons({
  initialLikes,
  initialDislikes
}: LikeDislikeButtonsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userAction, setUserAction] = useState<"like" | "dislike" | null>(null);

  const handleLike = () => {
    // 좋아요 토글 로직
    // 상호 배타적 처리 포함
  };

  const handleDislike = () => {
    // 싫어요 토글 로직
    // 상호 배타적 처리 포함
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        className={/* 활성화 상태에 따른 색상 */}
      >
        👍 {likes}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDislike}
        className={/* 활성화 상태에 따른 색상 */}
      >
        👎 {dislikes}
      </Button>
    </div>
  );
}
```

**구현 로직:**

1. **State 관리:**
   - `likes`: 현재 좋아요 수
   - `dislikes`: 현재 싫어요 수
   - `userAction`: 사용자가 선택한 액션 ("like" | "dislike" | null)

2. **좋아요 버튼 클릭 로직 (handleLike):**
   ```typescript
   const handleLike = () => {
     if (userAction === "like") {
       // 이미 좋아요 상태 → 취소
       setLikes(likes - 1);
       setUserAction(null);
     } else if (userAction === "dislike") {
       // 싫어요 상태 → 좋아요로 전환 (상호 배타적)
       setLikes(likes + 1);
       setDislikes(dislikes - 1);
       setUserAction("like");
     } else {
       // 아무 상태도 아님 → 좋아요 추가
       setLikes(likes + 1);
       setUserAction("like");
     }
   };
   ```

3. **싫어요 버튼 클릭 로직 (handleDislike):**
   ```typescript
   const handleDislike = () => {
     if (userAction === "dislike") {
       // 이미 싫어요 상태 → 취소
       setDislikes(dislikes - 1);
       setUserAction(null);
     } else if (userAction === "like") {
       // 좋아요 상태 → 싫어요로 전환 (상호 배타적)
       setDislikes(dislikes + 1);
       setLikes(likes - 1);
       setUserAction("dislike");
     } else {
       // 아무 상태도 아님 → 싫어요 추가
       setDislikes(dislikes + 1);
       setUserAction("dislike");
     }
   };
   ```

4. **아이콘 색상 변경:**
   - `userAction === "like"` → 좋아요 버튼에 `text-blue-500` 또는 `bg-blue-100` 클래스 적용
   - `userAction === "dislike"` → 싫어요 버튼에 `text-red-500` 또는 `bg-red-100` 클래스 적용
   - 그 외 → 기본 색상

**검증:**
- `npx tsc --noEmit` 실행
- Storybook 또는 테스트 페이지에서 버튼 클릭 동작 확인

---

### ✅ Task 4: CityCard에 LikeDislikeButtons 추가

**수정할 파일:**
- `components/cities/city-card.tsx`

**수정 내용:**
```typescript
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { City } from "@/lib/types";
import { LikeDislikeButtons } from "@/components/ui/like-dislike-buttons"; // 추가

interface CityCardProps {
  city: City;
}

export function CityCard({ city }: CityCardProps) {
  return (
    <Card className="overflow-hidden transition-all">
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* 이미지 및 뱃지 부분 유지 */}
      </div>

      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold">{city.name}</h3>
          <p className="text-sm text-muted-foreground">{city.nameEn}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              💵 ₩{(city.costOfLiving / 10000).toFixed(0)}만
            </span>
            <span className="flex items-center gap-1">
              📡 {city.internetSpeed}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              🌡️ {city.currentWeather.temp}°C
            </span>
            <span>
              💨 {city.airQuality.level}
            </span>
          </div>

          {/* 좋아요/싫어요 버튼 추가 */}
          <div className="border-t pt-2">
            <LikeDislikeButtons
              initialLikes={city.likes}
              initialDislikes={city.dislikes}
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
1. LikeDislikeButtons import 추가
2. CardContent의 마지막 부분에 좋아요/싫어요 버튼 섹션 추가
3. border-t로 구분선 추가하여 시각적으로 구분

**검증:**
- `npx tsc --noEmit` 실행
- 브라우저에서 도시 카드에 좋아요/싫어요 버튼이 표시되는지 확인
- 버튼 클릭 시 숫자가 증감하는지 확인
- 상호 배타적으로 동작하는지 확인

---

### ✅ Task 5: PopularCities 제목 변경

**수정할 파일:**
- `components/home/popular-cities.tsx`

**수정 내용:**
```typescript
export function PopularCities() {
  const topCities = getTopCities(8);

  return (
    <section className="py-16">
      <div className="container">
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

**구체적인 수정:**
1. 라인 14의 "🔥 이번 달 인기 도시 TOP 10" → "도시 리스트"로 변경
2. 이모지 제거 (🔥 삭제)

**검증:**
- `npx tsc --noEmit` 실행
- 브라우저에서 제목이 "도시 리스트"로 표시되는지 확인

---

### ✅ Task 6: 최종 검증 및 테스트

**검증 체크리스트:**

1. **타입 체크:**
   - [ ] `npx tsc --noEmit` 통과

2. **린트 체크:**
   - [ ] `npm run lint` 통과 (또는 주요 오류 없음)

3. **기능 테스트:**
   - [ ] 좋아요 버튼이 정상적으로 표시되는지 확인
   - [ ] 싫어요 버튼이 정상적으로 표시되는지 확인
   - [ ] 좋아요 버튼 클릭 시 아이콘 색상이 변경되는지 확인
   - [ ] 싫어요 버튼 클릭 시 아이콘 색상이 변경되는지 확인
   - [ ] 좋아요 숫자가 올바르게 증감하는지 확인
   - [ ] 싫어요 숫자가 올바르게 증감하는지 확인
   - [ ] 좋아요 클릭 시 싫어요 상태가 해제되는지 확인 (상호 배타적)
   - [ ] 싫어요 클릭 시 좋아요 상태가 해제되는지 확인 (상호 배타적)
   - [ ] "도시 리스트" 제목이 정확히 표시되는지 확인

4. **UI/UX 확인:**
   - [ ] 버튼이 직관적으로 배치되었는지 확인
   - [ ] 활성화/비활성화 상태가 명확히 구분되는지 확인
   - [ ] 모바일 반응형이 정상 작동하는지 확인

5. **빌드 테스트:**
   - [ ] `npm run build` 실행하여 프로덕션 빌드 성공 확인

---

## Critical Files to Modify

### 수정할 파일:
1. `lib/types.ts` - City interface에 likes, dislikes 필드 추가
2. `lib/mock-data.ts` - 모든 도시에 likes, dislikes 초기값 추가
3. `components/home/popular-cities.tsx` - 제목 "도시 리스트"로 변경

### 생성할 파일:
1. `components/ui/like-dislike-buttons.tsx` - 좋아요/싫어요 버튼 컴포넌트

### 통합할 파일:
1. `components/cities/city-card.tsx` - LikeDislikeButtons 추가

---

## Implementation Steps (순서대로 진행)

1. **Task 1**: City 타입에 likes, dislikes 필드 추가
2. **Task 2**: Mock 데이터에 초기값 추가
3. **Task 3**: LikeDislikeButtons 컴포넌트 생성
4. **Task 4**: CityCard에 LikeDislikeButtons 추가
5. **Task 5**: PopularCities 제목 변경
6. **Task 6**: 최종 검증

**각 Task 완료 후:**
- `npx tsc --noEmit` 실행
- 문제가 있으면 즉시 수정
- SPEC.md의 해당 체크박스에 체크

---

## Notes

- **Phase 2에 정의된 내용만 구현**하며, Phase 3의 필터 기능은 구현하지 않습니다.
- **SOLID 원칙**을 지키며, LikeDislikeButtons 컴포넌트는 단일 책임만 가집니다.
- **복잡한 구현보다 간결한 구현**을 선택합니다 (useState 기반 클라이언트 상태 관리).
- **상호 배타적 처리**가 핵심이므로, 좋아요 클릭 시 싫어요가 자동 해제되도록 구현합니다.
- 서버 연동은 Phase 2에서 구현하지 않으므로, 페이지 새로고침 시 상태가 초기화됩니다 (정상 동작).
- 좋아요/싫어요 수는 각 카드별로 독립적으로 관리됩니다 (useState로 컴포넌트 레벨 상태).

---

## UI Design Guidelines

### 버튼 스타일:
- **기본 상태**: `variant="ghost"`, 회색 텍스트
- **좋아요 활성화**: `text-blue-500` 또는 `bg-blue-50 text-blue-600`
- **싫어요 활성화**: `text-red-500` 또는 `bg-red-50 text-red-600`

### 아이콘:
- 좋아요: 👍 (thumbs up emoji)
- 싫어요: 👎 (thumbs down emoji)

### 레이아웃:
- 도시 카드 내부에 border-t로 구분하여 배치
- 좋아요/싫어요 버튼을 가로로 나란히 배치
- 버튼 간격: `gap-2`

---

## Expected Behavior

### 시나리오 1: 좋아요 클릭
- **초기 상태**: userAction = null, likes = 100, dislikes = 10
- **좋아요 클릭**: userAction = "like", likes = 101, dislikes = 10
- **다시 좋아요 클릭**: userAction = null, likes = 100, dislikes = 10 (토글)

### 시나리오 2: 좋아요 → 싫어요 전환
- **초기 상태**: userAction = null, likes = 100, dislikes = 10
- **좋아요 클릭**: userAction = "like", likes = 101, dislikes = 10
- **싫어요 클릭**: userAction = "dislike", likes = 100, dislikes = 11 (상호 배타적)

### 시나리오 3: 싫어요 → 좋아요 전환
- **초기 상태**: userAction = null, likes = 100, dislikes = 10
- **싫어요 클릭**: userAction = "dislike", likes = 100, dislikes = 11
- **좋아요 클릭**: userAction = "like", likes = 101, dislikes = 10 (상호 배타적)

---

## Performance Considerations

- React의 useState 사용으로 컴포넌트 레벨 상태 관리 (간단하고 효율적)
- 각 CityCard가 독립적으로 상태를 관리하므로 리렌더링 최소화
- 버튼 클릭 시 해당 카드만 리렌더링됨

---

## Future Enhancements (Phase 2 이후)

Phase 2에서는 구현하지 않지만, 향후 추가 가능한 기능:
- 서버 연동으로 좋아요/싫어요 영구 저장
- 사용자별 좋아요/싫어요 히스토리 관리
- 좋아요 수 기준 정렬 기능 (Phase 4에서 구현 예정)
- 애니메이션 효과 추가
