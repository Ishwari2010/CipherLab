import { CipherResult } from '../types';
import { Matrix } from '../utils/matrix';
export interface HillOptions {
    keyMatrix: Matrix;
    fillerChar?: string;
}
export declare function hillEncrypt(plaintext: string, options: HillOptions): CipherResult;
export declare function hillDecrypt(ciphertext: string, options: HillOptions): CipherResult;
