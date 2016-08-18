// TODO: html 코드 생성을 자동화시켜야 함(operator element 템플릿화하기 등).
var scrc;
scrc = scrc || {};


$(function() {
	// 탭(스크립트, 모양, 소리) 구현부

	/*
	$("#work-space")
		.find("nav a:first")
			.addClass("active")
		.end()
		.find("#script-tab")
			.show()
		.end()
		.find("nav a").click(function() {
			var $work_space = $("#work-space");

			$work_space
				.find("nav a.active").removeClass("active")
				.end()
				.find(".tab").hide();

			$(this).addClass("active");
			$work_space
				.find(this.target).fadeIn();
		});
	*/
});

$(function () {
	var resource = scrc.namespace("scrc.resource");

	resource.script_tab = ".workmenu[value=01]";
	resource.script_tab.tool_sec1 = resource.script_tab + " .toolbox[value=01]";
	resource.script_tab.code_sec = resource.script_tab + " .code";
});
