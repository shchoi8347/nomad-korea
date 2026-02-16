"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CityCard } from "@/components/cities/city-card";
import { getTopCities } from "@/lib/mock-data";
import { FilterSection } from "@/components/home/filter-section";
import { SearchBar } from "@/components/home/search-bar";
import { SortDropdown, SortOption } from "@/components/home/sort-dropdown";
import { Button } from "@/components/ui/button";
import type { CityLikeState, BudgetRange, Region, Environment, BestSeason } from "@/lib/types";

export function PopularCities() {
  const initialCities = getTopCities(10);
  const searchParams = useSearchParams();

  // 검색 상태 관리
  const [searchQuery, setSearchQuery] = useState("");

  // 정렬 상태 관리
  const [sortBy, setSortBy] = useState<SortOption>("likes-desc");

  // 필터 상태 관리
  const [selectedBudget, setSelectedBudget] = useState<BudgetRange[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<Region[]>([]);
  const [selectedEnvironments, setSelectedEnvironments] = useState<Environment[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<BestSeason[]>([]);

  // URL 쿼리 파라미터에서 필터 초기화
  useEffect(() => {
    const budget = searchParams.get("budget");
    const region = searchParams.get("region");
    const environment = searchParams.get("environment");
    const season = searchParams.get("season");

    if (budget && (budget === "100만원 이하" || budget === "100~200만원" || budget === "200만원 이상")) {
      setSelectedBudget([budget as BudgetRange]);
    }
    if (region && ["수도권", "경상도", "전라도", "강원도", "제주도", "충청도"].includes(region)) {
      setSelectedRegions([region as Region]);
    }
    if (environment && ["자연친화", "도심선호", "카페작업", "코워킹 필수"].includes(environment)) {
      setSelectedEnvironments([environment as Environment]);
    }
    if (season && ["봄", "여름", "가을", "겨울"].includes(season)) {
      setSelectedSeasons([season as BestSeason]);
    }
  }, [searchParams]);

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
    <section id="cities" className="py-16">
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
