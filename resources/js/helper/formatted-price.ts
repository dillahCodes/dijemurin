export const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price);
};

export const parseRawPrice = (value: string): number => {
    const rawValue = value.replace(/\D/g, '');

    return rawValue === '' ? 0 : parseInt(rawValue, 10);
};
