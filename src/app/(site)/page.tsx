import Hero from "@/components/home/Hero";
import FeaturedServices from "@/components/home/FeaturedServices";
import Categories from "@/components/home/Categories";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedServices />
      <Categories />
      <WhyChooseUs />
      <Testimonials />
    </>
  );
}