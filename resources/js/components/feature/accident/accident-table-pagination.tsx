import { usePage } from '@inertiajs/react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { usePagination } from '@/hooks/use-pagination';
import type { AccidentPageProps } from './accident-data-section';

export function AccidentTablePagination() {
    const { accidents } = usePage<AccidentPageProps>().props;
    const { paginationItems, currentPage, canGoFirst, canGoPrevious, canGoNext, canGoLast, handleNavigate } =
        usePagination(accidents);

    if (!accidents.data.length) {
        return null;
    }

    return (
        <Pagination>
            <PaginationContent className="w-fit flex-wrap justify-center">
                <PaginationItem>
                    <PaginationLink
                        onClick={handleNavigate.handleGoToFirstPage}
                        disabled={!canGoFirst}
                        className="w-fit cursor-pointer px-2"
                    >
                        First
                    </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                    <PaginationLink
                        onClick={handleNavigate.handleGoToPreviousPage}
                        disabled={!canGoPrevious}
                        className="w-fit cursor-pointer px-2"
                    >
                        Previous
                    </PaginationLink>
                </PaginationItem>

                {paginationItems.map((page, index) => (
                    <PaginationItem key={index}>
                        <PaginationLink
                            isActive={page === currentPage}
                            onClick={handleNavigate.handleNavigateToPage(page)}
                            className="cursor-pointer"
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationLink
                        onClick={handleNavigate.handleGoToNextPage}
                        disabled={!canGoNext}
                        className="w-fit cursor-pointer px-2"
                    >
                        Next
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink
                        onClick={handleNavigate.handleGoToLastPage}
                        disabled={!canGoLast}
                        className="w-fit cursor-pointer px-2"
                    >
                        Last
                    </PaginationLink>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
