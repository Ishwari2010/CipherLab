import { CipherResult } from '../types';
export interface RailFenceOptions {
    rails: number;
    offset?: number;
}
export declare function railFenceEncrypt(plaintext: string, options: RailFenceOptions): CipherResult;
export declare function railFenceDecrypt(ciphertext: string, options: RailFenceOptions): CipherResult;
