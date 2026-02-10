import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GuidePage() {
  const guides = [
    {
      icon: "📋",
      title: "비자 & 체류",
      description: "외국인 등록, D-10 비자 등 완벽 가이드",
    },
    {
      icon: "☕",
      title: "카페 작업 팁",
      description: "와이파이 속도 측정, 콘센트 확인 방법",
    },
    {
      icon: "🏠",
      title: "숙소 찾기",
      description: "월세, 에어비앤비, 게스트하우스 비교",
    },
    {
      icon: "📱",
      title: "필수 앱 10가지",
      description: "배달, 교통, 결제, 은행 등 필수 앱",
    },
    {
      icon: "🏥",
      title: "건강보험",
      description: "의료보험 가입 방법, 병원 이용 가이드",
    },
    {
      icon: "💰",
      title: "예산 계획",
      description: "도시별 생활비, 예산 계산기 제공",
    },
  ];

  return (
    <div className="container py-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold">📚 노마드 생활 가이드</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          한국에서 디지털 노마드로 살아가는 방법
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide, index) => (
          <Card key={index} className="transition-all hover:shadow-lg">
            <CardHeader>
              <div className="mb-2 text-4xl">{guide.icon}</div>
              <CardTitle>{guide.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{guide.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
