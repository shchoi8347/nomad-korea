import { HeroSection } from "@/components/home/hero-section";
import { StatsBanner } from "@/components/home/stats-banner";
import { PopularCities } from "@/components/home/popular-cities";
import { CategorySection } from "@/components/home/category-section";
import { SeasonalSection } from "@/components/home/seasonal-section";
import { RecentReviews } from "@/components/home/recent-reviews";
import { CommunityActivity } from "@/components/home/community-activity";
import { CTASection } from "@/components/home/cta-section";
import { NewsletterSection } from "@/components/home/newsletter-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsBanner />
      <PopularCities />
      <CategorySection />
      <SeasonalSection />
      <RecentReviews />
      <CommunityActivity />
      <CTASection />
      <NewsletterSection />
    </>
  );
}
