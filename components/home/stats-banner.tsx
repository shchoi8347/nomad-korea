import { Card } from "@/components/ui/card";

export function StatsBanner() {
  const stats = [
    { icon: "🏙️", value: "50+", label: "등록도시" },
    { icon: "💬", value: "12,450", label: "리뷰" },
    { icon: "👥", value: "3,240", label: "활성회원" },
    { icon: "⭐", value: "4.5", label: "평균평점" },
  ];

  return (
    <section className="border-y bg-muted/40 py-12">
      <div className="container">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
