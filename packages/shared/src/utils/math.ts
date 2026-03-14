// Utility functions for Public Key Cryptography using BigInt

/**
 * Calculates the Greatest Common Divisor (GCD) of two BigInts.
 */
export function gcd(a: bigint, b: bigint): bigint {
    a = a < 0n ? -a : a;
    b = b < 0n ? -b : b;
    while (b !== 0n) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

/**
 * Calculates base^exp % mod efficiently using the right-to-left binary method.
 */
export function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
    if (mod === 1n) return 0n;
    let result = 1n;
    base = base % mod;
    while (exp > 0n) {
        if (exp % 2n === 1n) {
            result = (result * base) % mod;
        }
        exp = exp / 2n;
        base = (base * base) % mod;
    }
    return result;
}

/**
 * Extended Euclidean Algorithm to find the modular multiplicative inverse.
 * Returns d such that (a * d) % m === 1n.
 * Throws an error if the inverse does not exist.
 */
export function modInverse(a: bigint, m: bigint): bigint {
    let [t, newT] = [0n, 1n];
    let [r, newR] = [m, a];

    while (newR !== 0n) {
        const quotient = r / newR;
        [t, newT] = [newT, t - quotient * newT];
        [r, newR] = [newR, r - quotient * newR];
    }

    if (r > 1n) {
        throw new Error(`a and m are not coprime (gcd is ${r}, expected 1). Inverse does not exist.`);
    }

    if (t < 0n) {
        t += m;
    }

    return t;
}

/**
 * A basic deterministic primality test for reasonably sized integers.
 * Uses BigInt math but optimizes for small numbers since we are taking user input.
 */
export function isPrime(n: bigint): boolean {
    if (n <= 1n) return false;
    if (n <= 3n) return true;
    if (n % 2n === 0n || n % 3n === 0n) return false;

    for (let i = 5n; i * i <= n; i += 6n) {
        if (n % i === 0n || n % (i + 2n) === 0n) {
            return false;
        }
    }
    return true;
}
