import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { dashboard, login } from '@/routes';

export function LandingHeader() {
    const { auth } = usePage().props as unknown as { auth: { user: unknown | null } };
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className="fixed top-0 left-0 z-50 w-full px-4 py-4 transition-all duration-300 sm:px-6">
            <div
                className={`mx-auto flex max-w-6xl items-center justify-between rounded-full border px-5 py-2.5 transition-all duration-300 sm:px-6 sm:py-3 ${
                    scrolled
                        ? 'border-zinc-200/80 bg-white/95 shadow-md backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/95'
                        : 'border-zinc-200/60 bg-white/80 backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-950/80'
                }`}
            >
                <div className="flex items-center gap-8">
                    <Link
                        href="#"
                        className="font-sans text-xl font-extrabold tracking-tighter text-zinc-950 sm:text-2xl dark:text-white"
                    >
                        Dijemurin.id
                    </Link>
                    <nav className="hidden items-center gap-6 md:flex">
                        <a
                            href="#"
                            className="border-b-2 border-zinc-950 font-sans text-xs font-semibold tracking-wider text-zinc-950 uppercase dark:border-white dark:text-white"
                        >
                            Beranda
                        </a>
                        <a
                            href="#fitur"
                            className="font-sans text-xs font-medium tracking-wider text-zinc-600 uppercase transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                        >
                            Fitur
                        </a>
                        <a
                            href="#lacak"
                            className="font-sans text-xs font-medium tracking-wider text-zinc-600 uppercase transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                        >
                            Lacak
                        </a>
                        <a
                            href="#faq"
                            className="font-sans text-xs font-medium tracking-wider text-zinc-600 uppercase transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                        >
                            FAQ
                        </a>
                    </nav>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                    {auth?.user ? (
                        <Link
                            href={dashboard()}
                            className="rounded-full bg-zinc-950 px-5 py-2 font-sans text-xs font-bold tracking-wider text-white uppercase transition-all hover:scale-[0.98] hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={login()}
                                className="hidden font-sans text-xs font-semibold tracking-wider text-zinc-950 uppercase transition-opacity hover:opacity-75 sm:block dark:text-white"
                            >
                                Masuk
                            </Link>
                            <Link
                                href={login()}
                                className="rounded-full bg-zinc-950 px-5 py-2.5 font-sans text-xs font-bold tracking-wider text-white uppercase transition-transform hover:scale-[0.98] active:scale-95 dark:bg-white dark:text-zinc-950"
                            >
                                Coba Gratis
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
