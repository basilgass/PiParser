import { convertValue, PARSER_VALUE } from "./convertValue"
import { splitValues } from "./splitValues";
import { splitKeyValuePair } from "./splitKeyValuePair";

// Default parser splitter
const MAIN_SPLITTER = '->';
const ENTRY_SPLITTER = ',';
const PARAMETER_SPLITTER = '/';

// Main export type
type PARSER_VALUES = PARSER_VALUE | PARSER_VALUE[]
type PARSER_PARAMETERS = Record<
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

// Main function
export function PiParse(value: string): PARSER {

    // Split to the MAIN_SPLITTER
    // name=key <value>[,...<values>]-><key1>=<value>[\,...<values>],<key2>=<value>[\,...<values>]
    const [name_key_values, parameters_values] = value.split(MAIN_SPLITTER);

    const { name, key, values } = handleNameKeyValues(name_key_values);

    const parameters: PARSER_PARAMETERS = handleParametersAndOptions(parameters_values);

    return { name, key, values, parameters }
}

export function PiParseParameters(value: string, keys?: string[]): PARSER_PARAMETERS {
    return handleParametersAndOptions(value, keys);
}

function handleNameKeyValues(name_key_values: string) {
    const [name_key, ...valuesSplitted] = name_key_values.split(' ');
    const [name, key] = name_key.split('=');
    const values = splitValues(
        valuesSplitted
            .join(' '),
        ENTRY_SPLITTER
    ).map(value => convertValue(value));
    return { name, key, values }
}

function handleParametersAndOptions(parameters_values: string | undefined, keys?: string[]) {
    if (parameters_values === undefined) { return {} }

    // The second part of the string are the parameters
    // <key1>=<value>[\,...<values>],<key2>=<value>[\,...<values>]
    let data: string[]
    if (keys === undefined || keys.length === 0) {
        data = splitValues(parameters_values, ENTRY_SPLITTER);
    } else {
        // split at every keys.
        // This way we can parse the parameters of a specific key
        data = parameters_values
            .split(new RegExp(`(?=${ENTRY_SPLITTER}${keys.join(`|${ENTRY_SPLITTER}`)})`))
            .map((value: string) => {
                let result = value.trim()
                if (result.startsWith(',')) {
                    result = result.slice(1).trim()
                }
                if (result.endsWith(',')) {
                    result = result.slice(0, -1);
                }

                return splitValues(result, ENTRY_SPLITTER).join(ENTRY_SPLITTER);
            });
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

        const [v, ...options] = value.split(PARAMETER_SPLITTER);
        parameters[key] = {
            value: convertValue(v),
            options: options.map(value => convertValue(value))
        };
    });
    return parameters;
}