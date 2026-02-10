import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CommunityActivity() {
  return (
    <section className="py-16">
      <div className="container">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold">🎪 커뮤니티 활동</h2>
          <p className="mt-2 text-muted-foreground">
            함께 모여서 교류하고 정보를 공유하세요
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🛩️ 지금 어디계신가요?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>제주</span>
                  <span className="font-bold">45명 🔥</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>강릉</span>
                  <span className="font-bold">23명</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>서울</span>
                  <span className="font-bold">18명</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>부산</span>
                  <span className="font-bold">15명</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>전주</span>
                  <span className="font-bold">8명</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                👥 이번 주 밋업
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="font-medium">📅 2/15 (토)</div>
                  <div className="text-sm text-muted-foreground">
                    📍 제주 노마드 모임
                  </div>
                  <div className="text-sm text-muted-foreground">
                    👥 12명 참석 예정
                  </div>
                </div>
                <div>
                  <div className="font-medium">📅 2/16 (일)</div>
                  <div className="text-sm text-muted-foreground">
                    📍 강릉 카페 투어
                  </div>
                  <div className="text-sm text-muted-foreground">
                    👥 8명 참석 예정
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💡 인기 게시글
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="font-medium">제주 카페 추천 BEST 10</div>
                  <div className="text-sm text-muted-foreground">
                    👍 156 💬 42
                  </div>
                </div>
                <div>
                  <div className="font-medium">강릉 한달살기 후기 공유</div>
                  <div className="text-sm text-muted-foreground">
                    👍 89 💬 23
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
