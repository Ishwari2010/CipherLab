"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mod = mod;
exports.gcd = gcd;
exports.modInverse = modInverse;
exports.determinant = determinant;
exports.cofactor = cofactor;
exports.adjugate = adjugate;
exports.invertMatrixMod26 = invertMatrixMod26;
exports.multiplyMatrixAndVectorMod26 = multiplyMatrixAndVectorMod26;
function mod(n, m) {
    return ((n % m) + m) % m;
}
function gcd(a, b) {
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
function modInverse(a, m) {
    a = mod(a, m);
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) {
            return x;
        }
    }
    return -1; // No modular inverse exists
}
function determinant(matrix) {
    const n = matrix.length;
    if (n === 1)
        return matrix[0][0];
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
function cofactor(matrix, row, col) {
    const subMatrix = matrix.filter((_, r) => r !== row).map(r => r.filter((_, c) => c !== col));
    const sign = (row + col) % 2 === 0 ? 1 : -1;
    return sign * determinant(subMatrix);
}
function adjugate(matrix) {
    const n = matrix.length;
    if (n === 1)
        return [[1]];
    const adj = Array(n).fill(0).map(() => Array(n).fill(0));
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            adj[c][r] = cofactor(matrix, r, c); // Note the transposition (c, r)
        }
    }
    return adj;
}
function invertMatrixMod26(matrix) {
    const n = matrix.length;
    const det = mod(determinant(matrix), 26);
    if (gcd(det, 26) !== 1) {
        throw new Error(`Matrix is not invertible mod 26. Determinant is ${det}, which is not coprime with 26.`);
    }
    const invDet = modInverse(det, 26);
    const adj = adjugate(matrix);
    const inv = Array(n).fill(0).map(() => Array(n).fill(0));
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            inv[r][c] = mod(adj[r][c] * invDet, 26);
        }
    }
    return inv;
}
function multiplyMatrixAndVectorMod26(matrix, vector) {
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
