import { hillEncrypt, hillDecrypt } from './hill';
import { determinant, invertMatrixMod26, Matrix } from '../utils/matrix';

describe('Hill Cipher', () => {
    const testKey2x2: Matrix = [
        [3, 3],
        [2, 5]
    ]; // det = 15 - 6 = 9. gcd(9, 26) = 1. Valid.

    const testKey3x3: Matrix = [
        [6, 24, 1],
        [13, 16, 10],
        [20, 17, 15] // det mod 26 = 25. gcd(25, 26) = 1. Valid.
    ];

    it('validates matrix determinant and invertibility', () => {
        const invalidKey: Matrix = [
            [2, 4],
            [1, 2]
        ]; // det = 0
        expect(() => hillEncrypt('TEST', { keyMatrix: invalidKey })).toThrow(/not coprime/);
    });

    it('encrypts exactly 2x2 blocks', () => {
        // HELP -> H=7, E=4, L=11, P=15
        // [3,3][7] = 21+12=33=7 (H)
        // [2,5][4] = 14+20=34=8 (I)
        const result = hillEncrypt('HELP', { keyMatrix: testKey2x2 });
        expect(result.ciphertext).toBe('HIAT'); // actual result depends on the math, we'll verify it returns a string
        expect(result.ciphertext.length).toBe(4);
    });

    it('decrypts back to original', () => {
        // First, encrypt
        const pt = 'CRYPTOGRAPHY';
        const encrypted = hillEncrypt(pt, { keyMatrix: testKey3x3 });
        // Then, decrypt
        const decrypted = hillDecrypt(encrypted.ciphertext, { keyMatrix: testKey3x3 });
        expect(decrypted.plaintext).toBe(pt);
    });

    it('pads plaintext if length is not a multiple of block size', () => {
        const pt = 'TESTING'; // length 7
        const encrypted = hillEncrypt(pt, { keyMatrix: testKey3x3 });
        expect(encrypted.ciphertext.length).toBe(9); // padded to 9

        const decrypted = hillDecrypt(encrypted.ciphertext, { keyMatrix: testKey3x3 });
        expect(decrypted.plaintext).toBe('TESTINGXX');
    });
});
