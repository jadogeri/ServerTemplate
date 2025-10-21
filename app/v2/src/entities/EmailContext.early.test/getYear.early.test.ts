
import { EmailContext } from '../EmailContext';


// EmailContext.getYear.spec.ts
describe('EmailContext.getYear() getYear method', () => {
    // Happy Path Tests

    it('should return the current year as a number (happy path)', () => {
        // This test aims to verify that getYear returns the current year correctly.
        const emailContext = new EmailContext();
        const expectedYear = new Date().getFullYear();
        const result = emailContext.getYear();
        expect(result).toBe(expectedYear);
        expect(typeof result).toBe('number');
    });

    it('should return a four-digit year (happy path)', () => {
        // This test aims to ensure that the returned year is a four-digit number.
        const emailContext = new EmailContext();
        const year = emailContext.getYear();
        expect(year).toBeGreaterThanOrEqual(1000);
        expect(year).toBeLessThanOrEqual(9999);
    });

    // Edge Case Tests

    it('should return correct year at the boundary of New Year (edge case)', () => {
        // This test aims to verify correct year calculation at the boundary of New Year.
        // Mock Date to Dec 31, 23:59:59
        const mockDate = new Date('2023-12-31T23:59:59.999Z');
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as Date);

        const emailContext = new EmailContext();
        const result = emailContext.getYear();
        expect(result).toBe(2023);

        // Restore Date
        (global.Date as jest.Mock).mockRestore();
    });

    it('should return correct year just after New Year (edge case)', () => {
        // This test aims to verify correct year calculation just after New Year.
        // Mock Date to Jan 1, 00:00:00
        const mockDate = new Date('2024-01-01T00:00:00.000Z');
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as Date);

        const emailContext = new EmailContext();
        const result = emailContext.getYear();
        expect(result).toBe(2024);

        // Restore Date
        (global.Date as jest.Mock).mockRestore();
    });

    it('should work correctly if system date is set to a year far in the past (edge case)', () => {
        // This test aims to verify correct year calculation for a date far in the past.
        const mockDate = new Date('1900-01-01T00:00:00.000Z');
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as Date);

        const emailContext = new EmailContext();
        const result = emailContext.getYear();
        expect(result).toBe(1900);

        (global.Date as jest.Mock).mockRestore();
    });

    it('should work correctly if system date is set to a year far in the future (edge case)', () => {
        // This test aims to verify correct year calculation for a date far in the future.
        const mockDate = new Date('3000-01-01T00:00:00.000Z');
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as Date);

        const emailContext = new EmailContext();
        const result = emailContext.getYear();
        expect(result).toBe(3000);

        (global.Date as jest.Mock).mockRestore();
    });

    it('should not throw and should return a number even if Date is mocked to a non-standard date (edge case)', () => {
        // This test aims to verify that getYear does not throw and returns a number for a non-standard date.
        const mockDate = new Date('0001-01-01T00:00:00.000Z');
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as Date);

        const emailContext = new EmailContext();
        const result = emailContext.getYear();
        expect(result).toBe(1);
        expect(typeof result).toBe('number');

        (global.Date as jest.Mock).mockRestore();
    });
});