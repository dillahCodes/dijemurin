import { getPaginationPages } from '@/helper/get-pagination-pages';

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

export interface PaginationLinks {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
}

export interface LaravelPaginator<T = unknown> {
    data: T[];
    links: PaginationLinks;
    meta: PaginationMeta;
}

export function usePagination(dataWithPagination: LaravelPaginator) {
    const { meta } = dataWithPagination;
    const { current_page: currentPage, per_page: perPage, total: totalData, last_page: lastPage } = meta;

    const paginationItems = getPaginationPages({ currentPage, perPage, totalData, mode: 'desktop' });

    return {
        paginationItems,
        currentPage,
        perPage,
        totalData,
        lastPage,
    };
}
