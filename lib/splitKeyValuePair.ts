/**
 * Parses a key-value pair from a string.
 * @param entry The string to parse.
 * @returns A tuple containing the key and value.
 */
export function splitKeyValuePair(entry: string): { key: string, value: string } {
    if (!entry.includes('=')) return { key: entry, value: '' };
    const [key, ...values] = entry.split('=');

    return {
        key,
        value: values.join('=')
    }
}