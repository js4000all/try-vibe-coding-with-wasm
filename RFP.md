# RFP – WASM vs JS 素因数分解パフォーマンス評価

## 目的

WASM と JavaScript で実装した素因数分解アルゴリズムの性能を比較し、WASM の優位性を検証する。

## ソフトウェア概要

- 同じ素因数分解アルゴリズムを **WASM (Rust)** と **JavaScript** で実装
- 入力数値に対する分解結果と実行時間を計測・表示する Web アプリ（SPA）

## 機能要件

### 必須

1. **UI**

   - 数値入力フィールド
   - 「Run (WASM)」「Run (JS)」ボタン
   - 結果表示エリア（素因数列・実行時間を追記表示）

2. **アルゴリズム実装**
   Pollard’s Rho 法、試し割り法。どちらでも良いが、両実装で同じものを採用すること。

   - JS 版
   - WASM 版：Rust + wasm-pack

3. **性能計測**

   - 実行に要した時間 (ms) を計測し表示

### 任意

- ビッグインテジャー対応（10^18 超）
- ダークモード UI

### 将来検討

- モバイル PWA 化
- クラウドベンチマーク (Edge／Serverless)

## 技術スタック

| レイヤ          | 採用技術                                                                       |
| --------------- | ------------------------------------------------------------------------------ |
| フロントエンド  | JavaScript / TypeScript, Vite                                                  |
| WASM モジュール | Rust + wasm-pack                                                               |
| バックエンド    | Express (Node.js) ※API が必要になった場合                                      |
| データベース    | なし                                                                           |
| インフラ        | ローカル実行 (Docker optional) ／ 静的ホスティング: **serve**, **http-server** |
| CI/CD           | GitHub Actions – `npm test` & ベンチマーク                                     |

## 静的ホスティング・デプロイ

- **開発／検証用**

  - `npx serve -s dist -l 8080` もしくは
    `npx http-server dist -p 8080 --fallback index.html`
  - SPA ルーティングを `-s` / `--fallback` オプションでサポート。

- **本番環境候補**
  - 未定

## 開発環境・セットアップ

| ツール    | バージョン (目安)                      |
| --------- | -------------------------------------- |
| Node.js   | インストール済みバージョン             |
| npm       | インストール済みバージョン             |
| Rust      | インストール済みバージョン             |
| wasm-pack | 最新                                   |
| エディタ  | VS Code + Rust Analyzer extension 推奨 |

### 初期構築手順（参考）

```bash
# 1. 依存関係をインストール
npm install

# 2. WASM モジュールをビルド
wasm-pack build --release

# 3. アプリをビルド
npm run build            # → dist/

# 4. ローカル配信して検証
npx serve -s dist -l 8080
#   または
npx http-server dist -p 8080 --fallback index.html
```

以上で即座にローカル環境で動作確認が可能。
