import { SearchBar } from "@/components/layout/search-bar";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-blue-50 to-white py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            🌏 대한민국에서 살기 좋은 도시
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            디지털 노마드를 위한 완벽한 한국 도시 가이드
          </p>
          <p className="mt-2 text-base text-muted-foreground">
            실시간 데이터로 확인하는 생활비, 인터넷 속도, 카페 문화
          </p>

          <div className="mt-10 flex justify-center">
            <SearchBar />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button variant="outline" size="lg">
              💵 저렴한 곳
            </Button>
            <Button variant="outline" size="lg">
              📡 빠른 인터넷
            </Button>
            <Button variant="outline" size="lg">
              🌊 해변
            </Button>
            <Button variant="outline" size="lg">
              ⛰️ 산
            </Button>
          </div>

          <div className="mt-12">
            <Button variant="ghost" size="lg">
              ⬇️ 인기 도시 보러가기
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
