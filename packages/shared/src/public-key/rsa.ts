import type { CipherResult, Step } from '../types';
import { gcd, isPrime, modInverse, modPow } from '../utils/math';

export interface RSAResult {
    n: string;
    phi: string;
    d: string;
    encrypted: string;
    decrypted: string;
    steps: Step[];
}

/**
 * Validates and executes an RSA algorithm encryption/decryption cycle,
 * producing step-by-step mathematical tracing for educational purposes.
 */
export function rsaProcess(p: bigint, q: bigint, e: bigint, m: bigint): RSAResult {
    const steps: Step[] = [];

    // 1. Validate Primes
    steps.push({
        stepNumber: 1,
        title: 'Validate Prime Inputs',
        explanation: `Checking if p=${p} and q=${q} are prime numbers.`
    });

    if (!isPrime(p)) {
        throw new Error(`Invalid input: p (${p}) is not a prime number.`);
    }
    if (!isPrime(q)) {
        throw new Error(`Invalid input: q (${q}) is not a prime number.`);
    }

    // 2. Compute Modulus (n)
    const n = p * q;
    steps.push({
        stepNumber: 2,
        title: 'Compute Modulus (n)',
        explanation: `n = p × q\nn = ${p} × ${q} = ${n}`
    });

    if (m >= n) {
        throw new Error(`Message m (${m}) must be smaller than modulus n (${n}) to prevent data loss during encryption.`);
    }

    // 3. Compute Totient Phi(n)
    const phi = (p - 1n) * (q - 1n);
    steps.push({
        stepNumber: 3,
        title: 'Compute Euler\'s Totient φ(n)',
        explanation: `φ(n) = (p - 1) × (q - 1)\nφ(n) = (${p} - 1) × (${q} - 1) = ${phi}`
    });

    // 4. Validate Public Exponent (e)
    steps.push({
        stepNumber: 4,
        title: 'Validate Public Exponent (e)',
        explanation: `Checking if 'e' is coprime to φ(n). We need gcd(e, φ(n)) = 1.\ngcd(${e}, ${phi}) = ${gcd(e, phi)}`
    });

    if (gcd(e, phi) !== 1n) {
        throw new Error(`Invalid Public Exponent: gcd(e, φ(n)) must be 1. Currently gcd(${e}, ${phi}) = ${gcd(e, phi)}`);
    }

    // 5. Calculate Private Key (d)
    const d = modInverse(e, phi);
    steps.push({
        stepNumber: 5,
        title: 'Compute Private Key (d)',
        explanation: `Find modular multiplicative inverse 'd' such that:\n(d × e) mod φ(n) = 1\nd = ${e}^-1 mod ${phi}\nd = ${d}`
    });

    // 6. Encrypt Message
    const c = modPow(m, e, n);
    steps.push({
        stepNumber: 6,
        title: 'Encrypt Message (c)',
        explanation: `c = m^e mod n\nc = ${m}^${e} mod ${n}\nCiphertext (c) = ${c}`
    });

    // 7. Verify Decryption
    const mDecrypted = modPow(c, d, n);
    steps.push({
        stepNumber: 7,
        title: 'Verify Decryption',
        explanation: `m = c^d mod n\nm = ${c}^${d} mod ${n}\nDecrypted m = ${mDecrypted}`
    });

    return {
        n: n.toString(),
        phi: phi.toString(),
        d: d.toString(),
        encrypted: c.toString(),
        decrypted: mDecrypted.toString(),
        steps
    };
}
