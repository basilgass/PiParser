export type XY = { x: number, y: number };
export type DOMAIN = { min: number, max: number, axis: string };
export type RANGE = { min: number, max: number, step: number };

export type PARSER_VALUE = number | string | boolean | XY | DOMAIN | RANGE;
/**
 * Converts a value to a PARSER_VALUE.
 * @param value The value to convert.
 * @returns The number.
 */
export function convertValue(value: string): PARSER_VALUE {
    // It's a simple toggle key: set it to true.
    if (value === '') return true;

    // The string is a number: convert it to a number.
    if (Number(value)) return parseFloat(value)

    // The string is a fraction : a/b
    // Detect with a regexp
    if (value.match(/^[-.\d]+\/[-.\d]+$/)) {
        const [a, b] = value.split('/').map(Number);
        return a / b
    }

    // The string is a XY pair: x;y
    // Detect with a regexp
    if (value.match(/^[-.\d]+;[-.\d]+$/)) {
        const [x, y] = value.split(';').map(Number);
        return { x, y }
    }

    // The string is a domain: 
    // min:max => min: number, max: number, axis: x
    // min:max:axis => min: number, max: number, axis: <x|y|z>
    // Detect with a regexp
    if (value.match(/^[-.\d]+:[-.\d]+(:[xy])?$/)) {
        const [v1, v2, axis] = value.split(':');

        const v1n = Number(v1);
        const v2n = Number(v2);

        return {
            min: Math.min(v1n, v2n),
            max: Math.max(v1n, v2n),
            axis: axis ?? 'x'
        };
    }

    // The string is a range:
    // min:max:step => min: number, max: number, step: number
    // Detect with a regexp
    if (value.match(/^[-.\d]+:[-.\d]+:[.\d]+$/)) {
        const [v1, v2, step] = value.split(':').map(Number);
        const v1n = Number(v1);
        const v2n = Number(v2);
        const stepn = Number(step);

        const dx = v2n - v1n;
        const minStep = dx / 100;

        return {
            min: Math.min(v1, v2),
            max: Math.max(v1, v2),
            step: Math.max(stepn, minStep)
        };
    }

    // It's a string
    return value
}