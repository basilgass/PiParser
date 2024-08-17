export type XY = { x: number, y: number };
export type DOMAIN = { min: number, max: number, axis: string };
export type RANGE = { min: number, max: number, step: number };
export type PARSER_VALUE = number | string | boolean | XY | DOMAIN | RANGE;

export type PARSER_VALUES = PARSER_VALUE | PARSER_VALUE[]
export type PARSER_PARAMETERS = Record<
    string, {
        value: PARSER_VALUES;
        options: PARSER_VALUES[];
    }>


export type PARSER = {
    name: string,
    key: string,
    values: PARSER_VALUES[],
    parameters: PARSER_PARAMETERS
}