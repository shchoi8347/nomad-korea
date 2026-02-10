import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CategorySection() {
  const categories = [
    {
      icon: "💰",
      title: "가성비 최고",
      description: "₩900K/월부터",
      cities: "전주, 춘천, 포항",
    },
    {
      icon: "📡",
      title: "인터넷 최고",
      description: "150Mbps 평균",
      cities: "서울, 부산, 대전",
    },
    {
      icon: "☕",
      title: "카페 천국",
      description: "150개+ 카페",
      cities: "제주, 강릉, 속초",
    },
    {
      icon: "🌊",
      title: "바다가 있는 곳",
      description: "해변 접근성 우수",
      cities: "부산, 강릉, 여수",
    },
    {
      icon: "⛰️",
      title: "산이 있는 곳",
      description: "자연 경관 최고",
      cities: "속초, 춘천, 안동",
    },
    {
      icon: "🏙️",
      title: "도심 라이프",
      description: "편의시설 완벽",
      cities: "서울, 부산, 대구",
    },
  ];

  return (
    <section className="bg-muted/40 py-16">
      <div className="container">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold">🎯 나에게 맞는 도시 찾기</h2>
          <p className="mt-2 text-muted-foreground">
            원하는 특성으로 도시를 찾아보세요
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Card key={index} className="group transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 text-5xl">{category.icon}</div>
                <h3 className="mb-2 text-xl font-semibold">{category.title}</h3>
                <p className="mb-3 text-sm text-muted-foreground">
                  {category.description}
                </p>
                <p className="mb-4 text-sm font-medium">🏆 {category.cities}</p>
                <Button variant="outline" className="w-full">
                  보러가기 →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
