# digicore_v3_admin

デジコア v3 の管理画面です。

## アクセス方法

1. https://core3admin.digicre.net/ にアクセス
1. デジクリの Gmail アドレスを入力し、受信したメールの URL をクリック

## 開発方法

```bash
pnpm install
pnpm dev
```

https://localhost:3000/ にアクセス

## デプロイ方法

1. master ブランチにマージ
1. GitHub Actions が自動でデプロイを実行
1. ConoHa VPS に接続
1. 下記コマンドを実行

```bash
cd digicre_v3_admin
docker pull ghcr.io/sit-digicre/digicore_v3_admin:master
docker compose down
docker compose up -d
```
