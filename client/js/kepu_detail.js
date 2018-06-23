define(function(require,exports,module) {
	var utils = require('/js/utils.js');
	$(function(){
		$('.del-asso').on('click', function () {
			delAsso($(this));
			return false;
		});

		$('#addAssBtn').on('click', function () {
			getArticlesDialog();
		});
	});


	function getArticlesDialog() {
		var height = $(window).height() * 0.9;
		var width = $(window).width() * 0.9;

		var recommendIds = JSON.parse($('#recommendIds').val());

		var categoryData = JSON.parse($('#categoryData').val());
		var categoryHtmlArr = [];
		categoryHtmlArr.push('<option value="all" selected>全部</option>');
		for (var i = 0; i < categoryData.length; i++) {
			categoryHtmlArr.push('<option value="' + categoryData[i].id + '">' + categoryData[i].name + '</option>');
		}
		var popup = new utils.Popup({
			otherBox: 'listPopBox',
			msg: '<input id="asso-page" type="hidden" value="1"/><input id="asso-tc" type="hidden" value=""/><input id="asso-category" type="hidden" value="all"/><div id="searchForm" class="search"><label>搜索:</label><input id="tc" type="text" placeholder="可根据标题、内容搜索",name="tc" value=""/>' +
			'<label>所属栏目:</label><select name="category">' + categoryHtmlArr.join('') + '</select>' +
			'<button class="btn search">搜索</button></div><ul id="articleList" class="articleList"><div class="load-more"><a href="javascript:void(0);">加载更多...</a></div></ul>',
			okText: '确定',
			height: height,
			width: width,
			delayTime: 100,
			isHide:false,
			callback: function () {
				var listPopBox = $('.listPopBox');
				var listHeight = listPopBox.height() - parseInt(listPopBox.find('article').css('padding-top')) - parseInt(listPopBox.find('article').css('padding-bottom')) - listPopBox.find('#searchForm').outerHeight(true) - listPopBox.find('.submitBox').outerHeight(true);
				$('#articleList').css('height', listHeight);
				//加载第一页文章
				getArticlesByPage({
					page: 1,
					category: 'all',
					status: 'publish',
					tc: '',
					recommendIds:recommendIds
				});

				//搜索功能
				listPopBox.find('.btn.search').on('click', function () {
					getArticlesByPage({
						page: 1,
						category: $('#searchForm').find('select[name=category]').val(),
						status: 'publish',
						tc: $('#searchForm').find('#tc').val(),
						recommendIds:recommendIds
					}, 'search');
				});
				//翻页功能
				listPopBox.find('.load-more').on('click', function () {
					getArticlesByPage({
						page: parseInt($('#asso-page').val()) + 1,
						category: $('#asso-category').val(),
						status: 'publish',
						tc: $('#asso-tc').val(),
						recommendIds:recommendIds
					});
				});

			},
			okCallback: function () {
				saveAssociation();
			}
		})
	}

	function saveAssociation() {
		var checkedBoxs = $('#articleList li input[type=checkbox]:checked');
		var recommendIds = [];
		checkedBoxs.each(function (index, ele) {
			var li = $(ele).closest('li');
			var id = li.attr('data-id');
			recommendIds.push(id);
		});

		if(recommendIds.length === 0){
			utils.AlertTip('fail','请选择至少一篇推荐文章');
			return false;
		}

		var articleId =  $('#idVal').val();
		utils.SendAjax({
			url: '/kepu/asso/add',
			method: 'POST',
			param: {
				articleId:articleId,
				recommendIds:recommendIds
			},
			tipText: '新增关联文章',
			callback: function (data) {
				utils.AlertTip('success','新增关联文章成功');
				window.location.reload();
			}
		});
	}

	function delAsso($this) {
		var li = $this.closest('li');
		var id = li.attr('data-id');
		var articleId =  $('#idVal').val();

		var popup = new utils.Popup({
			msg: '确定删除该关联吗?',
			okText: '确定删除',
			delayTime: 100,
			okCallback: function () {
				utils.SendAjax({
					url: '/kepu/asso/del',
					param: {
						recommendId: id,
						articleId:articleId
					},
					method: 'POST',
					tipText: '删除推荐',
					callback: function (result) {
						var recommendIds = JSON.parse($('#recommendIds').val());
						for (var i = 0; i < recommendIds.length; i++) {
							if (id == recommendIds[i]) {
								recommendIds.splice(i, 1);
							}
						}
						li.remove();
						$('#recommendIds').val(JSON.stringify(recommendIds));
					},
					errorFun: function () {

					}
				});
			}
		});
		return false;
	}

	//分页加载所有发布中的文章
	function getArticlesByPage(param, way) {
		param.articleId = $('#idVal').val();
		utils.SendAjax({
			url: '/kepu/list/ajax',
			method: 'GET',
			param: param,
			tipText: '获取发布中的文章',
			dataType: 'html',
			callback: function (data) {
				var result = JSON.parse(data);
				if (way == 'search') {
					$('#articleList li').remove();
					$('#articleList .no-record').remove();
				}
				if (result.html) {
					$('#articleList .load-more').before(result.html);
				} else {
					$('#articleList .load-more').before($('<div class="no-record text-center">暂无结果</div>'));
				}

				$('#asso-page').val(param.page);
				$('#asso-category').val(param.category);
				$('#asso-tc').val(param.tc);
				if (param.page == result.pageCount || result.pageCount == 0) {
					$('.listPopBox .load-more').off('click').html('没有更多了');
				} else {
					//翻页功能
					$('.listPopBox .load-more').off('click').on('click', function () {
						getArticlesByPage({
							page: parseInt($('#asso-page').val()) + 1,
							category: $('#asso-category').val(),
							status: 'publish',
							tc: $('#asso-tc').val()
						});
					});
				}
			}
		});
	}

	//不做删除
	// $('#del').on('click',delArticle);
    //
	// function delArticle(){
	// 	var idVal = $('#idVal').val();
	// 	var popup = new utils.Popup({
	// 		msg:'确定删除该文章吗？',
	// 		okText:'确定删除',
	// 		okCallback:function(){
	// 			$('#del').addClass('disabled').off('click');
	// 			utils.SendAjax({
	// 				url: '/kepu/del?id='+idVal,
	// 				param: {},
	// 				tipText: '删除文章',
	// 				callback: function () {
	// 					window.location.href='/kepu/search?category=all';
	// 				},
	// 				errorFun:function(){
	// 					$('#del').removeClass('disabled').off('click').on('click',delArticle);
	// 				}
	// 			});
	// 		}
	// 	})
	// }
});



