export function mod(n: number, m: number): number {
    return ((n % m) + m) % m;
}

export function gcd(a: number, b: number): number {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b > 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// Extended Euclidean Algorithm to find modular inverse
export function modInverse(a: number, m: number): number {
    a = mod(a, m);
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) {
            return x;
        }
    }
    return -1; // No modular inverse exists
}

export type Matrix = number[][];

export function determinant(matrix: Matrix): number {
    const n = matrix.length;
    if (n === 1) return matrix[0][0];
    if (n === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }

    let det = 0;
    for (let j = 0; j < n; j++) {
        const subMatrix = matrix.slice(1).map(row => row.filter((_, colIndex) => colIndex !== j));
        const sign = j % 2 === 0 ? 1 : -1;
        det += sign * matrix[0][j] * determinant(subMatrix);
    }
    return det;
}

export function cofactor(matrix: Matrix, row: number, col: number): number {
    const subMatrix = matrix.filter((_, r) => r !== row).map(r => r.filter((_, c) => c !== col));
    const sign = (row + col) % 2 === 0 ? 1 : -1;
    return sign * determinant(subMatrix);
}

export function adjugate(matrix: Matrix): Matrix {
    const n = matrix.length;
    if (n === 1) return [[1]];

    const adj: Matrix = Array(n).fill(0).map(() => Array(n).fill(0));
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            adj[c][r] = cofactor(matrix, r, c); // Note the transposition (c, r)
        }
    }
    return adj;
}

export function invertMatrixMod26(matrix: Matrix): Matrix {
    const n = matrix.length;
    const det = mod(determinant(matrix), 26);

    if (gcd(det, 26) !== 1) {
        throw new Error(`Matrix is not invertible mod 26. Determinant is ${det}, which is not coprime with 26.`);
    }

    const invDet = modInverse(det, 26);
    const adj = adjugate(matrix);

    const inv: Matrix = Array(n).fill(0).map(() => Array(n).fill(0));
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            inv[r][c] = mod(adj[r][c] * invDet, 26);
        }
    }

    return inv;
}

export function multiplyMatrixAndVectorMod26(matrix: Matrix, vector: number[]): number[] {
    const n = matrix.length;
    const result = Array(n).fill(0);
    for (let r = 0; r < n; r++) {
        let sum = 0;
        for (let c = 0; c < n; c++) {
            sum += matrix[r][c] * vector[c];
        }
        result[r] = mod(sum, 26);
    }
    return result;
}
