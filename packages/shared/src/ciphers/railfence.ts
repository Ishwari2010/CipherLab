import { CipherResult } from '../types';

export interface RailFenceOptions {
    rails: number;
    offset?: number; // default 0
}

export function railFenceEncrypt(plaintext: string, options: RailFenceOptions): CipherResult {
    const { rails, offset = 0 } = options;
    const steps: string[] = [];

    if (rails < 2) {
        return {
            plaintext,
            ciphertext: plaintext,
            steps: ['Rails count is less than 2, string is unchanged.'],
            meta: { rails, grid: [plaintext.split('')] }
        };
    }

    const cycleSize = 2 * rails - 2;
    const grid: string[][] = Array(rails).fill(0).map(() => []);

    for (let i = 0; i < plaintext.length; i++) {
        const effectiveIndex = (i + offset) % cycleSize;
        const row = effectiveIndex < rails ? effectiveIndex : cycleSize - effectiveIndex;
        grid[row].push(plaintext[i]);
    }

    let ciphertext = '';
    for (let r = 0; r < rails; r++) {
        ciphertext += grid[r].join('');
        steps.push(`Rail ${r + 1}: ${grid[r].join('')}`);
    }

    return {
        plaintext,
        ciphertext,
        steps,
        meta: { rails, grid }
    };
}

export function railFenceDecrypt(ciphertext: string, options: RailFenceOptions): CipherResult {
    const { rails, offset = 0 } = options;
    const steps: string[] = [];

    if (rails < 2) {
        return {
            plaintext: ciphertext,
            ciphertext,
            steps: ['Rails count is less than 2, string is unchanged.'],
            meta: { rails, grid: [ciphertext.split('')] }
        };
    }

    const cycleSize = 2 * rails - 2;
    const N = ciphertext.length;

    // Calculate how many characters belong to each rail
    const railLengths = Array(rails).fill(0);
    for (let i = 0; i < N; i++) {
        const effectiveIndex = (i + offset) % cycleSize;
        const row = effectiveIndex < rails ? effectiveIndex : cycleSize - effectiveIndex;
        railLengths[row]++;
    }

    // Reconstruct the rails from the ciphertext
    const grid: string[][] = Array(rails).fill(0).map(() => []);
    let currentIndex = 0;
    for (let r = 0; r < rails; r++) {
        const len = railLengths[r];
        const segment = ciphertext.slice(currentIndex, currentIndex + len);
        grid[r] = segment.split('');
        currentIndex += len;
        steps.push(`Reconstructed Rail ${r + 1}: ${segment}`);
    }

    // Read off the zig-zag to get plaintext
    let plaintext = '';
    const railPointers = Array(rails).fill(0);

    for (let i = 0; i < N; i++) {
        const effectiveIndex = (i + offset) % cycleSize;
        const row = effectiveIndex < rails ? effectiveIndex : cycleSize - effectiveIndex;
        plaintext += grid[row][railPointers[row]] || '';
        railPointers[row]++;
    }

    return {
        plaintext,
        ciphertext,
        steps,
        meta: { rails, grid }
    };
}
