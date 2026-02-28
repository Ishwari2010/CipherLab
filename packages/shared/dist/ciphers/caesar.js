"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.caesarEncrypt = caesarEncrypt;
exports.caesarDecrypt = caesarDecrypt;
exports.caesarBruteForce = caesarBruteForce;
function caesarEncrypt(plaintext, options) {
    const { shift, preserveCase = true, stripPunctuation = false } = options;
    let text = plaintext;
    const steps = [];
    if (stripPunctuation) {
        text = text.replace(/[^A-Za-z]/g, '');
        steps.push('Stripped punctation/spaces from input.');
    }
    if (!preserveCase) {
        text = text.toUpperCase();
        steps.push('Converted input to uppercase.');
    }
    const normalizedShift = ((shift % 26) + 26) % 26;
    steps.push(`Using effective shift of ${normalizedShift}.`);
    let ciphertext = '';
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (/[A-Z]/.test(char)) {
            const code = char.charCodeAt(0) - 65;
            const newChar = String.fromCharCode(((code + normalizedShift) % 26) + 65);
            ciphertext += newChar;
        }
        else if (/[a-z]/.test(char)) {
            const code = char.charCodeAt(0) - 97;
            const newChar = String.fromCharCode(((code + normalizedShift) % 26) + 97);
            ciphertext += newChar;
        }
        else {
            ciphertext += char;
        }
    }
    steps.push('Shifted each alphabetic character.');
    return {
        plaintext,
        ciphertext,
        steps,
        meta: { shift: normalizedShift }
    };
}
function caesarDecrypt(ciphertext, options) {
    const result = caesarEncrypt(ciphertext, {
        ...options,
        shift: -options.shift // Decryption is just negative shift
    });
    // Swap plaintext and ciphertext fields for semantic correctness
    return {
        plaintext: result.ciphertext,
        ciphertext: ciphertext,
        steps: ['To decrypt, we shift in the opposite direction.', ...result.steps],
        meta: { shift: options.shift }
    };
}
// Simple English letter frequencies for scoring (A-Z)
const englishFrequencies = [
    8.167, 1.492, 2.782, 4.253, 12.702, 2.228, 2.015, 6.094, 6.966,
    0.153, 0.772, 4.025, 2.406, 6.749, 7.507, 1.929, 0.095, 5.987,
    6.327, 9.056, 2.758, 0.978, 2.360, 0.150, 1.974, 0.074
];
function scoreText(text) {
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
function caesarBruteForce(ciphertext, options = {}) {
    const results = [];
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
