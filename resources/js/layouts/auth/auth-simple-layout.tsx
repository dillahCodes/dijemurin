import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/layout/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

function AuthHeader({ title, description }: { title: string; description: string }) {
    return (
        <div className="mb-8 flex flex-col items-center gap-5">
            <Link href={home()} className="group flex flex-col items-center gap-3 font-medium outline-none">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 shadow-sm ring-1 ring-primary/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:ring-primary/40 group-focus-visible:ring-primary">
                    <AppLogoIcon className="size-8 fill-current text-primary dark:text-primary" />
                </div>
                <span className="sr-only">{title}</span>
            </Link>

            <div className="space-y-1.5 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-linear-to-b from-background to-muted/30 p-6 md:p-10">
            {/* Background Decoration */}
            <div className="pointer-events-none absolute inset-0 -z-10 flex w-full justify-center">
                <div className="absolute top-[-10%] h-[60vh] w-full max-w-5xl rounded-full bg-primary/5 blur-[120px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-md animate-in duration-500 fade-in slide-in-from-bottom-4">
                <div className="rounded-3xl border border-border/50 bg-card px-6 py-10 text-card-foreground shadow-2xl shadow-primary/5 backdrop-blur-xl sm:px-10">
                    <AuthHeader title={title || ''} description={description || ''} />
                    {children}
                </div>
            </div>

            <div className="mt-10 w-full max-w-sm text-center text-xs font-medium text-muted-foreground/60">
                &copy; {new Date().getFullYear()} Jemurin.id — Seluruh hak cipta dilindungi.
            </div>
        </div>
    );
}
