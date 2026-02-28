"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const columnar_1 = require("./columnar");
describe('Columnar Transposition Cipher', () => {
    it('encrypts standard columnar without filler', () => {
        // "WE ARE DISCOVERED FLEE AT ONCE" -> "WEAREDISCOVEREDFLEEATONCE", keyword "ZEBRAS" (6 cols)
        // Z E B R A S
        // 5 2 1 4 0 3
        // W E A R E D
        // I S C O V E
        // R E D F L E
        // E A T O N C
        // E
        // Order: A(4), B(2), E(1), R(4 wait, index 3), S(5), Z(0)
        // A: EVLN
        // B: ACDT
        // E: ESEA
        // R: ROFO
        // S: DEEC
        // Z: WIREE
        // Total: EVLNACDTESEAROFODEECWIREE
        const pt = 'WEAREDISCOVEREDFLEEATONCE';
        const result = (0, columnar_1.columnarEncrypt)(pt, { keyword: 'ZEBRAS' });
        expect(result.ciphertext).toBe('EVLNACDTESEAROFODEECWIREE');
        const dec = (0, columnar_1.columnarDecrypt)(result.ciphertext, { keyword: 'ZEBRAS' });
        expect(dec.plaintext).toBe(pt);
    });
    it('handles duplicate keyword characters (stable sort)', () => {
        // keyword "APPLE" -> A(0), P(1), P(2), L(3), E(4)
        // sorted chars: A, E, L, P, P
        // order indices: 0, 4, 3, 1, 2
        const pt = 'SECRET';
        const result = (0, columnar_1.columnarEncrypt)(pt, { keyword: 'APPLE' });
        // A P P L E
        // 0 3 4 2 1 (reading order) wait, sorted:
        // A(0), E(4), L(3), P(1), P(2) -> indices: 0, 4, 3, 1, 2
        // S E C R E
        // T
        // 0 (A): ST
        // 4 (E): E
        // 3 (L): R
        // 1 (P): E
        // 2 (P): C
        // Expected: STEREC
        // STEREC -> wait, reading order is 0, 4, 3, 1, 2
        expect(result.ciphertext).toBe('STEREC');
        const dec = (0, columnar_1.columnarDecrypt)(result.ciphertext, { keyword: 'APPLE' });
        expect(dec.plaintext).toBe(pt);
    });
    it('handles double transposition', () => {
        const pt = 'THISISATEST';
        const encrypted = (0, columnar_1.columnarEncrypt)(pt, { keyword: 'KEY', doubleTransposition: true });
        const decrypted = (0, columnar_1.columnarDecrypt)(encrypted.ciphertext, { keyword: 'KEY', doubleTransposition: true });
        expect(decrypted.plaintext).toBe(pt);
    });
});
