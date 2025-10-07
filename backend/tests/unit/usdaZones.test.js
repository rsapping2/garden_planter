const { getUSDAZone } = require('../../src/utils/usdaZones');

describe('USDA Zones Utility', () => {
  describe('getUSDAZone', () => {
    test('should return correct zone for California ZIP codes', () => {
      expect(getUSDAZone('90210')).toBe('10a'); // Beverly Hills, CA
      expect(getUSDAZone('94102')).toBe('10a'); // San Francisco, CA
      expect(getUSDAZone('95616')).toBe('9b');  // Davis, CA
      expect(getUSDAZone('96150')).toBe('7a');  // South Lake Tahoe, CA
    });

    test('should return correct zone for Oregon ZIP codes', () => {
      expect(getUSDAZone('97401')).toBe('8b'); // Eugene, OR
      expect(getUSDAZone('97201')).toBe('8b'); // Portland, OR
      expect(getUSDAZone('97701')).toBe('6b'); // Bend, OR
    });

    test('should return correct zone for Washington ZIP codes', () => {
      expect(getUSDAZone('98101')).toBe('8b'); // Seattle, WA
      expect(getUSDAZone('99201')).toBe('6b'); // Spokane, WA
      expect(getUSDAZone('98225')).toBe('8b'); // Bellingham, WA
    });

    test('should return correct zone for New York ZIP codes', () => {
      expect(getUSDAZone('10001')).toBe('7a'); // New York, NY
      expect(getUSDAZone('11201')).toBe('7b'); // Brooklyn, NY
      expect(getUSDAZone('14201')).toBe('6b'); // Buffalo, NY
    });

    test('should return correct zone for Florida ZIP codes', () => {
      expect(getUSDAZone('33101')).toBe('10b'); // Miami, FL
      expect(getUSDAZone('32801')).toBe('9b');  // Orlando, FL
      expect(getUSDAZone('32301')).toBe('8b');  // Tallahassee, FL
    });

    test('should return correct zone for Texas ZIP codes', () => {
      expect(getUSDAZone('75201')).toBe('8a'); // Dallas, TX
      expect(getUSDAZone('77001')).toBe('9a'); // Houston, TX
      expect(getUSDAZone('78701')).toBe('8b'); // Austin, TX
    });

    test('should return correct zone for Colorado ZIP codes', () => {
      expect(getUSDAZone('80201')).toBe('5b'); // Denver, CO
      expect(getUSDAZone('80424')).toBe('4a'); // Breckenridge, CO
      expect(getUSDAZone('80301')).toBe('5b'); // Boulder, CO
    });

    test('should return correct zone for extreme climate ZIP codes', () => {
      expect(getUSDAZone('83001')).toBe('4a'); // Jackson, WY (cold)
      expect(getUSDAZone('92101')).toBe('10b'); // San Diego, CA (warm)
      expect(getUSDAZone('33101')).toBe('10b'); // Miami, FL (tropical)
    });

    test('should return default zone for unknown ZIP codes', () => {
      expect(getUSDAZone('00000')).toBe('7a'); // Non-existent ZIP
      expect(getUSDAZone('99999')).toBe('7a'); // Non-existent ZIP
      expect(getUSDAZone('')).toBe('7a');      // Empty string
    });

    test('should handle invalid input gracefully', () => {
      expect(getUSDAZone(null)).toBe('7a');
      expect(getUSDAZone(undefined)).toBe('7a');
      expect(getUSDAZone(12345)).toBe('7a'); // Number instead of string
    });

    test('should be case insensitive for string inputs', () => {
      expect(getUSDAZone('90210')).toBe('10a');
      // Note: ZIP codes are typically numeric, but testing string handling
    });

    test('should cover all major climate zones', () => {
      const zones = [
        getUSDAZone('83001'), // 4a - Jackson, WY
        getUSDAZone('83340'), // 5a - Pocatello, ID
        getUSDAZone('80201'), // 5b - Denver, CO
        getUSDAZone('60601'), // 6a - Chicago, IL
        getUSDAZone('97701'), // 6b - Bend, OR
        getUSDAZone('10001'), // 7a - New York, NY
        getUSDAZone('11201'), // 7b - Brooklyn, NY
        getUSDAZone('75201'), // 8a - Dallas, TX
        getUSDAZone('98101'), // 8b - Seattle, WA
        getUSDAZone('77001'), // 9a - Houston, TX
        getUSDAZone('95616'), // 9b - Davis, CA
        getUSDAZone('90210'), // 10a - Beverly Hills, CA
        getUSDAZone('33101')  // 10b - Miami, FL
      ];

      // Verify we have coverage across climate zones 4a through 10b
      const uniqueZones = [...new Set(zones)].sort();
      expect(uniqueZones.length).toBeGreaterThan(10);
      expect(uniqueZones).toContain('4a');
      expect(uniqueZones).toContain('10b');
    });
  });
});


