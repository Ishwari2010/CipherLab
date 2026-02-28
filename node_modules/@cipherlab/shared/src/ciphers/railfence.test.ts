import { railFenceEncrypt, railFenceDecrypt } from './railfence';

describe('Rail Fence Cipher', () => {
    it('encrypts standard case (rails=3)', () => {
        // W   E   C   R   L   T   E
        //  E A R D I S O V E E F L E
        //   R   S   C   E   R   E
        // WEAREDISCOVEREDFLEEATONCE => WECRLTEERDSOEEFEAOCA... wait, standard test text:
        const pt = 'WEAREDISCOVEREDFLEEATONCE';
        const result = railFenceEncrypt(pt, { rails: 3 });
        // Rail 0: W   E   C   R   L   T   E
        // Rail 1:  E A R D I S O V E E F L E A O C
        // Rail 2:   R   S   C   E   R   E   N
        expect(result.ciphertext).toBe('WECRLTEERDSOEEFEAOCAIVDEN'); // exact expectation is derived from algorithm

        const dec = railFenceDecrypt(result.ciphertext, { rails: 3 });
        expect(dec.plaintext).toBe(pt);
    });

    it('encrypts with an offset', () => {
        const pt = 'TESTMESSAGE';
        const result = railFenceEncrypt(pt, { rails: 3, offset: 1 });
        // Using offset 1 means first char goes to rail 1.
        const dec = railFenceDecrypt(result.ciphertext, { rails: 3, offset: 1 });
        expect(dec.plaintext).toBe(pt);
    });

    it('handles rails < 2 by returning unchanged string', () => {
        const pt = 'HELLO';
        const result = railFenceEncrypt(pt, { rails: 1 });
        expect(result.ciphertext).toBe('HELLO');
        const dec = railFenceDecrypt('HELLO', { rails: 1 });
        expect(dec.plaintext).toBe('HELLO');
    });
});
