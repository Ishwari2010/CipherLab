import { CipherResult } from '../types';
export interface CaesarOptions {
    shift: number;
    preserveCase?: boolean;
    stripPunctuation?: boolean;
}
export declare function caesarEncrypt(plaintext: string, options: CaesarOptions): CipherResult;
export declare function caesarDecrypt(ciphertext: string, options: CaesarOptions): CipherResult;
export interface BruteForceResult {
    shift: number;
    plaintext: string;
    score: number;
}
export declare function caesarBruteForce(ciphertext: string, options?: Omit<CaesarOptions, 'shift'>): BruteForceResult[];
