
import { EmailContext } from '../../../../src/entities/EmailContext';


// EmailContext.getCompany.spec.ts
describe('EmailContext.getCompany() getCompany method', () => {
    const ORIGINAL_ENV = process.env;

    beforeEach(() => {
        // Clone process.env before each test to avoid side effects
        process.env = { ...ORIGINAL_ENV };
    });

    afterEach(() => {
        // Restore original process.env after each test
        process.env = ORIGINAL_ENV;
    });

    // Happy Path Tests
    describe('Happy Paths', () => {
        it('should return the value of process.env.COMPANY when it is set to a typical company name', () => {
            // This test ensures getCompany returns the expected company name from the environment variable.
            process.env.COMPANY = 'AcmeCorp';
            const ctx = new EmailContext();
            expect(ctx.getCompany()).toBe('AcmeCorp');
        });

        it('should return the value of process.env.COMPANY when it is set to a company name with spaces and special characters', () => {
            // This test ensures getCompany handles company names with spaces and special characters.
            process.env.COMPANY = 'Acme Corp, Inc.™';
            const ctx = new EmailContext();
            expect(ctx.getCompany()).toBe('Acme Corp, Inc.™');
        });

        it('should return the value of process.env.COMPANY when it is set to a numeric string', () => {
            // This test ensures getCompany works with numeric string values.
            process.env.COMPANY = '123456';
            const ctx = new EmailContext();
            expect(ctx.getCompany()).toBe('123456');
        });
    });

    // Edge Case Tests
    describe('Edge Cases', () => {
        it('should return an empty string when process.env.COMPANY is set to an empty string', () => {
            // This test checks the behavior when COMPANY is set but empty.
            process.env.COMPANY = '';
            const ctx = new EmailContext();
            expect(ctx.getCompany()).toBe('');
        });

          it('should return a string with only whitespace if process.env.COMPANY is set to whitespace', () => {
            // This test ensures getCompany returns whitespace if that's the value set.
            process.env.COMPANY = '   ';
            const ctx = new EmailContext();
            expect(ctx.getCompany()).toBe('   ');
        });

        it('should return a long string if process.env.COMPANY is set to a very long company name', () => {
            // This test ensures getCompany can handle very long company names.
            const longName = 'A'.repeat(1000);
            process.env.COMPANY = longName;
            const ctx = new EmailContext();
            expect(ctx.getCompany()).toBe(longName);
        });
    });
});