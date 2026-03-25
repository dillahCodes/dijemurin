import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Service } from '@/types/feature/layanan';

// 1. Local Types
interface ServiceCardProps {
    title: string;
    description: string;
}

// 2. Sub-components
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

function ServiceCard({ title, description }: ServiceCardProps) {
    return (
        <Card
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

// 3. Main Component
interface Props {
    services: Service[];
}

export function ServiceSection({ services }: Props) {
    return (
        <div className="flex flex-col gap-6">
            <ServiceHeader />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                {services.map((service) => (
                    <ServiceCard
                        key={service.id}
                        title={service.name}
                        description={service.description}
                    />
                ))}
            </div>
        </div>
    );
}
