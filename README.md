# 雑煮庵 Web Site

雑煮庵サイトのフロントエンドと、Renderへデプロイできる最小構成のバックエンドをまとめたリポジトリです。

## 構成

- `reserve/` 予約ページ
- `contact/` お問い合わせページ
- `assets/js/` 共通フロントエンドJSとAPI接続設定
- `server.js` ExpressベースのAPIサーバー
- `data/` ローカル保存用JSONデータ

## バックエンドのセットアップ

1. Node.js 18以上を用意します。
2. 依存関係をインストールします。

```bash
npm install
```

3. `.env.example` を参考に `.env` を作成します。

```env
PORT=3000
DATA_DIR=./data
FRONTEND_ORIGINS=http://localhost:5500,http://127.0.0.1:5500,http://localhost:3000,https://twiiiit7-sys.github.io
API_BASE_URL=http://localhost:3000
```

4. サーバーを起動します。

```bash
npm start
```

開発中は `assets/js/site-config.js` のローカル設定により `http://localhost:3000` を参照します。

## API

### `GET /api/health`

ヘルスチェック用です。

レスポンス例:

```json
{
  "status": "ok",
  "service": "zounian-api",
  "timestamp": "2026-06-05T00:00:00.000Z"
}
```

### `POST /api/reservations`

予約フォーム送信用です。

リクエスト例:

```json
{
  "course": "季節の雑煮コース",
  "date": "2026年12月12日（金）",
  "time": "17:00",
  "guests": 2,
  "name": "山田 太郎",
  "email": "yamada@example.com",
  "phone": "090-1234-5678",
  "note": "えびアレルギーがあります"
}
```

### `POST /api/contact`

お問い合わせフォーム送信用です。

リクエスト例:

```json
{
  "name": "山田 花子",
  "email": "sample@example.com",
  "category": "ご予約について",
  "subject": "体験の予約について",
  "message": "空席状況を確認したいです。"
}
```

## Renderデプロイ手順

1. GitHub にこのリポジトリを push します。
2. Render で `New +` → `Web Service` を選び、対象リポジトリを接続します。
3. 以下を設定します。

- Build Command: `npm install`
- Start Command: `npm start`
- Runtime: `Node`

4. Render の環境変数に以下を設定します。

- `FRONTEND_ORIGINS=https://twiiiit7-sys.github.io`
- `DATA_DIR=./data`

5. デプロイ後、RenderのURLを確認して `assets/js/site-config.js` の本番URL
   `https://your-render-service.onrender.com`
   を実際のRender URLへ置き換えます。

## フロントエンド接続

- 予約フォームは `reserve/script.js` から `/api/reservations` に送信します。
- お問い合わせフォームは `contact/script.js` から `/api/contact` に送信します。
- APIベースURLは `assets/js/site-config.js` と `assets/js/api-client.js` で管理しています。

## 補足

- 現在はDB未接続のため、受信データは `data/reservations.json` と `data/contacts.json` に追記保存されます。
- GitHub PagesからRender APIへ送信できるようにCORSを設定しています。
