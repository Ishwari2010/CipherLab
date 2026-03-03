import { CipherResult, Step } from '../types';
import { Matrix, determinant, mod, gcd, invertMatrixMod26, multiplyMatrixAndVectorMod26 } from '../utils/matrix';

export interface HillOptions {
    keyMatrix: Matrix;
}

export function hillEncrypt(plaintext: string, options: HillOptions): CipherResult {
    const { keyMatrix } = options;
    const fillerChar = 'X';
    const steps: Step[] = [];
    let stepNumber = 1;

    // Validate matrix
    const n = keyMatrix.length;
    if (n < 2) throw new Error('Key matrix must be at least 2x2');
    if (!keyMatrix.every(row => row.length === n)) throw new Error('Key matrix must be square');

    const det = mod(determinant(keyMatrix), 26);
    if (gcd(det, 26) !== 1) {
        throw new Error(`Invalid key: determinant (${det}) is not coprime with 26.`);
    }

    steps.push({
        stepNumber: stepNumber++,
        title: 'Key Matrix',
        explanation: `Using validated ${n}x${n} key matrix (determinant ${det} is coprime with 26):\n[${keyMatrix.map(row => '[' + row.join(', ') + ']').join(',\n ')}]`
    });

    // Prepare text
    let text = plaintext.replace(/[^A-Za-z]/g, '').toUpperCase();
    if (text.length % n !== 0) {
        const padCount = n - (text.length % n);
        text += fillerChar.toUpperCase().repeat(padCount);
        steps.push({
            stepNumber: stepNumber++,
            title: 'Padding Input',
            explanation: `Padded plaintext with ${padCount} '${fillerChar.toUpperCase()}' character(s) to make length a multiple of ${n}. Adjusted text: "${text}"`
        });
    }

    let ciphertext = '';
    for (let i = 0; i < text.length; i += n) {
        const blockChars = text.slice(i, i + n);
        const vector = blockChars.split('').map(c => c.charCodeAt(0) - 65);
        const resultVector = multiplyMatrixAndVectorMod26(keyMatrix, vector);

        const resultChars = resultVector.map(v => String.fromCharCode(v + 65)).join('');
        ciphertext += resultChars;

        steps.push({
            stepNumber: stepNumber++,
            title: `Encrypting Block: "${blockChars}"`,
            explanation: `1. Convert to numeric vector: [${vector.join(', ')}]\n2. Matrix multiplication and Mod 26 reduction: Matrix * [${vector.join(', ')}] = [${resultVector.join(', ')}] (mod 26)\n3. Convert back to letters: "${resultChars}"`
        });
    }

    steps.push({
        stepNumber: stepNumber++,
        title: 'Final Result',
        explanation: `Final concatenated ciphertext: "${ciphertext}"`
    });

    return {
        plaintext,
        ciphertext,
        steps,
        meta: { matrixSize: n, paddedLength: text.length }
    };
}

export function hillDecrypt(ciphertext: string, options: HillOptions): CipherResult {
    const { keyMatrix } = options;
    const steps: Step[] = [];
    let stepNumber = 1;

    const n = keyMatrix.length;
    // Compute inverse
    let invMatrix: Matrix;
    try {
        invMatrix = invertMatrixMod26(keyMatrix);
        steps.push({
            stepNumber: stepNumber++,
            title: 'Inverse Key Matrix',
            explanation: `Calculated inverse matrix successfully:\n[${invMatrix.map(row => '[' + row.join(', ') + ']').join(',\n ')}]`
        });
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

        steps.push({
            stepNumber: stepNumber++,
            title: `Decrypting Block: "${blockChars}"`,
            explanation: `1. Convert to numeric vector: [${vector.join(', ')}]\n2. Inverse matrix multiplication and Mod 26 reduction: InverseMatrix * [${vector.join(', ')}] = [${resultVector.join(', ')}] (mod 26)\n3. Convert back to letters: "${resultChars}"`
        });
    }

    steps.push({
        stepNumber: stepNumber++,
        title: 'Final Result',
        explanation: `Final concatenated plaintext: "${plaintext}"`
    });

    return {
        plaintext,
        ciphertext,
        steps,
        meta: { matrixSize: n }
    };
}
