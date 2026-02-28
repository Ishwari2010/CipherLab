import { hillEncrypt, hillDecrypt } from './packages/shared/src/ciphers/hill.ts';
import { determinant, gcd } from './packages/shared/src/utils/matrix.ts';

function runVector(name, matrix, plaintext) {
    try {
        console.log(`\nVector ${name}`);
        const enc = hillEncrypt(plaintext, { keyMatrix: matrix });
        console.log(`Encrypt ${plaintext} -> ${enc.ciphertext}`);
        const dec = hillDecrypt(enc.ciphertext, { keyMatrix: matrix });
        console.log(`Decrypt ${enc.ciphertext} -> ${dec.plaintext}`);
    } catch (e) {
        console.log(`Error on ${name}: ${e.message}`);
    }
}

// Ensure tsx is available to run this
// Usage: npx tsx /tmp/test-hill.ts
runVector('A', [[3,3],[2,5]], 'HELP');
runVector('B', [[6,24],[1,13]], 'TEST');
