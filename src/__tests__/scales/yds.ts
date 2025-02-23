import { YosemiteDecimal } from '../../scales'

describe('YosemiteDecimal', () => {
  describe('Get Score', () => {
    test('5.10a > 5.9', () => {
      const lowGrade = YosemiteDecimal.getScore('5.9')
      const highGrade = YosemiteDecimal.getScore('5.10a')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
    })

    test('5.11a > 5.10+', () => {
      const lowGrade = YosemiteDecimal.getScore('5.10+')
      const highGrade = YosemiteDecimal.getScore('5.11a')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
    })

    test('5.10b > 5.10a', () => {
      const lowGrade = YosemiteDecimal.getScore('5.10a')
      const highGrade = YosemiteDecimal.getScore('5.10b')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
    })

    describe('invalid grade format', () => {
      jest.spyOn(console, 'warn').mockImplementation()
      beforeEach(() => {
        jest.clearAllMocks()
      })
      test('extra modifier', () => {
        const invalidGrade = YosemiteDecimal.getScore('5.10a+')
        expect(console.warn).toHaveBeenCalledWith(
          expect.stringContaining('Unexpected grade format: 5.10a+')
        )
        expect(invalidGrade).toEqual(0)
      })
      test('missing 5. prefix', () => {
        const invalidGrade = YosemiteDecimal.getScore('12a')
        expect(console.warn).toHaveBeenCalledWith(
          expect.stringContaining('Unexpected grade format: 12a')
        )
        expect(invalidGrade).toEqual(0)
      })
      test('not yds scale', () => {
        const invalidGrade = YosemiteDecimal.getScore('v11')
        expect(console.warn).toHaveBeenCalledWith(
          expect.stringContaining('Unexpected grade format: v11')
        )
        expect(invalidGrade).toEqual(0)
      })
    })
  })

  describe('Is Type', () => {
    test('grade without letter', () => {
      expect(YosemiteDecimal.isType('5.9')).toBeTruthy()
    })

    test('grade with letter', () => {
      expect(YosemiteDecimal.isType('5.11b')).toBeTruthy()
    })

    test('grade with letter uppercased', () => {
      expect(YosemiteDecimal.isType('5.11B')).toBeTruthy()
    })

    test('grade plus modifier is accepted', () => {
      expect(YosemiteDecimal.isType('5.12+')).toBeTruthy()
      expect(YosemiteDecimal.isType('5.12-')).toBeTruthy()
    })

    test('grade with slash', () => {
      expect(YosemiteDecimal.isType('5.10a/b')).toBeTruthy()
    })

    test('incorrect type', () => {
      expect(YosemiteDecimal.isType('11+')).toBeFalsy()
      expect(YosemiteDecimal.isType('v1')).toBeFalsy()
      expect(YosemiteDecimal.isType('6a')).toBeFalsy()
    })

    test('has extra characters', () => {
      expect(YosemiteDecimal.isType('5.12a+')).toBeFalsy()
      expect(YosemiteDecimal.isType('5.12ab')).toBeFalsy()
    })
  })

  describe('Get Grade', () => {
    test('bottom of range', () => {
      expect(YosemiteDecimal.getGrade(0)).toBe('5.0')
    })

    test('top of range', () => {
      expect(YosemiteDecimal.getGrade(1000)).toBe('5.16a')
    })
  })
})
