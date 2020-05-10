# Issues List
## 概要
GitLab に登録済みの Issue を一覧表示するツールです。  
Issue 内に Redmine のチケット番号を記載すると自動的に紐付けます。  
大人の事情で、GitLab と Redmine を連携できない環境のために作成しました。

おまけとして、複数のリポジトリを横断して確認することも可能です。

## できること
- 複数リポジトリの Issue を一括表示する
- Redmine のチケットと紐付ける（オフにもできます）
- グループ、プロジェクト、作成者、状態 などでソート
- フリーワード検索で絞り込み
- CSV エクスポート

## 使いかた
- Access Token (Scope:api) を取得 https://gitlab.com/profile/personal_access_tokens
- `scripts/app.js` の4行目、7行目を修正
- `index.html` の動作設定(21～34行目)を修正
- ブラウザでアクセス！

[![Youtube](http://img.youtube.com/vi/QzNgxJbNXmo/0.jpg)](http://www.youtube.com/watch?v=QzNgxJbNXmo)

## 使用ライブラリ
- Font Awesome http://fontawesome.io/
- AngularJS https://angularjs.org/
- ng-csv https://github.com/asafdav/ng-csv


## 関連記事
- [GitLab と Redmine を紐付けるツールを作った話 - yuu26-memo](https://blog.yuu26.com/gitlab-redmine-linked-tool/)
