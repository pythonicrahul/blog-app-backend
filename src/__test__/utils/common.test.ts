import { ITokenCreationRequest } from '../../interfaces/common';
import { 
    validatePassword, validateEmail, validateEmailLength, generate_token, generate_epoch_time 
} from '../../utils/common';
import jwt from 'jsonwebtoken';

describe('Utility Functions', () => {

    describe('validatePassword', () => {
        it('should return true for a valid password', () => {
            const password = 'Valid123@';
            expect(validatePassword(password)).not.toBeNull();
        });

        it('should return null for an invalid password', () => {
            const password = 'invalid';
            expect(validatePassword(password)).toBeNull();
        });
    });

    describe('validateEmail', () => {
        it('should return true for a valid email', () => {
            const email = 'test@example.com';
            expect(validateEmail(email)).not.toBeNull();
        });

        it('should return null for an invalid email', () => {
            const email = 'invalid-email';
            expect(validateEmail(email)).toBeNull();
        });
    });

    describe('validateEmailLength', () => {
        it('should return true for a valid email length', () => {
            const email = 'test@example.com';
            expect(validateEmailLength(email)).toBe(true);
        });

        it('should return error message for local part longer than 64 characters', () => {
            const email = 'a'.repeat(65) + '@example.com';
            expect(validateEmailLength(email)).toBe("Please enter the correct email length, the local address email should be 64 characters.");
        });

        it('should return error message for domain part longer than 255 characters', () => {
            const email = 'test@' + 'a'.repeat(256) + '.com';
            expect(validateEmailLength(email)).toBe("Please enter the valid length of domain address for email, Domain address cannot be more than 255 characters.");
        });
    });

    describe('generate_epoch_time', () => {
        it('should generate current epoch time', () => {
            const now = Math.floor(Date.now() / 1000);
            expect(generate_epoch_time()).toBeCloseTo(now, 0);
        });

        it('should generate epoch time with increment', () => {
            const increment = 3600; // 1 hour
            const now = Math.floor(Date.now() / 1000);
            expect(generate_epoch_time(increment)).toBeCloseTo(now + increment, 0);
        });
    });
});
