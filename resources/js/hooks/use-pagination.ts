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

    const safeLastPage = Math.max(lastPage ?? 1, 1);

    const isFirstPage = currentPage <= 1;
    const isLastPage = currentPage >= safeLastPage;

    const canGoFirst = !isFirstPage;
    const canGoPrevious = !isFirstPage;
    const canGoNext = !isLastPage;
    const canGoLast = !isLastPage;

    const handleGoToFirstPage = () => {
        if (!canGoFirst) {
            return;
        }

        navigateWithReload(1);
    };

    const handleGoToLastPage = () => {
        if (!canGoLast) {
            return;
        }

        navigateWithReload(safeLastPage);
    };

    const handleGoToPreviousPage = () => {
        if (!canGoPrevious) {
            return;
        }

        navigateWithReload(currentPage - 1);
    };

    const handleGoToNextPage = () => {
        if (!canGoNext) {
            return;
        }

        navigateWithReload(currentPage + 1);
    };

    const handleNavigateToPage = (page: number) => () => {
        if (page === currentPage) {
            return;
        }

        navigateWithReload(page);
    };

    return {
        paginationItems,
        currentPage,
        perPage,
        totalData,
        lastPage: safeLastPage,
        isFirstPage,
        isLastPage,
        canGoFirst,
        canGoPrevious,
        canGoNext,
        canGoLast,
        handleNavigate: {
            handleGoToFirstPage,
            handleGoToLastPage,
            handleGoToPreviousPage,
            handleGoToNextPage,
            handleNavigateToPage,
        },
    };
}
