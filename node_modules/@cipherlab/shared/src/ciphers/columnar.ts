import { CipherResult } from '../types';

export interface ColumnarOptions {
    keyword: string;
    doubleTransposition?: boolean; // default false
    fillerChar?: string; // default 'X'
}

function getColumnOrder(keyword: string): number[] {
    // Example "APPLE" -> A:0, P:1 (first P), P:2 (second P), L:3, E:4
    // Sorted: A(0), E(4), L(3), P(1), P(2)
    // Order array represents which column index to read 1st, 2nd, 3rd, etc.

    const chars = keyword.split('').map((char, originalIndex) => ({ char, originalIndex }));
    chars.sort((a, b) => {
        if (a.char === b.char) return a.originalIndex - b.originalIndex; // Stable sort
        return a.char.localeCompare(b.char);
    });

    return chars.map(c => c.originalIndex);
}

function columnarEncryptSingle(plaintext: string, keyword: string, fillerChar: string = 'X', steps: string[]): { ciphertext: string, grid: string[][] } {
    const numCols = keyword.length;
    if (numCols === 0) return { ciphertext: plaintext, grid: [] };

    const order = getColumnOrder(keyword);
    steps.push(`Keyword "${keyword}" establishes column reading order: ${order.join(', ')}`);

    let text = plaintext;
    const remainder = text.length % numCols;
    if (remainder !== 0) {
        const padCount = numCols - remainder;
        const actualFiller = fillerChar || 'X';
        text += actualFiller.repeat(padCount);
        steps.push(`Padded with ${padCount} filler characters '${actualFiller}'.`);
    }

    const numRows = Math.ceil(text.length / numCols);
    const grid: string[][] = Array(numRows).fill(0).map(() => Array(numCols).fill(''));

    for (let i = 0; i < text.length; i++) {
        const r = Math.floor(i / numCols);
        const c = i % numCols;
        grid[r][c] = text[i];
    }

    let ciphertext = '';
    // Read downwards according to `order`
    for (const colIndex of order) {
        let colText = '';
        for (let r = 0; r < numRows; r++) {
            if (grid[r][colIndex]) colText += grid[r][colIndex];
        }
        ciphertext += colText;
    }

    return { ciphertext, grid };
}

function columnarDecryptSingle(ciphertext: string, keyword: string, steps: string[]): string {
    const numCols = keyword.length;
    if (numCols === 0) return ciphertext;

    const order = getColumnOrder(keyword);
    const numRows = Math.ceil(ciphertext.length / numCols);

    // Notice that if the grid is incomplete (no filler), some columns are shorter.
    // The first `remainder` columns (in original index) have length `numRows`.
    // The rest have length `numRows - 1`.
    const remainder = ciphertext.length % numCols;
    const colLengths = Array(numCols).fill(numRows - 1);
    if (remainder === 0) {
        colLengths.fill(numRows);
    } else {
        for (let i = 0; i < remainder; i++) {
            colLengths[i] = numRows; // the first `remainder` columns have an extra char
        }
    }

    // We read the ciphertext sequentially and fill the columns based on `order`.
    const grid: string[][] = Array(numRows).fill(0).map(() => Array(numCols).fill(''));
    let currentIndex = 0;

    for (const colIndex of order) {
        const len = colLengths[colIndex];
        for (let r = 0; r < len; r++) {
            grid[r][colIndex] = ciphertext[currentIndex++];
        }
    }

    // Read horizontally to get plaintext
    let plaintext = '';
    for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
            if (grid[r][c]) plaintext += grid[r][c];
        }
    }

    return plaintext;
}

export function columnarEncrypt(plaintext: string, options: ColumnarOptions): CipherResult {
    const { keyword, doubleTransposition = false, fillerChar = 'X' } = options;
    const steps: string[] = [];

    let { ciphertext, grid } = columnarEncryptSingle(plaintext, keyword, fillerChar, steps);

    if (doubleTransposition) {
        steps.push('Performing Double Transposition (second pass).');
        const result2 = columnarEncryptSingle(ciphertext, keyword, fillerChar, steps);
        ciphertext = result2.ciphertext;
    }

    return {
        plaintext,
        ciphertext,
        steps,
        meta: { keyword, grid }
    };
}

export function columnarDecrypt(ciphertext: string, options: ColumnarOptions): CipherResult {
    const { keyword, doubleTransposition = false } = options;
    const steps: string[] = [];

    let plaintext = ciphertext;

    if (doubleTransposition) {
        steps.push('Performing reverse of second transposition.');
        plaintext = columnarDecryptSingle(plaintext, keyword, steps);
    }

    steps.push(doubleTransposition ? 'Performing reverse of first transposition.' : 'Performing reverse transposition.');
    plaintext = columnarDecryptSingle(plaintext, keyword, steps);

    return {
        plaintext,
        ciphertext,
        steps,
        meta: { keyword }
    };
}
