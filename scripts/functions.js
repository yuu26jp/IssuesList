'use strict';
//
// app.js から呼び出される関数用JavaScript
//


// 表示項目の生成
function createDispItem(pjdata, issue, ticket_id, ticket_url){
	
	// 表示用データ作成
	var item = {
		
		// プロジェクト情報
		project_name: pjdata.name,
		project_url:  pjdata.web_url + "/issues",
		
		// グループ情報
		group_name:   pjdata.namespace.name,
		group_url:    GITLAB_GROUP + pjdata.namespace.path + "/issues",
		
		// Redmine情報
		redmine_id:   ticket_id,
		redmine_url:  ticket_url,
		
		// Issue情報
		id:       issue.id,
		title:    issue.title,
		web_url:  issue.web_url,
		author:   issue.author.name,
		state:    issue.state,
		labels:   issue.labels,
		due_date: issue.due_date
	};
	
	// Asigneeが設定されている場合のみ追加
	if (issue.assignee != null){
		item.assignee = issue.assignee.name;
	}
	
	// 結果を返却
	return item;
}


// CSV項目の生成
function createCsvItem(pjdata, issue, ticket_id){
	
	// ラベルを文字列化
	var labels_str = getLabelsString(issue.labels);
	
	// CSV出力用データ作成
	var csvItem = {
		id:       issue.id,
		redmine:  ticket_id,
		group:    pjdata.namespace.name,
		project:  pjdata.name,
		author:   issue.author.name,
		state:    issue.state,
		labels:   labels_str,
		title:    issue.title
	};
	
	// 結果を返却
	return csvItem;
}


// Issue情報からRedmineチケット番号を抽出
function getTicketNumber(issue){
	
	// 空文字で初期化
	var ticketId = "";
	
	// タイトル・本文から#00000の文字を検索
	var title = issue.title + issue.description;;
	var res = title.match(/#[0-9]{1,6}/);
	
	// マッチした場合は拾う
	if (res != null){
		
		// 「#」を取り除いてチケット番号取得
		ticketId = res[0].replace(/#/, "");
	}
	
	// 結果を返却
	return ticketId;
}


// Redmineチケット番号からURLを生成
function getTicketUrl(ticketId){
	
	// 空文字で初期化
	var url = "";
	
	// URLを生成
	if (ticketId != ""){
		url = REDMINE_URL + ticketId;
	}
	
	// 結果を返却
	return url;
}


// ラベル一覧を文字列化
function getLabelsString(labels){
	
	// 空文字で初期化
	var str = "";
	
	// ラベルの数だけループ
	for (var i in labels){
		
		// ラベル名を文字列結合
		str += labels[i] + ",";
	}
	
	// 末尾の「,」を削除
	str = str.replace(/,$/, "");
	
	// 結果を返却
	return str;
}


// ラベル色の判定
function getLabelColor(title){
	var color;
	
	switch (title){
		// TODO
		
		// 黒
		default:
			color = "label-default";
			break;
	}
	
	// 結果を返却
	return color;
}
