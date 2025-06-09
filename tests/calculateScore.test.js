/**
 * Unit tests for the calculateScore utility function
 * 
 * These tests verify that the calculateScore function correctly:
 * - Calculates percentage scores from correct/total values
 * - Handles edge cases like zero attempts
 * - Properly rounds decimal percentages to integers
 * - Handles invalid inputs gracefully
 * 
 * @jest-environment node
 */

const calculateScore = require('../utils/calculateScore');

describe('calculateScore', () => {
  it('calculates correct percentage for normal cases', () => {
    expect(calculateScore(7, 10)).toBe(70);
    expect(calculateScore(3, 5)).toBe(60);
    expect(calculateScore(10, 10)).toBe(100);
  });

  it('handles zero attempts', () => {
    expect(calculateScore(0, 0)).toBe(0);
  });

  it('handles zero correct answers', () => {
    expect(calculateScore(0, 10)).toBe(0);
  });

  it('rounds to the nearest integer', () => {
    expect(calculateScore(2, 3)).toBe(67); // 66.66... rounded to 67
    expect(calculateScore(1, 3)).toBe(33); // 33.33... rounded to 33
  });

  it('handles negative inputs by returning absolute percentage', () => {
    expect(calculateScore(-5, -10)).toBe(50);
  });

  it('handles non-numeric inputs by returning 0', () => {
    expect(calculateScore('a', 10)).toBe(0);
    expect(calculateScore(5, 'b')).toBe(0);
    expect(calculateScore(null, 5)).toBe(0);
    expect(calculateScore(5, undefined)).toBe(0);
  });
});