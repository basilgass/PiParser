import { describe, expect, it } from "vitest"
import { splitKeyValuePair } from "../src/splitKeyValuePair"
import { splitValues } from "../src/splitValues"
import { convertValue } from "../src/convertValue"
import { PiParse } from "../src"

export const PARSER_PARAMETERS_KEYS = [
    'ppu', 'x', 'y', 'grid', 'axis', 'label', 'tex', 'points', 'no-points', 'subgrid'
]

const parser = new PiParse()

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
        const entry = 'name=key 12->hello=12,label,world=12:13/0.75,trigger'

        const result = parser.parse(entry)

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

    it('should parse a complete entry for a function', () => {
        const entry = "f(x)=plot 3x-5y+5=0->color=red/0.5,w=2,length=7/3"

        const result = parser.parse(entry)

        expect(result.name).toBe('f(x)')
        expect(result.key).toBe('plot')
        expect(result.values[0]).toEqual('3x-5y+5=0')

        expect(result.parameters).toHaveProperty('color')

        expect(result.parameters.color.value).toBe('red')
        expect(result.parameters.color.options).toHaveLength(1)
        expect(result.parameters.color.options[0]).toBe(0.5)

        expect(result.parameters).toHaveProperty('w')
        expect(result.parameters.w.value).toBe(2)

        expect(result.parameters).toHaveProperty('length')
        expect(result.parameters.length.value).toEqual(7 / 3)
    })

    it('should parse a complete entry without parameters', () => {
        const entry = "A=point 1;-2"
        const result = parser.parse(entry)

        expect(result.name).toBe('A')
        expect(result.key).toBe('point')
        expect(result.values[0]).toEqual({ x: 1, y: -2 })
    })

    it('should parse only parameters', () => {
        const entry = 'label,camera=[1,2,3,4]/10,fog,width=3:4/hello,position=3;-2'

        const result = parser.parameters(entry, ['camera', 'fog', 'width', 'position', 'label'])

        expect(result).toHaveProperty('camera')
        expect(result.camera.value).toHaveLength(4)
        if (Array.isArray(result.camera.value) && result.camera.value.length === 4) {
            expect(result.camera.value[0]).toBe(1)
            expect(result.camera.value[1]).toBe(2)
            expect(result.camera.value[2]).toBe(3)
            expect(result.camera.value[3]).toBe(4)
        }
        expect(result.camera.options).toHaveLength(1)
        expect(result.camera.options[0]).toBe(10)
    })

    it('should parse parameters withouth keys', () => {
        const entry = 'camera=ortho/10,fog,width=3:4/hello,position=3;-2'

        const result = parser.parameters(entry)

        expect(result).toHaveProperty('camera')
        expect(result.camera.value).toBe('ortho')
        expect(result.camera.options).toHaveLength(1)
    })

    it('should parse a real world PiDraw example', () => {
        const entry = 'x=-11:11,y=-11:11,axis,tex'
        const keys = PARSER_PARAMETERS_KEYS

        const result = parser.parameters(entry, keys)

        expect(result).toHaveProperty('x')
        expect(result.x.value).toEqual({ min: -11, max: 11, axis: 'x' })
        expect(result.x.options).toHaveLength(0)

        expect(result).toHaveProperty('y')
        expect(result.y.value).toEqual({ min: -11, max: 11, axis: 'x' })
        expect(result.y.options).toHaveLength(0)

        expect(result).toHaveProperty('axis')
        expect(result.axis.value).toBe(true)

        expect(result).toHaveProperty('tex')
        expect(result.tex.value).toBe(true)
    })

    it('should work with a formatter', () => {
        const entry = 'A(1,3)'

        const formatter = (str: string) => {
            return str.replace('(', '=point ').replace(')', '')
        }

        parser.formatter = formatter
        const result = parser.parse(entry)

        parser.formatter = undefined

        expect(result.name).toBe('A')
        expect(result.key).toBe('point')
        expect(result.values).toHaveLength(2)
        expect(result.values[0]).toBe(1)
        expect(result.values[1]).toBe(3)
    })

    it('should parse values with zero', () => {
        const entry = 'A=point 0,0'

        const result = parser.parameters(entry)
        
    })

    it('should parse parameters with an unknown key', () => {
        const entry = 'axis,camera=[12,20],gri'

        const result = parser.parameters(entry, ['axis', 'grid', 'camera'])

        console.log(result);
        expect(result).toHaveProperty('axis')
        expect(result.axis.value).toBeTruthy()
        expect(result).toHaveProperty('camera')
    })
})