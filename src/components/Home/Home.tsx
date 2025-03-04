import Layout from '@/components/Home/HomeLayout';
import HeroSection from '@/components/Home/HeroSection';
import CategoriesSection from '@/components/Home/CategoriesSection';
import FeaturedSection from '@/components/Home/FeaturedSection';
import TestimonialsSection from '@/components/Home/TestimonialsSection';
import CTASection from '@/components/Home/CTASection';

const Home = () => {
    return (
        <Layout>
            <HeroSection />
            <CategoriesSection />
            <FeaturedSection />
            <TestimonialsSection />
            <CTASection />
        </Layout>
    );
};

export default Home;
