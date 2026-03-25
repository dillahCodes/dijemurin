import { router } from '@inertiajs/react';
import { SearchX, X } from 'lucide-react';
import { Activity, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Service } from '@/types/feature/layanan';

interface ServiceCardProps {
    id: number;
    title: string;
    description: string;
}

function ServiceHeader() {
    return (
        <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
                Daftar Layanan
            </h1>
            <p className="text-muted-foreground">
                Pilih layanan yang ingin Anda pesan.
            </p>
        </div>
    );
}

interface SearchProps {
    value: string;
}

function ServiceSearch({ value }: SearchProps) {
    const [search, setSearch] = useState(value);
    const options = { preserveState: true, replace: true };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get('/layanan', { search: search || undefined }, options);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleClear = () => {
        setSearch('');
        router.get('/layanan', {}, options);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex max-w-2xl items-center gap-3"
        >
            <Input
                type="text"
                placeholder="Cari layanan..."
                name="search"
                value={search}
                onChange={handleChange}
            />
            <div className="flex items-center gap-3">
                <Activity mode={search ? 'visible' : 'hidden'}>
                    <Button
                        variant="ghost"
                        type="button"
                        onClick={handleClear}
                        className="cursor-pointer"
                    >
                        <X size={16} />
                    </Button>
                </Activity>
                <Button type="submit" className="cursor-pointer">
                    Cari
                </Button>
            </div>
        </form>
    );
}

function ServiceCard({ id, title, description }: ServiceCardProps) {
    const handleNavigate = () => router.visit(`/layanan/${id}`);

    return (
        <Card
            onClick={handleNavigate}
            className={cn(
                'group relative flex w-full cursor-pointer overflow-hidden border-sidebar-border/70 p-4! py-6! shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-sidebar-border',
            )}
        >
            <div className="absolute -top-8 -right-8 size-32 rounded-full bg-primary/10 opacity-50 blur-3xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-70" />
            <div className="absolute bottom-0 left-0 h-1 w-0 flex-none bg-primary transition-all duration-500 ease-out group-hover:w-full" />

            <CardHeader className="p-3!">
                <CardTitle className="line-clamp-1">{title}</CardTitle>
                <CardDescription className="line-clamp-1">
                    {description}
                </CardDescription>
            </CardHeader>
        </Card>
    );
}

interface ServiceEmptyProps {
    search: string;
}

function ServiceEmpty({ search }: ServiceEmptyProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl py-16 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                <SearchX className="size-7 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-foreground">
                    Layanan tidak ditemukan
                </p>
                <Activity mode={search ? 'visible' : 'hidden'}>
                    <p className="text-xs text-muted-foreground">
                        Tidak ada layanan yang cocok dengan{' '}
                        <span className="font-medium text-foreground">
                            "{search}"
                        </span>
                    </p>
                </Activity>

                <Activity mode={search ? 'hidden' : 'visible'}>
                    <p className="text-xs text-muted-foreground">
                        Belum ada layanan yang tersedia saat ini.
                    </p>
                </Activity>
            </div>
        </div>
    );
}

// 3. Main Component
interface Props {
    services: Service[];
    filters: { search: string };
}

export function ServiceSection({ services, filters = { search: '' } }: Props) {
    return (
        <div className="flex flex-col gap-6">
            <ServiceHeader />
            <ServiceSearch value={filters.search} />

            <Activity mode={!services.length ? 'visible' : 'hidden'}>
                <ServiceEmpty search={filters.search} />
            </Activity>

            <Activity mode={services.length ? 'visible' : 'hidden'}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                    {services.map((service) => (
                        <ServiceCard
                            key={service.id}
                            id={service.id}
                            title={service.name}
                            description={service.description}
                        />
                    ))}
                </div>
            </Activity>
        </div>
    );
}
