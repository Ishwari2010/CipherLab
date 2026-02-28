import { CipherResult } from '../types';
export interface VigenereOptions {
    key: string;
    variant?: 'classic' | 'autokey';
    preserveCase?: boolean;
    stripPunctuation?: boolean;
}
export declare function vigenereEncrypt(plaintext: string, options: VigenereOptions): CipherResult;
export declare function vigenereDecrypt(ciphertext: string, options: VigenereOptions): CipherResult;
export declare function calculateIC(text: string): number;
