/**
 * Checks if two input strings are valid anagrams of eachother.
 * An anagram contains the same characters in a different order.
 * 
 * Example:
 *      isValidAnagram('cinema', 'iceman') // true
 * 
 * @param {string} str1 - First input string
 * @param {string} str2 - Second input string
 * @returns {boolean} - True if valid anagram, else false
 */

function isValidAnagram(str1, str2) {
    if (str1.length !== str2.length) return false;
    const lookup = {};
    for (let char of str1) {
        lookup[char] = (lookup[char] || 0) +1;
    }
    for (let char of str2) {
        if (!lookup[char]) return false;
        lookup[char]--;
    }
    return true;
}

export default isValidAnagram;