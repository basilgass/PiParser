import { convertValue } from "./convertValue"
import { splitValues } from "./splitValues";
import { splitKeyValuePair } from "./splitKeyValuePair";
import type { PARSER, PARSER_PARAMETERS } from "./PiParserTypes";

// Main function
type STRING_CB = (line: string) => string

export class PiParse {
    #formatter: STRING_CB | undefined;
    #MAIN_SPLITTER: string = '->';
    #ENTRY_SPLITTER: string = ',';
    #PARAMETER_SPLITTER: string = '/';
    #keys: string[] = [];

    constructor(config?: {
        formatter?: STRING_CB,
        splitter?: {
            main: string,
            entry: string,
            parameter: string
        },
        keys?: string[]
    }) {

        // Base config is given !
        if (config) {
            // Default key-code formatter
            this.#formatter = config.formatter ?? undefined;

            // Splitter configuration
            if (config.splitter?.main) {
                this.#MAIN_SPLITTER = config.splitter.main;
            }
            if (config.splitter?.entry) {
                this.#ENTRY_SPLITTER = config.splitter.entry;
            }
            if (config.splitter?.parameter) {
                this.#PARAMETER_SPLITTER = config.splitter.parameter;
            }

            // Keys
            if (config.keys) {
                this.#keys = config.keys;
            }
        }
    }

    get splitter() {
        return {
            main: this.#MAIN_SPLITTER,
            entry: this.#ENTRY_SPLITTER,
            parameter: this.#PARAMETER_SPLITTER
        }
    }

    set splitter_main(value: string) {
        this.#MAIN_SPLITTER = value;
    }
    set splitter_entry(value: string) {
        this.#ENTRY_SPLITTER = value;
    }
    set splitter_parameter(value: string) {
        this.#PARAMETER_SPLITTER = value;
    }

    get formatter(): STRING_CB | undefined {
        return this.#formatter;
    }
    set formatter(value: STRING_CB | undefined) {
        this.#formatter = value;
    }

    get keys() {
        return this.#keys;
    }
    set keys(value: string[]) {
        this.#keys = value;
    }

    parse(value: string): PARSER {

        // Split to the MAIN_SPLITTER
        // name=key <value>[,...<values>]-><key1>=<value>[\,...<values>],<key2>=<value>[\,...<values>]
        const [name_key_values_raw, parameters_values] = value.split(this.#MAIN_SPLITTER);

        const name_key_values = this.#formatter ? this.#formatter(name_key_values_raw) : name_key_values_raw.trim();

        const { name, key, values } = this.#handleNameKeyValues(name_key_values);

        const parameters: PARSER_PARAMETERS = this.#handleParametersAndOptions(parameters_values);

        return { name, key, values, parameters }
    }

    parameters(value: string, keys?: string[]): PARSER_PARAMETERS {
        return this.#handleParametersAndOptions(value, keys ?? this.#keys);
    }

    #handleNameKeyValues(name_key_values: string) {
        const [name_key, ...valuesSplitted] = name_key_values.split(' ');
        const [name, key] = name_key.split('=');
        const values = splitValues(
            valuesSplitted
                .join(' '),
            this.#ENTRY_SPLITTER
        ).map(value => convertValue(value));
        return { name, key, values }
    }

    #handleParametersAndOptions(parameters_values: string | undefined, keys?: string[]) {
        if (parameters_values === undefined) { return {} }

        // The second part of the string are the parameters
        // <key1>=<value>[\,...<values>],<key2>=<value>[\,...<values>]
        let data: string[]
        if (keys === undefined || keys.length === 0) {
            data = splitValues(parameters_values, this.#ENTRY_SPLITTER);
        } else {
            // The idea is to split the string at every key
            // First, split at "ENTRY_SPLITTER"
            // Loop through every items and determine if it is equal to a key or starts with <key> =
            // If it's a key without "=", it's a trigger and means it's alone.
            // If it's a key with "=", it's a key-value pair : join everything after until a new key.
            const items = splitValues(parameters_values, this.#ENTRY_SPLITTER);

            const keysWithEquals = keys.map(key => `${key}=`);

            data = []
            items.forEach((item) => {
                if (keys.includes(item)) {
                    // It's a simple trigger.
                    data.push(item)
                } else if (item.includes('=')) {
                    // It's a key with an equal sign
                    const keyEqual = item.split('=')[0] + '=';

                    if (keysWithEquals.includes(keyEqual)) {
                        data.push(item)
                    }
                } else {
                    // It's any value.
                    // If the previous item is a key with "=", we must join the two.
                    if (data[data.length - 1].includes('=')) {
                        data[data.length - 1] += `,${item}`;
                    } else {
                        data.push(item);
                    }
                }
            })
        }

        const parameters: PARSER_PARAMETERS = {};

        data.forEach(entry => {
            // an entry is a key-value pair or a simple trigger
            const { key, value } = splitKeyValuePair(entry);

            // There is a special case where the value is a fraction a/b.
            // It must not be split by the PARAMETER_SPLITTER
            if (value.match(/^[-.\d]+\/[-.\d]+$/)) {
                parameters[key] = {
                    value: convertValue(value),
                    options: []
                };
                return;
            }

            const [v, ...options] = value.split(this.#PARAMETER_SPLITTER);
            parameters[key] = {
                value: convertValue(v),
                options: options.map(value => convertValue(value))
            };
        });
        return parameters;
    }
}