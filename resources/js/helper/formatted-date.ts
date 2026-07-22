export function formatDate(isoDateString: string, showTime: boolean = false): string {
    if (!isoDateString) {
        return '-';
    }

    try {
        const date = new Date(isoDateString);

        return new Intl.DateTimeFormat('id-ID', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            ...(showTime ? { hour: '2-digit', minute: '2-digit' } : {}),
        }).format(date);
    } catch {
        return isoDateString;
    }
}

export function formatTime(isoDateString: string): string {
    if (!isoDateString) {
        return '';
    }

    try {
        const date = new Date(isoDateString);

        return new Intl.DateTimeFormat('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    } catch {
        return '';
    }
}
