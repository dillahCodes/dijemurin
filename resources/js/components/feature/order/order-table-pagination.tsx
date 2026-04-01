import { usePage } from '@inertiajs/react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { usePagination } from '@/hooks/feature/order/use-pagination';
import type { OrderPageProps } from './order-data-section';

export function OrderTablePagination() {
    const { orders } = usePage<OrderPageProps>().props;
    const { paginationItems, currentPage, lastPage } = usePagination(orders);

    return (
        <Pagination>
            <PaginationContent className="w-fit flex-wrap justify-center">
                <PaginationItem>
                    <PaginationLink isActive href="?page=1" className="w-fit px-2">
                        First
                    </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                    <PaginationLink href={`?page=${currentPage > 1 ? currentPage - 1 : 1}`} isActive className="w-fit px-2">
                        Previous
                    </PaginationLink>
                </PaginationItem>

                {paginationItems.map((page, index) => (
                    <PaginationItem key={index}>
                        <PaginationLink isActive={page === currentPage} href={`?page=${page}`}>
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationLink
                        isActive
                        href={`?page=${currentPage < lastPage ? currentPage + 1 : lastPage}`}
                        className="w-fit px-2"
                    >
                        Next
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href={`?page=${lastPage}`} isActive className="w-fit px-2">
                        Last
                    </PaginationLink>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
