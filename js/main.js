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

//label(name(라디오탭 이름) , value(라디오탭 번호)) 과 div(class(라디오탭 이름) , name(라디오탭의 상태) , value(라디오탭 번호))
//name 을 label 과 div 를 같지 않게 한 이유는 "." + $(this).attr( 'name' ) 이 아닌 단순히 name 으로 찾을때 , label 이 검색되어 버리지 않게 하기 위함.
//실수방지의도.
$(function () {
	$("label").bind("click", function(){
		$("." + $(this).attr( 'name' ) + "[value=" + $(this).attr( 'value' )+ "]").attr( 'name' , $(this).attr( 'name' ) + '-visible')
			//class 가 $(this).attr( 'name' ) 이고 value 가 $(this).attr( 'value' ) 인 목표를 찾고 name 변수를 $(this).attr( 'name' ) + '-visible' 로 바꾼다.
			.siblings()//바꾼것 이외의 목표들을 찾는다.
			.attr( 'name' , $(this).attr( 'name' ) + '-hidden')//name 변수를 $(this).attr( 'name' ) + '-hidden' 으로 바꾼다.
	});
});

$(function () {
	var resource = scrc.namespace("scrc.resource");

	resource.script_tab = ".workmenu[value=01]";
	resource.script_tab.tool_sec1 = resource.script_tab + " .toolbox[value=01]";
	resource.script_tab.code_sec = resource.script_tab + " .code";
});