"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export function SeasonalSection() {
  const seasons = [
    {
      id: "summer",
      label: "☀️ 여름",
      description: "6-8월 - 시원한 바다와 산을 찾아서",
      cities: [
        { name: "강릉", temp: "25°C", cost: "₩1.2M" },
        { name: "속초", temp: "23°C", cost: "₩1.0M" },
        { name: "제주", temp: "28°C", cost: "₩1.8M" },
        { name: "부산", temp: "27°C", cost: "₩1.5M" },
      ],
    },
    {
      id: "fall",
      label: "🍂 가을",
      description: "9-11월 - 단풍과 선선한 날씨",
      cities: [
        { name: "경주", temp: "18°C", cost: "₩850K" },
        { name: "전주", temp: "17°C", cost: "₩900K" },
        { name: "속초", temp: "16°C", cost: "₩1.0M" },
        { name: "부산", temp: "20°C", cost: "₩1.5M" },
      ],
    },
    {
      id: "spring",
      label: "🌸 봄",
      description: "3-5월 - 벚꽃과 따뜻한 햇살",
      cities: [
        { name: "제주", temp: "18°C", cost: "₩1.8M" },
        { name: "전주", temp: "16°C", cost: "₩900K" },
        { name: "경주", temp: "17°C", cost: "₩850K" },
        { name: "강릉", temp: "15°C", cost: "₩1.2M" },
      ],
    },
    {
      id: "winter",
      label: "❄️ 겨울",
      description: "12-2월 - 따뜻한 실내와 카페",
      cities: [
        { name: "부산", temp: "8°C", cost: "₩1.5M" },
        { name: "제주", temp: "10°C", cost: "₩1.8M" },
        { name: "서울", temp: "2°C", cost: "₩2.5M" },
        { name: "대구", temp: "5°C", cost: "₩1.1M" },
      ],
    },
  ];

  return (
    <section className="py-16">
      <div className="container">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold">🗓️ 계절별 추천 도시</h2>
          <p className="mt-2 text-muted-foreground">
            언제 방문하느냐에 따라 최적의 도시가 달라집니다
          </p>
        </div>

        <Tabs defaultValue="summer" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {seasons.map((season) => (
              <TabsTrigger key={season.id} value={season.id}>
                {season.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {seasons.map((season) => (
            <TabsContent key={season.id} value={season.id} className="mt-6">
              <p className="mb-6 text-center text-muted-foreground">
                {season.description}
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {season.cities.map((city, index) => (
                  <Card key={index}>
                    <CardContent className="p-6 text-center">
                      <h3 className="mb-2 text-xl font-semibold">{city.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        🌡️ {city.temp}
                      </p>
                      <p className="mt-1 text-sm font-medium">💵 {city.cost}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
