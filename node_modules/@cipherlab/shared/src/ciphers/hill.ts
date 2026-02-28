import { CipherResult } from '../types';
import { Matrix, determinant, mod, gcd, invertMatrixMod26, multiplyMatrixAndVectorMod26 } from '../utils/matrix';

export interface HillOptions {
    keyMatrix: Matrix;
}

export function hillEncrypt(plaintext: string, options: HillOptions): CipherResult {
    const { keyMatrix } = options;
    const fillerChar = 'X';
    const steps: string[] = [];

    // Validate matrix
    const n = keyMatrix.length;
    if (n < 2) throw new Error('Key matrix must be at least 2x2');
    if (!keyMatrix.every(row => row.length === n)) throw new Error('Key matrix must be square');

    const det = mod(determinant(keyMatrix), 26);
    if (gcd(det, 26) !== 1) {
        throw new Error(`Invalid key: determinant (${det}) is not coprime with 26.`);
    }

    steps.push(`Key matrix is ${n}x${n}. Determinant mod 26 is ${det}, which is valid.`);

    // Prepare text
    let text = plaintext.replace(/[^A-Za-z]/g, '').toUpperCase();
    if (text.length % n !== 0) {
        const padCount = n - (text.length % n);
        text += fillerChar.toUpperCase().repeat(padCount);
        steps.push(`Padded plaintext with ${padCount} '${fillerChar.toUpperCase()}' characters to make length a multiple of ${n}.`);
    }

    let ciphertext = '';
    for (let i = 0; i < text.length; i += n) {
        const blockChars = text.slice(i, i + n);
        const vector = blockChars.split('').map(c => c.charCodeAt(0) - 65);
        const resultVector = multiplyMatrixAndVectorMod26(keyMatrix, vector);

        const resultChars = resultVector.map(v => String.fromCharCode(v + 65)).join('');
        ciphertext += resultChars;

        if (i === 0) {
            steps.push(`First block: [${vector.join(', ')}] * Matrix = [${resultVector.join(', ')}] -> ${resultChars}`);
        }
    }

    steps.push(`Encrypted all ${text.length / n} blocks.`);

    return {
        plaintext,
        ciphertext,
        steps,
        meta: { matrixSize: n, paddedLength: text.length }
    };
}

export function hillDecrypt(ciphertext: string, options: HillOptions): CipherResult {
    const { keyMatrix } = options;
    const steps: string[] = [];

    const n = keyMatrix.length;
    // Compute inverse
    let invMatrix: Matrix;
    try {
        invMatrix = invertMatrixMod26(keyMatrix);
        steps.push(`Calculated inverse matrix successfully.`);
    } catch (e: any) {
        throw new Error(`Cannot decrypt: ${e.message}`);
    }

    let text = ciphertext.replace(/[^A-Za-z]/g, '').toUpperCase();
    if (text.length % n !== 0) {
        throw new Error(`Ciphertext length (${text.length}) is not a multiple of matrix size (${n}).`);
    }

    let plaintext = '';
    for (let i = 0; i < text.length; i += n) {
        const blockChars = text.slice(i, i + n);
        const vector = blockChars.split('').map(c => c.charCodeAt(0) - 65);
        const resultVector = multiplyMatrixAndVectorMod26(invMatrix, vector);

        const resultChars = resultVector.map(v => String.fromCharCode(v + 65)).join('');
        plaintext += resultChars;

        if (i === 0) {
            steps.push(`First block: [${vector.join(', ')}] * InverseMatrix = [${resultVector.join(', ')}] -> ${resultChars}`);
        }
    }

    steps.push(`Decrypted all ${text.length / n} blocks.`);

    return {
        plaintext,
        ciphertext,
        steps,
        meta: { matrixSize: n }
    };
}
