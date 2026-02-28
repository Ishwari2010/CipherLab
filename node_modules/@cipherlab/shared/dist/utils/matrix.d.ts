export declare function mod(n: number, m: number): number;
export declare function gcd(a: number, b: number): number;
export declare function modInverse(a: number, m: number): number;
export type Matrix = number[][];
export declare function determinant(matrix: Matrix): number;
export declare function cofactor(matrix: Matrix, row: number, col: number): number;
export declare function adjugate(matrix: Matrix): Matrix;
export declare function invertMatrixMod26(matrix: Matrix): Matrix;
export declare function multiplyMatrixAndVectorMod26(matrix: Matrix, vector: number[]): number[];
