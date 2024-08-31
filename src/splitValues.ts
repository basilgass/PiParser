/**
 * Extracts the value from a string.
 * @param value string to extract the value from.
 * @returns 
 */
export function splitValues(value: string, splitter: string): string[] {
    // Split the value by the splitter.
    // Handle the case where the splitter is escaped => do not split.
    // Replace all escaped splitters with "ESCAPESPLITTER".
    const escapedValue = value
        .replace(new RegExp(`\\\\${splitter}`, 'g'), 'ESCAPESPLITTER')

    // Split the value by the splitter.
    // Replace all "ESCAPESPLITTER" with the splitter.
    return escapedValue
        .split(splitter)
        .map(v => v.replace('ESCAPESPLITTER', splitter))
}