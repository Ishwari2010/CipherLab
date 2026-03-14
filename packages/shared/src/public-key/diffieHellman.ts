import type { CipherResult, Step } from '../types';
import { isPrime, modPow } from '../utils/math';

export interface DiffieHellmanOptions {
    p: number;
    g: number;
    a: number;
    b: number;
}

/**
 * Validates and executes a Diffie-Hellman key exchange cycle,
 * producing step-by-step mathematical tracing for educational purposes.
 */
export function diffieHellmanProcess(options: DiffieHellmanOptions): CipherResult {
    const steps: Step[] = [];
    const p = BigInt(options.p);
    const g = BigInt(options.g);
    const a = BigInt(options.a);
    const b = BigInt(options.b);

    // 1. Validate Primes and Generators
    steps.push({
        stepNumber: 1,
        title: 'Validate Public Parameters',
        explanation: `Checking if modulus p=${p} is a prime number and generator g=${g} is valid.`
    });

    if (!isPrime(p)) {
        throw new Error(`Invalid input: Modulus p (${p}) is not a prime number. Diffie-Hellman requires a prime modulus.`);
    }

    if (g >= p || g <= 1n) {
        throw new Error(`Invalid input: Generator g (${g}) must be greater than 1 and less than prime p (${p}).`);
    }

    // 2. User A: Compute Public Key
    const A = modPow(g, a, p);
    steps.push({
        stepNumber: 2,
        title: 'User A calculates Public Key A',
        explanation: `User A chooses secret key a=${a}\nA = g^a mod p\nA = ${g}^${a} mod ${p} = ${A}`
    });

    // 3. User B: Compute Public Key
    const B = modPow(g, b, p);
    steps.push({
        stepNumber: 3,
        title: 'User B calculates Public Key B',
        explanation: `User B chooses secret key b=${b}\nB = g^b mod p\nB = ${g}^${b} mod ${p} = ${B}`
    });

    // 4. User A: Compute Shared Secret
    const sharedSecretA = modPow(B, a, p);
    steps.push({
        stepNumber: 4,
        title: 'User A calculates Shared Key (K)',
        explanation: `User A receives Public Key B=${B}\nK = B^a mod p\nK = ${B}^${a} mod ${p} = ${sharedSecretA}`
    });

    // 5. User B: Compute Shared Secret
    const sharedSecretB = modPow(A, b, p);
    steps.push({
        stepNumber: 5,
        title: 'User B calculates Shared Key (K)',
        explanation: `User B receives Public Key A=${A}\nK = A^b mod p\nK = ${A}^${b} mod ${p} = ${sharedSecretB}`
    });

    // 6. Verification
    steps.push({
        stepNumber: 6,
        title: 'Verification',
        explanation: `Both participants have derived the same shared secret: ${sharedSecretA}\n(A^b mod p === B^a mod p)`
    });

    return {
        plaintext: `Shared Secret Key: ${sharedSecretA}`,
        ciphertext: `Shared Secret Key: ${sharedSecretB}`,
        steps,
        meta: { p: p.toString(), g: g.toString(), a: a.toString(), b: b.toString(), A: A.toString(), B: B.toString(), K: sharedSecretA.toString() }
    };
}
