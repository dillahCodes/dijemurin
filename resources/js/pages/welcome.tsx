import { AnalyticsShowcase } from '@/components/feature/landing/analytics-showcase';
import { BentoFeatures } from '@/components/feature/landing/bento-features';
import { CTASection } from '@/components/feature/landing/cta-section';
import { FAQSection } from '@/components/feature/landing/faq-section';
import { HeroSection } from '@/components/feature/landing/hero-section';
import { LandingFooter } from '@/components/feature/landing/landing-footer';
import { LandingHeader } from '@/components/feature/landing/landing-header';
import { Head } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Dijemurin.id - Digitalisasi Operasional Laundry Modern">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700,800" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-[#FCF8FA] font-sans text-zinc-900 selection:bg-zinc-950 selection:text-white dark:bg-zinc-950 dark:text-zinc-100">
                <LandingHeader />

                <main>
                    <HeroSection />
                    <BentoFeatures />
                    <AnalyticsShowcase />
                    <FAQSection />
                    <CTASection />
                </main>

                <LandingFooter />
            </div>
        </>
    );
}
