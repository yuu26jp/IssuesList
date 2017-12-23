'use strict';

// API接続情報
const GITLAB_URL   = "https://gitlab.com";
const GITLAB_PROJ  = GITLAB_URL + "/api/v4/projects/";
const GITLAB_GROUP = GITLAB_URL + "/groups/";
const GITLAB_KEY   = "private_token=<YOUR-ACCESS-TOKEN>";
const REDMINE_URL  = "https://my.redmine.jp/demo/issues/";

// app定義
var app = angular.module('myApp', ['ngResource', 'ngSanitize', 'ngCsv']);

// HTTPエラー無効化
app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);


// issuesController定義
//  - projects : 対象のプロジェクトID配列
//  - state    : 検索対象ステータス(opened/closed/指定なし)
//  - sort     : ソート順序(項目名)
//  - reverse  : ソート反転(true/false)
//  - redmine  : Redmineチケット紐付け機能
app.controller('issuesController', function($scope, $resource, projects, state, sort, reverse, redmine){
	
	// ■初期化
	$scope.items     = [];		// 表示用
	$scope.csvData   = [];		// CSV出力用
	$scope.isLoading = true;	// 読み込み中表示
	
	// Redmineチケット紐付けON/OFF反映
	$scope.isEnableRedmine = redmine;
	
	
	// プロジェクト単位でループ
	angular.forEach(projects, function(projectId){
		
		//===========================
		// 01_プロジェクト情報の取得
		//===========================
		
		// プロジェクト取得用URL
		var projectApi = GITLAB_PROJ + projectId + "?" + GITLAB_KEY;
		var pjdata;
		
		// APIからプロジェクト情報を取得
		console.log("[INFO] Get Project Data: " + projectApi);
		$resource(projectApi).get(function(result){
			
			// 取得したプロジェクト情報を保持しておく
			pjdata = result;
			
		}).$promise.then(function(){		// 以降、同期処理
		
		
		//====================
		// 02_Issue情報の取得
		//====================
		
		// Issue一覧取得用URL
		var issueApi = GITLAB_PROJ + projectId + "/issues?" + GITLAB_KEY + "&per_page=100";
		
		// 引数でステータスの指定がある場合、URLパラメータに追加
		if (state != ""){
			issueApi += "&state=" + state;
		}
		
		// APIからissue一覧を取得
		console.log("[INFO] Get Project Issues: " + issueApi);
		$resource(issueApi).query().$promise.then(function(result){		// 以降、同期処理
			
			// 読み込み中表示を解除(TODO:場所を変えたい)
			$scope.isLoading = false;
			
			// Issue単位でループ
			angular.forEach(result, function(issue){
				
				// Redmine情報取得(Issue情報から検索)
				var ticket_id  = getTicketNumber(issue);
				var ticket_url = getTicketUrl(ticket_id);
				
				// 表示用データの生成、追加
				var item = createDispItem(pjdata, issue, ticket_id, ticket_url);
				$scope.items.push(item);
				
				// CSV出力用データの生成、追加
				var csvItem = createCsvItem(pjdata, issue, ticket_id);
				$scope.csvData.push(csvItem);
				
			});
			
		});	// ->Issue
		});	// ->Project
	});	// ->All Projects
	
	
	// 引数をscopeに格納
	$scope.sortType    = sort;
	$scope.sortReverse = reverse;
	
	// CSVヘッダをscopeに格納
	$scope.csvHeader = ["Issue番号", "Redmine", "グループ", "プロジェクト", "作成者", "状態", "ラベル", "件名"];
});


// ラベル表示用フィルタ
app.filter('labelPrint', function(){
	
	// ラベルを引数として受け取る
	return function(items){
		
		// 空文字で初期化
		var html = "";
		
		// ラベルの数だけループ
		for(var i in items){
			
			// ラベル名を取得
			var title = items[i];
			
			// ラベル色を取得
			var color = getLabelColor(title);
			
			// bootstrapのラベルを作成
			html += '<span class="label ' + color + '">' + title + '</span> ';
		}
		
		// HTMLを返却
		return html;
	}
});


// 長い文字列の省略表示フィルタ
app.filter('longString', function(){
	
	// 文字列と最大文字数を引数として受け取る
	return function(text, len){
		
		// 最大文字数より長い場合
		if (text.length > len){
			return text.substring(0, len - 1) + "…";	// カット後の末尾に「…」を付加
		}
		
		// 最大文字数以下の場合
		else {
			return text;
		}
	}
});
