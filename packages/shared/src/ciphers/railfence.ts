import { CipherResult, Step } from '../types';

export interface RailFenceOptions {
    rails: number;
    offset?: number; // default 0
}

export function railFenceEncrypt(plaintext: string, options: RailFenceOptions): CipherResult {
    const { rails, offset = 0 } = options;
    const steps: Step[] = [];
    let stepNumber = 1;

    if (rails < 2) {
        return {
            plaintext,
            ciphertext: plaintext,
            steps: [{
                stepNumber: 1,
                title: 'No Encryption',
                explanation: 'Rails count is less than 2, string is unchanged.'
            }],
            meta: { rails, grid: [plaintext.split('')] }
        };
    }

    steps.push({
        stepNumber: stepNumber++,
        title: 'Initialization',
        explanation: `Using ${rails} rails. Characters will be placed in a zig-zag pattern across these rails.`
    });

    const cycleSize = 2 * rails - 2;
    const grid: string[][] = Array(rails).fill(0).map(() => []);

    for (let i = 0; i < plaintext.length; i++) {
        const effectiveIndex = (i + offset) % cycleSize;
        const row = effectiveIndex < rails ? effectiveIndex : cycleSize - effectiveIndex;
        grid[row].push(plaintext[i]);
    }

    let ciphertext = '';
    for (let r = 0; r < rails; r++) {
        const railContent = grid[r].join('');
        ciphertext += railContent;
        steps.push({
            stepNumber: stepNumber++,
            title: `Reading Rail ${r + 1}`,
            explanation: `Rail ${r + 1} accumulates characters: "${railContent}"`
        });
    }

    steps.push({
        stepNumber: stepNumber++,
        title: 'Final Concatenation',
        explanation: `Concatenating all rails from top to bottom results in: "${ciphertext}"`
    });

    return {
        plaintext,
        ciphertext,
        steps,
        meta: { rails, grid }
    };
}

export function railFenceDecrypt(ciphertext: string, options: RailFenceOptions): CipherResult {
    const { rails, offset = 0 } = options;
    const steps: Step[] = [];
    let stepNumber = 1;

    if (rails < 2) {
        return {
            plaintext: ciphertext,
            ciphertext,
            steps: [{
                stepNumber: 1,
                title: 'No Decryption',
                explanation: 'Rails count is less than 2, string is unchanged.'
            }],
            meta: { rails, grid: [ciphertext.split('')] }
        };
    }

    steps.push({
        stepNumber: stepNumber++,
        title: 'Initialization',
        explanation: `Using ${rails} rails. Reconstructing the zig-zag pattern to determine how many characters belong to each rail.`
    });

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
        steps.push({
            stepNumber: stepNumber++,
            title: `Reconstructing Rail ${r + 1}`,
            explanation: `Based on ciphertext length and zig-zag pattern, rail ${r + 1} gets ${len} characters: "${segment}"`
        });
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

    steps.push({
        stepNumber: stepNumber++,
        title: 'Reading Zig-Zag',
        explanation: `Reading characters from the reconstructed rails following the zig-zag pattern yields the original plaintext: "${plaintext}"`
    });

    return {
        plaintext,
        ciphertext,
        steps,
        meta: { rails, grid }
    };
}
