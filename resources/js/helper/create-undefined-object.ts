export function createUndefinedObject<T extends readonly string[]>(keys: T) {
    return Object.fromEntries(keys.map((key) => [key, undefined])) as Record<T[number], undefined>;
}
