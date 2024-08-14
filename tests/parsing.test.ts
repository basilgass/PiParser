import { describe, expect, it } from "vitest"
import { splitKeyValuePair } from "../lib/splitKeyValuePair"
import { splitValues } from "../lib/splitValues"
import { convertValue } from "../lib/convertValue"
import { parse } from "../lib/parse"

describe('Split entries', () => {
    it('should get the key and value from a string', () => {
        const str = 'key=value'

        const result = splitKeyValuePair(str)

        expect(result).toEqual({ key: 'key', value: 'value' })
    })

    it('should get the key and value from a string with multiple =', () => {
        const str = 'key=value=1'

        const result = splitKeyValuePair(str)

        expect(result).toEqual({ key: 'key', value: 'value=1' })
    })

    it('should return true if there is no =', () => {
        const str = 'key'

        const result = splitKeyValuePair(str)

        expect(result.key).toBe('key')
        expect(result.value).toBe('')
    })
})


describe('Parsing values', () => {
    it('should split the values by the splitter', () => {
        const str = 'value1,value2,value3'
        const splitter = ','

        const result = splitValues(str, splitter)

        expect(result).toEqual(['value1', 'value2', 'value3'])
    })

    it('should split the values by the splitter and handle escaped splitters', () => {
        const str = 'value1\\,value2,value3'
        const splitter = ','

        const result = splitValues(str, splitter)

        expect(result).toEqual(['value1,value2', 'value3'])
    })
})

/** convert a string value to a uniform value */
describe('Converting value', () => {
    it('should convert a string to a number', () => {
        const str = '100'

        const result = convertValue(str)

        expect(result).toBe(100)
    })

    it('should convert a string number to a number', () => {
        const str = '100.5'

        const result = convertValue(str)

        expect(result).toBe(100.5)
    })

    it('should convert a fraction to a number', () => {
        const str = '1/2'

        const result = convertValue(str)

        expect(result).toBe(0.5)
    })
    it('should convert a decimal fraction to a number', () => {
        const str = '1.2/0.6'

        const result = convertValue(str)

        expect(result).toBe(2)
    })
    it('should convert a relative fraction to a number', () => {
        const str = '-2/5'

        const result = convertValue(str)

        expect(result).toBe(-0.4)
    })
    it('should convert a XY pair to a XY object', () => {
        const str = '1;-2'

        const result = convertValue(str)

        expect(result).toEqual({ x: 1, y: -2 })
    })
    it('should convert a domain to a DOMAIN object', () => {
        const str = '-1:2'

        const result = convertValue(str)

        expect(result).toEqual({ min: -1, max: 2, axis: 'x' })
    })
    it('should convert a domain with axis to a DOMAIN object', () => {
        const str = '1:2:y'

        const result = convertValue(str)

        expect(result).toEqual({ min: 1, max: 2, axis: 'y' })
    })

    it('should convert a domain with inverted min and max to a DOMAIN object', () => {
        const str = '2:-1'

        const result = convertValue(str)

        expect(result).toEqual({ min: -1, max: 2, axis: 'x' })
    })

    it('should convert a range to a RANGE object', () => {
        const str = '1:2:0.5'

        const result = convertValue(str)

        expect(result).toEqual({ min: 1, max: 2, step: 0.5 })
    })

    it('should convert a range with inverted min and max to a RANGE object', () => {
        const str = '-2:-1:0.5'

        const result = convertValue(str)

        expect(result).toEqual({ min: -2, max: -1, step: 0.5 })
    })

    it('should convert a value with null step to a RANGE object with default step', () => {
        const str = '1:2:0'

        const result = convertValue(str)

        expect(result).toEqual({ min: 1, max: 2, step: 0.01 })
    })

})


describe('Parsing complete', () => {
    it('should parse a complete entry with parameters', () => {
        const entry = 'name=key 12->hello=12,label,world=12:13\\0.75,trigger'

        const result = parse(entry)

        expect(result.name).toBe('name')
        expect(result.key).toBe('key')
        expect(result.values[0]).toBe(12)

        expect(result.parameters).toHaveProperty('hello')
        expect(result.parameters.hello.value).toBe(12)
        expect(result.parameters.hello.options).toHaveLength(0)

        expect(result.parameters).toHaveProperty('world')
        expect(result.parameters.world.value).toEqual({ min: 12, max: 13, axis: 'x' })
        expect(result.parameters.world.options).toHaveLength(1)
        expect(result.parameters.world.options[0]).toBe(0.75)

        expect(result.parameters).toHaveProperty('trigger')
        expect(result.parameters.trigger.value).toBe(true)

    })
})