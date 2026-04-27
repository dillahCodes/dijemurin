import { usePage } from '@inertiajs/react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { usePagination } from '@/hooks/use-pagination';
import type { ServicePageProps } from './service-section';

export function ServicePagination() {
    const { services } = usePage<ServicePageProps>().props;
    const { paginationItems, currentPage, handleNavigate } = usePagination(services);

    if (!services.data.length) {
        return null;
    }

    return (
        <Pagination>
            <PaginationContent className="w-fit flex-wrap justify-center">
                <PaginationItem>
                    <PaginationLink isActive onClick={handleNavigate.handleGoToFirstPage} className="w-fit px-2">
                        First
                    </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                    <PaginationLink isActive onClick={handleNavigate.handleGoToPreviousPage} className="w-fit px-2">
                        Previous
                    </PaginationLink>
                </PaginationItem>

                {paginationItems.map((page, index) => (
                    <PaginationItem key={index}>
                        <PaginationLink isActive={page === currentPage} onClick={handleNavigate.handleNavigateToPage(page)}>
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationLink isActive onClick={handleNavigate.handleGoToNextPage} className="w-fit px-2">
                        Next
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink isActive onClick={handleNavigate.handleGoToLastPage} className="w-fit px-2">
                        Last
                    </PaginationLink>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
