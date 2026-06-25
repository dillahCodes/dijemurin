export function hasEmptyStringObj<T extends Record<string, string | undefined>>(object: T): boolean {
    return Object.values(object).some((value) => value === undefined || value.trim() === '');
}
