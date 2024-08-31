export interface XY { x: number, y: number }
export interface DOMAIN { min: number, max: number, axis: string }
export interface RANGE { min: number, max: number, step: number }
export type PARSER_VALUE = number | string | boolean | XY | DOMAIN | RANGE;

export type PARSER_VALUES = PARSER_VALUE | PARSER_VALUE[]
export type PARSER_PARAMETERS = Record<
    string, {
        value: PARSER_VALUES;
        options: PARSER_VALUES[];
    }>


export interface PARSER {
    name: string,
    key: string,
    values: PARSER_VALUES[],
    parameters: PARSER_PARAMETERS
}