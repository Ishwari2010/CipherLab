import { CipherResult } from '../types';
export interface ColumnarOptions {
    keyword: string;
    doubleTransposition?: boolean;
    fillerChar?: string;
}
export declare function columnarEncrypt(plaintext: string, options: ColumnarOptions): CipherResult;
export declare function columnarDecrypt(ciphertext: string, options: ColumnarOptions): CipherResult;
