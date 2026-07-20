import { OrderCheckerForm } from './order-checker-form';

export function HeroSection() {
    return (
        <section className="relative px-4 pt-28 pb-16 sm:px-6 md:pt-32" id="lacak">
            <div className="mx-auto max-w-6xl">
                <div className="relative flex min-h-145 items-center justify-center overflow-hidden rounded-4xl px-6 py-16 text-center shadow-2xl">
                    {/* Background Image & Overlay */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/images/hero-laundry.webp"
                            alt="Modern Laundry Facility"
                            className="h-full w-full object-cover brightness-[0.35] grayscale"
                        />
                        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/10 to-black/70" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 max-w-4xl space-y-8">
                        <h1 className="font-sans text-4xl leading-[1.1] font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                            Digitalisasi Operasional Laundry <br className="hidden sm:block" />
                            dari Hulu ke Hilir
                        </h1>

                        <p className="mx-auto max-w-2xl font-sans text-base font-normal text-zinc-200 opacity-90 sm:text-lg md:text-xl">
                            Sistem ERP multi-outlet terintegrasi untuk kasir, operator, dan manajemen yang lebih transparan,
                            efisien, dan profesional.
                        </p>

                        {/* Floating Order Tracking Bar */}
                        <div className="pt-6">
                            <OrderCheckerForm />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
