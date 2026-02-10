"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FilterSidebar() {
  const [costRange, setCostRange] = useState([50, 250]);
  const [internetSpeed, setInternetSpeed] = useState([50]);

  const regions = ["서울", "경기", "강원", "제주", "부산", "경상", "전라", "충청"];
  const characteristics = ["해변", "산", "도심", "전원"];

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>필터</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="mb-3 font-medium">지역별</h4>
          <div className="grid grid-cols-2 gap-2">
            {regions.map((region) => (
              <Button key={region} variant="outline" size="sm">
                {region}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="mb-3 font-medium">
            생활비 (₩{costRange[0]}만 - ₩{costRange[1]}만)
          </h4>
          <Slider
            min={50}
            max={250}
            step={10}
            value={costRange}
            onValueChange={setCostRange}
            className="mt-2"
          />
        </div>

        <Separator />

        <div>
          <h4 className="mb-3 font-medium">
            인터넷 속도 (최소 {internetSpeed[0]} Mbps)
          </h4>
          <Slider
            min={50}
            max={200}
            step={10}
            value={internetSpeed}
            onValueChange={setInternetSpeed}
            className="mt-2"
          />
        </div>

        <Separator />

        <div>
          <h4 className="mb-3 font-medium">특성별</h4>
          <div className="grid grid-cols-2 gap-2">
            {characteristics.map((char) => (
              <Button key={char} variant="outline" size="sm">
                {char}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        <Button variant="secondary" className="w-full">
          초기화
        </Button>
      </CardContent>
    </Card>
  );
}
