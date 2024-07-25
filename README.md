# AniList Updater

AniListのPopularなアニメをランキングで一覧表示し、順位の範囲を指定して一括追加ができるアプリです。

![Screenshot from 2024-07-25 18-04-29](https://github.com/user-attachments/assets/96d1dc90-5441-4a32-8f7f-24fc57867d51)

[AnimeMusicQuiz](https://animemusicquiz.com/)で人気アニメの曲を指定して遊びたいけれど、AniListがない、という方に便利です。

個人用につくったやっつけアプリですが、localhostでも、Vercelでも動作します。
.env.local またはその他の環境変数にAuthorization tokenを下記の形式で格納してください。
```
AUTH_TOKEN=xxxxxxxxxx
```
tokenの取得は下記の方法でできます。  
https://anilist.gitbook.io/anilist-apiv2-docs/overview/oauth/implicit-grant

# Challenges

- Next.js ver14 での Apollo Clientの利用
  - RSC, Client Component それぞれで別々の Apollo Client を利用
  - codegenを利用し、クエリ結果を厳密に型付
- 無限スクロールの実装
- プログレスバーの実装
- ホスティングした際にAnilistのアクセストークンが漏洩しないようにサーバーアクションでmutationを実行する
