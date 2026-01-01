import { describe, it, expect, vi } from 'vitest';
import { generateSlug } from './data';
import { validateEmail, validateLength, validateSlug, validateUrl } from './validation';

// Mock prisma to avoid DB connection issues in utility tests
vi.mock('@/lib/prisma', () => ({
    prisma: {
        post: { findMany: vi.fn() },
        // Add other models if needed
    },
}));

describe('Utility Functions', () => {
    describe('generateSlug', () => {
        it('should convert Turkish characters to ASCII', () => {
            const input = 'İste YBS Topluluğu İle Geleceğe';
            const expected = 'iste-ybs-toplulugu-ile-gelecege';
            expect(generateSlug(input)).toBe(expected);
        });

        it('should handle special characters and spaces', () => {
            expect(generateSlug('Hello World!')).toBe('hello-world');
            expect(generateSlug('Next.js 16 is here')).toBe('next-js-16-is-here');
        });
    });

    describe('validateEmail', () => {
        it('should return true for valid emails', () => {
            expect(validateEmail('test@example.com')).toBe(true);
            expect(validateEmail('user.name@sub.domain.org')).toBe(true);
        });

        it('should return false for invalid emails', () => {
            expect(validateEmail('invalid-email')).toBe(false);
            expect(validateEmail('test@')).toBe(false);
            expect(validateEmail('@domain.com')).toBe(false);
        });
    });

    describe('validateSlug', () => {
        it('should return true for valid slugs', () => {
            expect(validateSlug('valid-slug-123')).toBe(true);
        });

        it('should return false for invalid slugs', () => {
            expect(validateSlug('Invalid Slug')).toBe(false);
            expect(validateSlug('no_underscores')).toBe(false);
        });
    });

    describe('validateUrl', () => {
        it('should return true for valid http/https URLs', () => {
            expect(validateUrl('https://google.com')).toBe(true);
            expect(validateUrl('http://localhost:3000')).toBe(true);
        });

        it('should return false for invalid protocols or strings', () => {
            expect(validateUrl('ftp://server.com')).toBe(false);
            expect(validateUrl('not-a-url')).toBe(false);
        });

        it('should return true for empty string (optional fields)', () => {
            expect(validateUrl('')).toBe(true);
        });
    });
});
