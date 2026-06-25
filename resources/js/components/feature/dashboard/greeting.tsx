import { usePage } from '@inertiajs/react';

function getGreeting(): string {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
        return 'Selamat Pagi';
    }

    if (hour >= 12 && hour < 15) {
        return 'Selamat Siang';
    }

    if (hour >= 15 && hour < 19) {
        return 'Selamat Sore';
    }

    return 'Selamat Malam';
}

export function Greeting() {
    const { auth } = usePage().props;

    return (
        <div className="rounded-xl border border-sidebar-border bg-sidebar px-5 py-4">
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">{getGreeting()}</p>
            <h1 className="mt-1 text-xl font-semibold text-foreground">{auth.user.name} 👋</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">Selamat datang kembali di dashboard.</p>
        </div>
    );
}
