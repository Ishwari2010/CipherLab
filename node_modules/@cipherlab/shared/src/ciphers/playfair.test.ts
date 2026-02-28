import { playfairEncrypt, playfairDecrypt, generatePlayfairGrid } from './playfair';

describe('Playfair Cipher', () => {
    it('generates the correct grid', () => {
        const grid = generatePlayfairGrid('PLAYFAIR EXAMPLE');
        // P L A Y F
        // I R E X M
        // B C D G H
        // K N O Q S
        // T U V W Z
        expect(grid[0].join('')).toBe('PLAYF');
        expect(grid[1].join('')).toBe('IREXM'); // J merged into I
        expect(grid[2].join('')).toBe('BCDGH');
        expect(grid[3].join('')).toBe('KNOQS');
        expect(grid[4].join('')).toBe('TUVWZ');
    });

    it('encrypts according to rules', () => {
        // "HIDE THE GOLD IN THE TREESTUMP"
        const result = playfairEncrypt('HIDE THE GOLD IN THE TREESTUMP', { key: 'PLAYFAIR EXAMPLE' });

        // HI DE TH EG OL DI NT HE TR EX ES TU MP
        // HI -> BM
        // DE -> OD
        // TH -> ZB
        // EG -> XD
        // OL -> NA
        // DI -> BE
        // NT -> KU
        // HE -> DM
        // TR -> UI
        // EX -> XM
        // ES -> MO
        // TU -> UV
        // MP -> IF
        // BMODZBXDNABEKUDMUIXMMOUVIF
        expect(result.ciphertext).toBe('BMODZBXDNABEKUDMUIXMMOUVIF');
    });

    it('decrypts correctly', () => {
        const result = playfairDecrypt('BMODZBXDNABEKUDMUIXMMOUVIF', { key: 'PLAYFAIR EXAMPLE' });
        expect(result.plaintext).toBe('HIDETHEGOLDINTHETREXESTUMP'); // 'X' was inserted between EE
    });
});
