import { CipherResult } from '../types';
export interface PlayfairOptions {
    key: string;
    fillerChar?: string;
}
export declare function generatePlayfairGrid(key: string): string[][];
export declare function playfairEncrypt(plaintext: string, options: PlayfairOptions): CipherResult;
export declare function playfairDecrypt(ciphertext: string, options: PlayfairOptions): CipherResult;
