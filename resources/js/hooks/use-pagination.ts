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

const navigateWithReload = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', page.toString());

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.location.href = newUrl;
};

export function usePagination(dataWithPagination: LaravelPaginator) {
    const { meta } = dataWithPagination;
    const { current_page: currentPage, per_page: perPage, total: totalData, last_page: lastPage } = meta;

    const paginationItems = getPaginationPages({ currentPage, perPage, totalData, mode: 'desktop' });

    const validNextPage = currentPage < lastPage ? currentPage + 1 : lastPage;
    const validPrevPage = currentPage > 1 ? currentPage - 1 : 1;

    const handleGoToFirstPage = () => navigateWithReload(1);
    const handleGoToLastPage = () => navigateWithReload(lastPage);
    const handleGoToPreviousPage = () => navigateWithReload(validPrevPage);
    const handleGoToNextPage = () => navigateWithReload(validNextPage);
    const handleNavigateToPage = (page: number) => () => navigateWithReload(page);

    return {
        paginationItems,
        currentPage,
        perPage,
        totalData,
        lastPage,
        handleNavigate: {
            handleGoToFirstPage,
            handleGoToLastPage,
            handleGoToPreviousPage,
            handleGoToNextPage,
            handleNavigateToPage,
        },
    };
}
