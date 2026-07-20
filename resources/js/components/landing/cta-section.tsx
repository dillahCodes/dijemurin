import { Link } from '@inertiajs/react';
import { login } from '@/routes';

export function CTASection() {
    return (
        <section className="relative overflow-hidden bg-zinc-950 px-4 py-20 sm:px-6 md:py-28 dark:bg-zinc-900">
            {/* Ambient light glow effect */}
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-3xl space-y-8 text-center">
                <h2 className="font-sans text-3xl leading-tight font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
                    Siap Tingkatkan Efisiensi Laundry Anda?
                </h2>

                <p className="mx-auto max-w-xl font-sans text-base text-zinc-400 sm:text-lg">
                    Bergabunglah dengan ratusan pengusaha laundry yang telah beralih ke manajemen digital yang transparan,
                    efisien, dan bebas pusing.
                </p>

                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <Link
                        href={login()}
                        className="rounded-full bg-white px-10 py-4 font-sans text-base font-black tracking-wider text-zinc-950 uppercase shadow-lg transition-all hover:scale-[0.98] hover:bg-zinc-100 active:scale-95"
                    >
                        Daftar Sekarang
                    </Link>
                    <a
                        href="#lacak"
                        className="rounded-full border border-white/30 px-10 py-4 font-sans text-base font-bold tracking-wider text-white uppercase transition-all hover:bg-white/10 active:scale-95"
                    >
                        Coba Lacak Pesanan
                    </a>
                </div>
            </div>
        </section>
    );
}
