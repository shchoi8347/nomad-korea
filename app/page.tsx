import { HeroSection } from "@/components/home/hero-section";
import { StatsBanner } from "@/components/home/stats-banner";
import { PopularCities } from "@/components/home/popular-cities";
import { CategorySection } from "@/components/home/category-section";
import { SeasonalSection } from "@/components/home/seasonal-section";
import { RecentReviews } from "@/components/home/recent-reviews";
import { CommunityActivity } from "@/components/home/community-activity";
import { CTASection } from "@/components/home/cta-section";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { getCities, getRecentReviews } from "@/lib/supabase/queries";

export default async function Home() {
  const [cities, recentReviews] = await Promise.all([
    getCities(),
    getRecentReviews(3),
  ]);

  return (
    <>
      <HeroSection />
      <StatsBanner />
      <PopularCities initialCities={cities} />
      <CategorySection />
      <SeasonalSection />
      <RecentReviews reviews={recentReviews} />
      <CommunityActivity />
      <CTASection />
      <NewsletterSection />
    </>
  );
}
