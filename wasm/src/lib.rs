use wasm_bindgen::prelude::*;
use js_sys::BigInt;
use std::convert::TryInto;

// 素因数分解を行う関数
#[wasm_bindgen]
pub fn factorize(n_bigint: BigInt) -> Vec<u64> {
    let mut n = n_bigint.try_into().unwrap_or(0);
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