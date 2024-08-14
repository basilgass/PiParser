import { convertValue, PARSER_VALUE } from "./convertValue"
import { splitValues } from "./splitValues";
import { splitKeyValuePair } from "./splitKeyValuePair";

// Default parser splitter
const MAIN_SPLITTER = '->';
const ENTRY_SPLITTER = ',';

// Main export type
export type PARSER = {
    name: string,
    key: string,
    values: PARSER_VALUE[],
    parameters: {
        [Key: string]: {
            value: PARSER_VALUE,
            options: PARSER_VALUE[]
        }
    }
}

// Main function
export function parse(value: string): PARSER {

    // Split to the MAIN_SPLITTER
    // name=key <value>[,...<values>]-><key1>=<value>[\,...<values>],<key2>=<value>[\,...<values>]
    const [name_key_values, parameters_values] = value.split(MAIN_SPLITTER);

    const { name, key, values } = handleNameKeyValues(name_key_values);

    const parameters: Record<string, { value: PARSER_VALUE; options: PARSER_VALUE[]; }> = handleParametersAndOptions(parameters_values);

    return { name, key, values, parameters }
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

function handleParametersAndOptions(parameters_values: string) {
    // The second part of the string are the parameters
    // <key1>=<value>[\,...<values>],<key2>=<value>[\,...<values>]
    const data = splitValues(parameters_values, ENTRY_SPLITTER);

    const parameters: Record<string, { value: PARSER_VALUE; options: PARSER_VALUE[]; }> = {};
    data.forEach(entry => {
        // an entry is a key-value pair or a simple trigger
        const { key, value } = splitKeyValuePair(entry);
        const [v, ...options] = value.split('\\');

        parameters[key] = {
            value: convertValue(v),
            options: options.map(value => convertValue(value))
        };
    });
    return parameters;
}