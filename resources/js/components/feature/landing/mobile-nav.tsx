import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useMobileNav } from '@/hooks/feature/landing/use-mobile-nav';
import { useSmoothScroll } from '@/hooks/feature/landing/use-smooth-scroll';
import { dashboard, login } from '@/routes';
import { Link } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { Activity } from 'react';

interface MobileNavProps {
    user: unknown | null;
}

export function MobileNav({ user }: MobileNavProps) {
    const { open, setOpen, closeNav } = useMobileNav();
    const { scrollToSection } = useSmoothScroll();

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        scrollToSection(e, targetId, closeNav);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-950 md:hidden dark:bg-zinc-800 dark:text-white">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col w-80 p-6">
                <SheetHeader className="p-0 text-left">
                    <SheetTitle className="font-sans text-xl font-extrabold tracking-tighter text-zinc-950 dark:text-white">
                        Dijemurin.id
                    </SheetTitle>
                </SheetHeader>

                <nav className="mt-8 flex flex-col gap-5">
                    <a
                        href="#"
                        onClick={(e) => handleNavClick(e, '')}
                        className="font-sans text-sm font-semibold uppercase tracking-wider text-zinc-950 dark:text-white"
                    >
                        Beranda
                    </a>
                    <a
                        href="#fitur"
                        onClick={(e) => handleNavClick(e, '#fitur')}
                        className="font-sans text-sm font-medium uppercase tracking-wider text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                    >
                        Fitur
                    </a>
                    <a
                        href="#lacak"
                        onClick={(e) => handleNavClick(e, '#lacak')}
                        className="font-sans text-sm font-medium uppercase tracking-wider text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                    >
                        Lacak
                    </a>
                    <a
                        href="#faq"
                        onClick={(e) => handleNavClick(e, '#faq')}
                        className="font-sans text-sm font-medium uppercase tracking-wider text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                    >
                        FAQ
                    </a>
                </nav>

                <div className="mt-auto border-t border-zinc-200 pt-6 flex flex-col gap-3 dark:border-zinc-800">
                    <Activity mode={user ? 'visible' : 'hidden'}>
                        <Link
                            href={dashboard()}
                            onClick={closeNav}
                            className="w-full text-center rounded-full bg-zinc-950 py-3 font-sans text-xs font-bold uppercase tracking-wider text-white dark:bg-white dark:text-zinc-950"
                        >
                            Dashboard
                        </Link>
                    </Activity>

                    <Activity mode={user ? 'hidden' : 'visible'}>
                        <div className="flex flex-col gap-3">
                            <Link
                                href={login()}
                                onClick={closeNav}
                                className="w-full text-center rounded-full border border-zinc-300 py-3 font-sans text-xs font-semibold uppercase tracking-wider text-zinc-950 dark:border-zinc-700 dark:text-white"
                            >
                                Masuk
                            </Link>
                            <Link
                                href={login()}
                                onClick={closeNav}
                                className="w-full text-center rounded-full bg-zinc-950 py-3 font-sans text-xs font-bold uppercase tracking-wider text-white dark:bg-white dark:text-zinc-950"
                            >
                                Coba Gratis
                            </Link>
                        </div>
                    </Activity>
                </div>
            </SheetContent>
        </Sheet>
    );
}
