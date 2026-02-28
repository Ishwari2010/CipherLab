"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vigenereEncrypt = vigenereEncrypt;
exports.vigenereDecrypt = vigenereDecrypt;
exports.calculateIC = calculateIC;
function vigenereEncrypt(plaintext, options) {
    const { key, variant = 'classic', preserveCase = true, stripPunctuation = false } = options;
    let text = plaintext;
    const steps = [];
    const cleanKey = key.replace(/[^A-Za-z]/g, '').toUpperCase();
    if (cleanKey.length === 0) {
        throw new Error('Vigenère key must contain at least one letter.');
    }
    if (stripPunctuation) {
        text = text.replace(/[^A-Za-z]/g, '');
        steps.push('Stripped punctuation and spaces from input.');
    }
    if (!preserveCase) {
        text = text.toUpperCase();
        steps.push('Converted input to uppercase.');
    }
    let ciphertext = '';
    let keyIndex = 0;
    let keystream = cleanKey;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (/[A-Za-z]/.test(char)) {
            const isUpper = char === char.toUpperCase();
            const base = isUpper ? 65 : 97;
            const ptCode = char.charCodeAt(0) - base;
            const shift = keystream[keyIndex].charCodeAt(0) - 65;
            const newCode = (ptCode + shift) % 26;
            ciphertext += String.fromCharCode(newCode + base);
            if (variant === 'autokey') {
                // Append the *plaintext* character's uppercase version to the keystream
                keystream += String.fromCharCode(ptCode + 65);
            }
            else {
                // Classic repeating key
                if (keyIndex === keystream.length - 1) {
                    keystream += keystream; // Extend the keystream dynamically
                }
            }
            keyIndex++;
        }
        else {
            ciphertext += char;
        }
    }
    steps.push(`Encrypted using ${variant === 'autokey' ? 'Autokey' : 'Classic'} Vigenère protocol.`);
    return {
        plaintext,
        ciphertext,
        steps,
        meta: { variant }
    };
}
function vigenereDecrypt(ciphertext, options) {
    const { key, variant = 'classic', preserveCase = true, stripPunctuation = false } = options;
    let text = ciphertext;
    const steps = [];
    const cleanKey = key.replace(/[^A-Za-z]/g, '').toUpperCase();
    if (cleanKey.length === 0) {
        throw new Error('Vigenère key must contain at least one letter.');
    }
    if (stripPunctuation) {
        text = text.replace(/[^A-Za-z]/g, '');
    }
    if (!preserveCase) {
        text = text.toUpperCase();
    }
    let plaintext = '';
    let keyIndex = 0;
    let keystream = cleanKey;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (/[A-Za-z]/.test(char)) {
            const isUpper = char === char.toUpperCase();
            const base = isUpper ? 65 : 97;
            const ctCode = char.charCodeAt(0) - base;
            const shift = keystream[keyIndex].charCodeAt(0) - 65;
            const newCode = (ctCode - shift + 26) % 26;
            const ptChar = String.fromCharCode(newCode + base);
            plaintext += ptChar;
            if (variant === 'autokey') {
                // Append the *recovered plaintext* character to the keystream
                keystream += String.fromCharCode(newCode + 65);
            }
            else {
                if (keyIndex === keystream.length - 1) {
                    keystream += keystream;
                }
            }
            keyIndex++;
        }
        else {
            plaintext += char;
        }
    }
    steps.push(`Decrypted using ${variant === 'autokey' ? 'Autokey' : 'Classic'} Vigenère protocol.`);
    return {
        plaintext,
        ciphertext,
        steps,
        meta: { variant }
    };
}
// Basic Index of Coincidence (IC) and Kasiski logic will be implemented here or in heuristics
function calculateIC(text) {
    const clean = text.replace(/[^A-Za-z]/g, '').toUpperCase();
    if (clean.length < 2)
        return 0;
    const counts = {};
    for (const c of clean)
        counts[c] = (counts[c] || 0) + 1;
    let sum = 0;
    const N = clean.length;
    for (const val of Object.values(counts)) {
        sum += val * (val - 1);
    }
    return sum / (N * (N - 1));
}
