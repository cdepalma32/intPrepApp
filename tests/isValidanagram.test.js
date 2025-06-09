const isValidAnagram = require('../utils/isValidAnagram');

/**
 * Unit tests for the isValidAnagram helper function using Jest.
 * This test suite verifies correctness for:
 * - Valid anagrams
 * - Mismatched lengths
 * - Character mismatches
 */

// Unit tests for the isValidAnagram utility function
describe('isValidAnagram', () => {

    it('returns true for valid anagrams', () => {
        expect(isValidAnagram('cinema', 'iceman')).toBe(true);
    });

    it('returns false when lengths are different', () => {
        expect(isValidAnagram('aaz', 'zza')).toBe(false);
    });

    it('returns false when characters do not match', () => {
        expect(isValidAnagram('anagram', 'nagarab')).toBe(false);
    });
    
    it('returns true for two empty strings', () => {
        expect(isValidAnagram('', '')).toBe(true);
    });

    it('returns false if one string is empty', () => {
        expect(isValidAnagram('abc','')).toBe(false);
    });

    it('is case-sensitive', () => {
        expect(isValidAnagram('aA', 'Aa')).toBe(false);
    });
});