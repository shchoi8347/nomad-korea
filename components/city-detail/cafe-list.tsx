import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cafe } from "@/lib/types";

interface CafeListProps {
  cafes: Cafe[];
}

export function CafeList({ cafes }: CafeListProps) {
  if (cafes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        등록된 카페 정보가 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {cafes.map((cafe) => (
        <Card key={cafe.id}>
          <CardContent className="p-6">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{cafe.name}</h3>
                <p className="text-sm text-muted-foreground">{cafe.address}</p>
              </div>
              <div className="flex items-center gap-1">
                <span>⭐</span>
                <span className="font-medium">{cafe.rating.toFixed(1)}</span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Wi-Fi 속도</span>
                <span className="font-medium">{cafe.wifiSpeed} Mbps</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">콘센트</span>
                <span>{cafe.hasPowerOutlet ? "✅ 있음" : "❌ 없음"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">조용함</span>
                <span>
                  {"🔇".repeat(Math.floor(5 - cafe.noiseLevel))}
                  {cafe.noiseLevel.toFixed(1)}/5
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">가격대</span>
                <span>{"₩".repeat(cafe.priceRange)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
