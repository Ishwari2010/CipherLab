"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const caesar_1 = require("./caesar");
describe('Caesar Cipher', () => {
    it('encrypts basic text with shift 3', () => {
        const result = (0, caesar_1.caesarEncrypt)('HELLO!', { shift: 3 });
        expect(result.ciphertext).toBe('KHOOR!');
    });
    it('decrypts basic text with shift 3', () => {
        const result = (0, caesar_1.caesarDecrypt)('KHOOR!', { shift: 3 });
        expect(result.plaintext).toBe('HELLO!');
    });
    it('handles negative shift', () => {
        const result = (0, caesar_1.caesarEncrypt)('HELLO', { shift: -3 });
        expect(result.ciphertext).toBe('EBIIL'); // E=H-3, B=E-3, I=L-3
    });
    it('strips punctuation when requested', () => {
        const result = (0, caesar_1.caesarEncrypt)('HELLO WORLD!', { shift: 1, stripPunctuation: true });
        expect(result.ciphertext).toBe('IFMMPXPSME');
    });
    it('preserves case by default', () => {
        const result = (0, caesar_1.caesarEncrypt)('Hello World', { shift: 1 });
        expect(result.ciphertext).toBe('Ifmmp Xpsme');
    });
    it('converts to uppercase if preserveCase is false', () => {
        const result = (0, caesar_1.caesarEncrypt)('Hello World', { shift: 1, preserveCase: false });
        expect(result.ciphertext).toBe('IFMMP XPSME');
    });
    it('can brute force ciphertexts and rank English text highest', () => {
        const original = 'This is a secret message that needs to be decrypted';
        const encrypted = (0, caesar_1.caesarEncrypt)(original, { shift: 13 }).ciphertext;
        const bruteForceResults = (0, caesar_1.caesarBruteForce)(encrypted);
        expect(bruteForceResults.length).toBe(26);
        expect(bruteForceResults[0].shift).toBe(13);
        expect(bruteForceResults[0].plaintext).toBe(original);
    });
});
