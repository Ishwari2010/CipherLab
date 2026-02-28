import { columnarEncrypt, columnarDecrypt } from './columnar';

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
        const pt = 'WEAREDISCOVEREDFLEEATONCEXXXXX';
        const result = columnarEncrypt('WEAREDISCOVEREDFLEEATONCE', { keyword: 'ZEBRAS' });
        // Expected padding: Z E B R A S (6)
        // Pt len = 25. Pad = 5. -> WEAREDISCOVEREDFLEEATONCEXXXXX
        // A(4), B(2), E(1), R(3), S(5), Z(0)
        // A: EVLNX
        // B: ACDTX
        // E: ESEAX
        // R: ROFOX
        // S: DEECX
        // Z: WIREE
        expect(result.ciphertext).toBe('EVLNXACDTXESEAXROFOXDEECXWIREE');

        const dec = columnarDecrypt(result.ciphertext, { keyword: 'ZEBRAS' });
        expect(dec.plaintext).toBe('WEAREDISCOVEREDFLEEATONCEXXXXX');
    });

    it('handles duplicate keyword characters (stable sort)', () => {
        // keyword "APPLE" -> A(0), P(1), P(2), L(3), E(4)
        // sorted chars: A, E, L, P, P
        // order indices: 0, 4, 3, 1, 2
        const pt = 'SECRET';
        const result = columnarEncrypt(pt, { keyword: 'APPLE' });
        // A P P L E
        // 0 3 4 2 1 (reading order) wait, sorted:
        // A(0), E(4), L(3), P(1), P(2) -> indices: 0, 4, 3, 1, 2
        // S E C R E
        // T
        // S E C R E
        // T X X X X
        // A(0): ST
        // E(4): EX
        // L(3): RX
        // P(1): EX
        // P(2): CX
        // Expected: STEXRXEXCX
        expect(result.ciphertext).toBe('STEXRXEXCX');

        const dec = columnarDecrypt(result.ciphertext, { keyword: 'APPLE' });
        expect(dec.plaintext).toBe('SECRETXXXX');
    });

    it('handles user zebra requirement', () => {
        // Z E B R A (5)
        // m e e t m
        // e a t o n
        // pt: meetmeaton (10)
        // Order: A(4), B(2), E(1), R(3), Z(0)
        // A: mn
        // B: et
        // E: ea
        // R: to
        // Z: me
        const result = columnarEncrypt('meetmeaton', { keyword: 'ZEBRA' });
        expect(result.ciphertext).toBe('mneteatome'); // len 10
    });

    it('handles double transposition', () => {
        const pt = 'THISISATESTX'; // pad to multiple of 3
        const encrypted = columnarEncrypt('THISISATEST', { keyword: 'KEY', doubleTransposition: true });
        const decrypted = columnarDecrypt(encrypted.ciphertext, { keyword: 'KEY', doubleTransposition: true });
        expect(decrypted.plaintext).toBe(pt);
    });
});
