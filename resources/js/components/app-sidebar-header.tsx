import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { ShoppingCart } from 'lucide-react';
import { Avatar, AvatarBadge, AvatarFallback } from './ui/avatar';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <Avatar className="size-10">
                <AvatarFallback className="flex items-center justify-center">
                    <ShoppingCart className="size-5" />
                </AvatarFallback>
                <AvatarBadge className="top-0! size-4! bg-destructive text-sm">6</AvatarBadge>
            </Avatar>
        </header>
    );
}
