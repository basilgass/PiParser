import type { PARSER, PARSER_PARAMETERS } from "./PiParserTypes";
type STRING_CB = (line: string) => string;
export declare class PiParse {
    #private;
    constructor(config?: {
        formatter?: STRING_CB;
        splitter?: {
            main: string;
            entry: string;
            parameter: string;
        };
        keys?: string[];
    });
    get splitter(): {
        main: string;
        entry: string;
        parameter: string;
    };
    set splitter_main(value: string);
    set splitter_entry(value: string);
    set splitter_parameter(value: string);
    get formatter(): STRING_CB | undefined;
    set formatter(value: STRING_CB | undefined);
    get keys(): string[];
    set keys(value: string[]);
    parse(value: string): PARSER;
    parameters(value: string, keys?: string[]): PARSER_PARAMETERS;
}
export {};
//# sourceMappingURL=PiParse.d.ts.map