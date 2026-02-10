import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export function NewsletterSection() {
  return (
    <section className="py-16">
      <div className="container">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold">📧 주간 노마드 뉴스레터 구독</h2>
            <p className="mt-2 text-muted-foreground">
              매주 금요일, 새로운 도시 정보와 노마드 팁을 이메일로 받아보세요
            </p>

            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span className="text-sm">이번 주 인기 도시 TOP 10</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span className="text-sm">신규 리뷰 & 추천 카페</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span className="text-sm">노마드 할인 정보</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span className="text-sm">커뮤니티 밋업 일정</span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Input type="email" placeholder="이메일 주소..." className="h-11" />
              <Button size="lg" className="h-11">
                구독하기
              </Button>
            </div>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              💌 이미 3,240명이 구독 중입니다!
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
