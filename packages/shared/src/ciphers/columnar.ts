import { CipherResult, Step } from '../types';

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

function columnarEncryptSingle(plaintext: string, keyword: string, fillerChar: string = 'X', steps: Step[], stepNumber: { current: number }): { ciphertext: string, grid: string[][] } {
    const numCols = keyword.length;
    if (numCols === 0) return { ciphertext: plaintext, grid: [] };

    const order = getColumnOrder(keyword);
    steps.push({
        stepNumber: stepNumber.current++,
        title: 'Determine Column Order',
        explanation: `Keyword "${keyword}" establishes column reading order: ${order.join(', ')}`
    });

    let text = plaintext;
    const remainder = text.length % numCols;
    if (remainder !== 0) {
        const padCount = numCols - remainder;
        const actualFiller = fillerChar || 'X';
        text += actualFiller.repeat(padCount);
        steps.push({
            stepNumber: stepNumber.current++,
            title: 'Padding',
            explanation: `Padded with ${padCount} filler character(s) '${actualFiller}' to complete the grid. Text is now: "${text}"`
        });
    }

    const numRows = Math.ceil(text.length / numCols);
    const grid: string[][] = Array(numRows).fill(0).map(() => Array(numCols).fill(''));

    for (let i = 0; i < text.length; i++) {
        const r = Math.floor(i / numCols);
        const c = i % numCols;
        grid[r][c] = text[i];
    }

    steps.push({
        stepNumber: stepNumber.current++,
        title: 'Grid Creation',
        explanation: `Filled the grid row by row:\n${grid.map(row => row.join(' ')).join('\n')}`
    });

    let ciphertext = '';
    // Read downwards according to `order`
    for (const colIndex of order) {
        let colText = '';
        for (let r = 0; r < numRows; r++) {
            if (grid[r][colIndex]) colText += grid[r][colIndex];
        }
        ciphertext += colText;
        steps.push({
            stepNumber: stepNumber.current++,
            title: `Reading Column ${colIndex + 1}`,
            explanation: `Reading downwards from column ${colIndex + 1} (character '${keyword[colIndex]}'): "${colText}"`
        });
    }

    return { ciphertext, grid };
}

function columnarDecryptSingle(ciphertext: string, keyword: string, steps: Step[], stepNumber: { current: number }): string {
    const numCols = keyword.length;
    if (numCols === 0) return ciphertext;

    const order = getColumnOrder(keyword);
    steps.push({
        stepNumber: stepNumber.current++,
        title: 'Determine Column Order',
        explanation: `Keyword "${keyword}" establishes column order for filling: ${order.join(', ')}`
    });

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
        steps.push({
            stepNumber: stepNumber.current++,
            title: `Filling Column ${colIndex + 1}`,
            explanation: `Extracted ${len} characters and filled column ${colIndex + 1} downwards.`
        });
    }

    steps.push({
        stepNumber: stepNumber.current++,
        title: 'Reconstructed Grid',
        explanation: `The completely reconstructed grid is:\n${grid.map(row => row.join(' ')).join('\n')}`
    });

    // Read horizontally to get plaintext
    let plaintext = '';
    for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
            if (grid[r][c]) plaintext += grid[r][c];
        }
    }

    steps.push({
        stepNumber: stepNumber.current++,
        title: 'Reading Rows',
        explanation: `Reading the horizontal rows reconstructs the text: "${plaintext}"`
    });

    return plaintext;
}

export function columnarEncrypt(plaintext: string, options: ColumnarOptions): CipherResult {
    const { keyword, doubleTransposition = false, fillerChar = 'X' } = options;
    const steps: Step[] = [];
    let stepNumber = { current: 1 };

    let { ciphertext, grid } = columnarEncryptSingle(plaintext, keyword, fillerChar, steps, stepNumber);

    if (doubleTransposition) {
        steps.push({
            stepNumber: stepNumber.current++,
            title: 'Double Transposition Start',
            explanation: 'Performing Double Transposition: running the output through the cipher a second time.'
        });
        const result2 = columnarEncryptSingle(ciphertext, keyword, fillerChar, steps, stepNumber);
        ciphertext = result2.ciphertext;
    }

    steps.push({
        stepNumber: stepNumber.current++,
        title: 'Final Result',
        explanation: `Final ciphertext: "${ciphertext}"`
    });

    return {
        plaintext,
        ciphertext,
        steps,
        meta: { keyword, grid }
    };
}

export function columnarDecrypt(ciphertext: string, options: ColumnarOptions): CipherResult {
    const { keyword, doubleTransposition = false } = options;
    const steps: Step[] = [];
    let stepNumber = { current: 1 };

    let plaintext = ciphertext;

    if (doubleTransposition) {
        steps.push({
            stepNumber: stepNumber.current++,
            title: 'Double Transposition Start',
            explanation: 'Performing reverse of second transposition first.'
        });
        plaintext = columnarDecryptSingle(plaintext, keyword, steps, stepNumber);
        steps.push({
            stepNumber: stepNumber.current++,
            title: 'Second Reverse',
            explanation: 'Performing reverse of first transposition.'
        });
    } else {
        steps.push({
            stepNumber: stepNumber.current++,
            title: 'Reverse Transposition Start',
            explanation: 'Performing reverse transposition on the grid.'
        });
    }

    plaintext = columnarDecryptSingle(plaintext, keyword, steps, stepNumber);

    steps.push({
        stepNumber: stepNumber.current++,
        title: 'Final Result',
        explanation: `Final plaintext: "${plaintext}"`
    });

    return {
        plaintext,
        ciphertext,
        steps,
        meta: { keyword }
    };
}
