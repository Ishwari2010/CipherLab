import { CipherResult } from '../types';

export interface PlayfairOptions {
    key: string;
    fillerChar?: string; // Default 'X'
}

export function generatePlayfairGrid(key: string): string[][] {
    const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    const seen = new Set<string>();
    const gridChars: string[] = [];

    // Add key chars
    for (const char of cleanKey) {
        if (!seen.has(char)) {
            seen.add(char);
            gridChars.push(char);
        }
    }

    // Add remaining alphabet
    for (let i = 0; i < 26; i++) {
        const char = String.fromCharCode(65 + i);
        if (char === 'J') continue; // Skip J
        if (!seen.has(char)) {
            seen.add(char);
            gridChars.push(char);
        }
    }

    // Create 5x5 grid
    const grid: string[][] = [];
    for (let r = 0; r < 5; r++) {
        grid.push(gridChars.slice(r * 5, r * 5 + 5));
    }

    return grid;
}

function findPosition(grid: string[][], char: string): [number, number] {
    if (char === 'J') char = 'I';
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            if (grid[r][c] === char) return [r, c];
        }
    }
    throw new Error(`Character ${char} not found in grid.`);
}

function processDigraphs(text: string, fillerChar: string): string[] {
    let cleanText = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    const digraphs: string[] = [];

    let i = 0;
    while (i < cleanText.length) {
        const a = cleanText[i];
        const b = cleanText[i + 1];

        if (!b) {
            // Odd length at end, append filler
            digraphs.push(a + (fillerChar === a ? 'Z' : fillerChar));
            i += 1;
        } else if (a === b) {
            // Duplicate letter, insert filler
            const filler = fillerChar === a ? 'Z' : fillerChar;
            digraphs.push(a + filler);
            i += 1;
        } else {
            digraphs.push(a + b);
            i += 2;
        }
    }

    return digraphs;
}

export function playfairEncrypt(plaintext: string, options: PlayfairOptions): CipherResult {
    const { key, fillerChar = 'X' } = options;
    const steps: string[] = [];

    const grid = generatePlayfairGrid(key);
    steps.push(`Generated 5x5 grid using key "${key}" (I/J combined).`);

    const digraphs = processDigraphs(plaintext, fillerChar.toUpperCase());
    steps.push(`Processed plaintext into digraphs: ${digraphs.join(' ')}`);

    let ciphertext = '';
    for (const pair of digraphs) {
        const [r1, c1] = findPosition(grid, pair[0]);
        const [r2, c2] = findPosition(grid, pair[1]);

        let enc1, enc2;
        if (r1 === r2) {
            // Same row: shift right
            enc1 = grid[r1][(c1 + 1) % 5];
            enc2 = grid[r2][(c2 + 1) % 5];
        } else if (c1 === c2) {
            // Same column: shift down
            enc1 = grid[(r1 + 1) % 5][c1];
            enc2 = grid[(r2 + 1) % 5][c2];
        } else {
            // Rectangle: swap columns
            enc1 = grid[r1][c2];
            enc2 = grid[r2][c1];
        }

        ciphertext += enc1 + enc2;
        steps.push(`Encrypted ${pair} -> ${enc1}${enc2}`);
    }

    return {
        plaintext,
        ciphertext,
        steps,
        meta: { grid }
    };
}

export function playfairDecrypt(ciphertext: string, options: PlayfairOptions): CipherResult {
    const { key } = options;
    const steps: string[] = [];

    const grid = generatePlayfairGrid(key);
    steps.push(`Generated 5x5 grid using key "${key}" (I/J combined).`);

    // Note: assumes ciphertext is already well-formed and valid length
    let cleanText = ciphertext.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    if (cleanText.length % 2 !== 0) {
        throw new Error('Ciphertext length must be even for Playfair decryption.');
    }

    const digraphs: string[] = [];
    for (let i = 0; i < cleanText.length; i += 2) {
        digraphs.push(cleanText[i] + cleanText[i + 1]);
    }

    let plaintext = '';
    for (const pair of digraphs) {
        const [r1, c1] = findPosition(grid, pair[0]);
        const [r2, c2] = findPosition(grid, pair[1]);

        let dec1, dec2;
        // Decrypt is shift left or shift up by 1 (+4 mod 5)
        if (r1 === r2) {
            dec1 = grid[r1][(c1 + 4) % 5];
            dec2 = grid[r2][(c2 + 4) % 5];
        } else if (c1 === c2) {
            dec1 = grid[(r1 + 4) % 5][c1];
            dec2 = grid[(r2 + 4) % 5][c2];
        } else {
            dec1 = grid[r1][c2];
            dec2 = grid[r2][c1];
        }

        plaintext += dec1 + dec2;
        steps.push(`Decrypted ${pair} -> ${dec1}${dec2}`);
    }

    return {
        plaintext,
        ciphertext,
        steps,
        meta: { grid }
    };
}
