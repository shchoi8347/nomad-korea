import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export function CTASection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
      <div className="container">
        <Card className="mx-auto max-w-3xl border-2">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold">🚀 지금 바로 시작해보세요!</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              무료 회원가입하고 나만의 노마드 여정을 기록하세요
            </p>

            <div className="mt-8 flex gap-2">
              <Input
                type="email"
                placeholder="✉️ 이메일 주소 입력..."
                className="h-12"
              />
              <Button size="lg" className="h-12 px-8">
                무료 가입하기
              </Button>
            </div>

            <div className="mt-6">
              <p className="mb-4 text-sm text-muted-foreground">
                또는 소셜 로그인:
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" size="lg">
                  카카오
                </Button>
                <Button variant="outline" size="lg">
                  네이버
                </Button>
                <Button variant="outline" size="lg">
                  구글
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
