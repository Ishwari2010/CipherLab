import { CipherResult, Step } from '../types';

export interface CaesarOptions {
    shift: number;
    preserveCase?: boolean;     // default: true
    stripPunctuation?: boolean; // default: false
}

export function caesarEncrypt(plaintext: string, options: CaesarOptions): CipherResult {
    const { shift, preserveCase = true, stripPunctuation = false } = options;
    let text = plaintext;
    const steps: Step[] = [];
    let stepNumber = 1;

    steps.push({
        stepNumber: stepNumber++,
        title: 'Original Input',
        explanation: `Original text: "${plaintext}"`
    });

    if (stripPunctuation) {
        text = text.replace(/[^A-Za-z]/g, '');
        steps.push({
            stepNumber: stepNumber++,
            title: 'Strip Punctuation',
            explanation: `Stripped punctuation/spaces from input: "${text}"`
        });
    }

    if (!preserveCase) {
        text = text.toUpperCase();
        steps.push({
            stepNumber: stepNumber++,
            title: 'Convert Case',
            explanation: `Converted input to uppercase: "${text}"`
        });
    }

    const normalizedShift = ((shift % 26) + 26) % 26;
    steps.push({
        stepNumber: stepNumber++,
        title: 'Shift Value',
        explanation: `Using shift value of ${normalizedShift}.`
    });

    let ciphertext = '';
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (/[A-Z]/.test(char)) {
            const code = char.charCodeAt(0) - 65;
            const newCode = (code + normalizedShift) % 26;
            const newChar = String.fromCharCode(newCode + 65);
            ciphertext += newChar;
            steps.push({
                stepNumber: stepNumber++,
                title: `Transforming '${char}'`,
                explanation: `Original letter: '${char}'\nAlphabet index: ${code} (A=0, B=1, ...)\nFormula used: (${code} + ${normalizedShift}) % 26 = ${newCode}\nNew index: ${newCode}\nResulting letter: '${newChar}'`
            });
        } else if (/[a-z]/.test(char)) {
            const code = char.charCodeAt(0) - 97;
            const newCode = (code + normalizedShift) % 26;
            const newChar = String.fromCharCode(newCode + 97);
            ciphertext += newChar;
            steps.push({
                stepNumber: stepNumber++,
                title: `Transforming '${char}'`,
                explanation: `Original letter: '${char}'\nAlphabet index: ${code} (a=0, b=1, ...)\nFormula used: (${code} + ${normalizedShift}) % 26 = ${newCode}\nNew index: ${newCode}\nResulting letter: '${newChar}'`
            });
        } else {
            ciphertext += char;
            steps.push({
                stepNumber: stepNumber++,
                title: `Skipping '${char}'`,
                explanation: `Character '${char}' is not alphabetic, so it remains unchanged.`
            });
        }
    }

    steps.push({
        stepNumber: stepNumber++,
        title: 'Final Result',
        explanation: `Final output: "${ciphertext}"`
    });

    return {
        plaintext,
        ciphertext,
        steps,
        meta: { shift: normalizedShift }
    };
}

export function caesarDecrypt(ciphertext: string, options: CaesarOptions): CipherResult {
    const result = caesarEncrypt(ciphertext, {
        ...options,
        shift: -options.shift // Decryption is just negative shift
    });
    // Swap plaintext and ciphertext fields for semantic correctness
    return {
        plaintext: result.ciphertext,
        ciphertext: ciphertext,
        steps: [
            {
                stepNumber: 1,
                title: 'Decryption Setup',
                explanation: `To decrypt, we reverse the shift direction using an opposite shift value.`
            },
            ...result.steps.map(s => ({ ...s, stepNumber: s.stepNumber + 1 }))
        ],
        meta: { shift: options.shift }
    };
}

// Simple English letter frequencies for scoring (A-Z)
const englishFrequencies = [
    8.167, 1.492, 2.782, 4.253, 12.702, 2.228, 2.015, 6.094, 6.966,
    0.153, 0.772, 4.025, 2.406, 6.749, 7.507, 1.929, 0.095, 5.987,
    6.327, 9.056, 2.758, 0.978, 2.360, 0.150, 1.974, 0.074
];

function scoreText(text: string): number {
    let score = 0;
    let letterCount = 0;
    for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        // Uppercase
        if (charCode >= 65 && charCode <= 90) {
            score += englishFrequencies[charCode - 65];
            letterCount++;
        }
        // Lowercase
        else if (charCode >= 97 && charCode <= 122) {
            score += englishFrequencies[charCode - 97];
            letterCount++;
        }
    }
    return letterCount > 0 ? score / letterCount : 0;
}

export interface BruteForceResult {
    shift: number;
    plaintext: string;
    score: number;
}

export function caesarBruteForce(ciphertext: string, options: Omit<CaesarOptions, 'shift'> = {}): BruteForceResult[] {
    const results: BruteForceResult[] = [];

    for (let shift = 0; shift < 26; shift++) {
        const pt = caesarDecrypt(ciphertext, { ...options, shift }).plaintext;
        results.push({
            shift,
            plaintext: pt,
            score: scoreText(pt)
        });
    }

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);
    return results;
}
