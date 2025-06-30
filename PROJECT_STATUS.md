# プロジェクト開発手順サマリー

本ドキュメントは、「WASM vs JS 素因数分解パフォーマンス評価」プロジェクトの主要な開発手順と、関連するコマンドやコードスニペットをまとめたものです。

## 1. 環境構築

- **フロントエンド (Vite + React)**: `npm create vite` を使用して、TypeScript ベースの React プロジェクトを初期化しました。

  ```bash
  # 実際にはディレクトリが空でなかったため工夫したが、理想的なコマンドは以下
  npm create vite@latest . -- --template react-ts
  ```

- **WASM (Rust)**: `wasm-pack` を使用して、`wasm` という名称の Rust ライブラリプロジェクトを作成しました。

  ```bash
  # wasm-packが未インストールの場合はインストール
  # cargo install wasm-pack
  
  wasm-pack new wasm
  ```

- **プロジェクト連携**: `package.json` を編集し、フロントエンドから WASM パッケージ (`wasm/pkg`) を直接インポートできるよう設定しました。

  ```json:package.json
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "wasm": "file:./wasm/pkg"
  },
  ```

## 2. コアロジック実装

- **WASM版アルゴリズム**: `wasm/src/lib.rs` に、試し割り法による素因数分解ロジックを Rust で実装しました。`BigInt` に対応するため、`js-sys` クレートも利用します。

  ```rust:wasm/src/lib.rs
  use wasm_bindgen::prelude::*;
  use js_sys::BigInt;
  use std::convert::TryInto;

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
  ```

- **JavaScript版アルゴリズム**: `src/factorize.ts` に、WASM 版と同じロジックを TypeScript で実装し、`BigInt` に対応させました。

  ```typescript:src/factorize.ts
  export function factorize(n: bigint): bigint[] {
    const factors: bigint[] = [];
    let d = 2n;
    while (d * d <= n) {
      while (n % d === 0n) {
        factors.push(d);
        n /= d;
      }
      d += 1n;
    }
    if (n > 1n) {
      factors.push(n);
    }
    return factors;
  }
  ```

- **WASMビルド**: `wasm-pack build --target web` を実行し、JavaScript から ES Modules として利用可能な WASM パッケージを生成しました。

  ```bash
  cd wasm
  wasm-pack build --target web
  ```

## 3. UI実装

- **UIコンポーネント**: React (`App.tsx`) を使用して、UI 要素とロジックを実装しました。

  ```tsx:src/App.tsx
  // (主要部分のみ抜粋)
  const handleRun = async (source: 'WASM' | 'JS') => {
    const num = BigInt(inputNumber);
    // ...
    let factors: number[];
    const startTime = performance.now();

    if (source === 'WASM') {
      const wasmFactors = factorizeWasm(num);
      factors = Array.from(wasmFactors).map(n => Number(n));
    } else {
      const jsFactors = factorizeJs(num);
      factors = jsFactors.map(n => Number(n));
    }
    const endTime = performance.now();

    setResults(prev => [{
      source,
      input: inputNumber,
      factors: factors,
      time: endTime - startTime,
    }, ...prev]);
  };
  ```

- **スタイリング**: `App.css` を編集し、基本的なレイアウトとダークモード対応を行いました。

## 4. 統合と最終調整

- **ビルドと確認**: `npm run build` を実行してアプリケーションをビルドし、ローカルサーバーで最終的な動作確認を行いました。

  ```bash
  # 依存関係のインストール
  npm install
  
  # アプリケーションのビルド
  npm run build
  
  # ローカルサーバーで確認 (どちらかのコマンドを実行)
  npx serve -s dist -l 8080
  # または
  npx http-server dist -p 8080 --fallback index.html
  ```
