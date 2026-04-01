export function formatDate(isoDateString: string): string {
    if (!isoDateString) {
return '-';
}

    try {
        const date = new Date(isoDateString);

        return new Intl.DateTimeFormat('id-ID', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        }).format(date);
    } catch {
        return isoDateString;
    }
}
