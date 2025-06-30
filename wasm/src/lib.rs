use wasm_bindgen::prelude::*;

// 素因数分解を行う関数
#[wasm_bindgen]
pub fn factorize(mut n: u64) -> Vec<u64> {
    let mut factors = Vec::new();
    let mut d = 2;
    while d * d <= n {
        while n % d == 0 {
            factors.push(d);
            n /= d;
        }
        d += 1;
    }
    if n > 1 {
        factors.push(n);
    }
    factors
}