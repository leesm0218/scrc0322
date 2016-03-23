// TODO: html 코드 생성을 자동화시켜야 함(operator element 템플릿화하기 등).

$(function(){
	// 드래그 기능 활용 시 필요한 부분

	jQuery.event.props.push('dataTransfer');

	var body = jQuery('body')
		.bind( 'dragenter dragover', false);
});

$(function() {
	// 탭(스크립트, 모양, 소리) 구현부

	$("#work-space nav a:first").addClass("active");
	$("#work-space #script-tab").show();
	
	$("#work-space nav a").click(function() {
		$("#work-space nav a.active").removeClass("active");
		$("#work-space .tab").hide();
		
		$(this).addClass("active");
		$("#work-space " + this.target).fadeIn();
	});
});

$(function () {
	// code-piece의 드래그 앤 드랍 기능 구현부

	$(".code-piece").attr("draggable", true);
	$(".code-piece").on("dragstart", drag);

	$(".blocks").on("drop", drop);
	$(".code-sec").on("drop", drop);

	//드래그 시작시 호출 할 함수
	function drag(event) {
		event.dataTransfer.setData('piece', this.id);
	}

	//드롭시 호출 할 함수
	// TODO: 드롭시 엘리먼트롤 복사해 붙혀넣는 기능으로 바꿔야 한다.
	function drop(event) {
		var id = event.dataTransfer.getData('piece');

		this.appendChild(document.getElementById(id));
		event.preventDefault();
	}
});

$(function () {
	// 여러가지 기본값
	$(".default.element.number").val(0);
});

$(function () {
	// 코드 조각들을 클릭하면 코드가 동작한다.
	// TODO: 말풍선으로 출력하도록 바꾼다.
	// TODO: 제어부의 경우 타이머를 통해 불연속적으로 동작해야 하므로 바꿔야 한다.
	$(".code-piece.operator").click(function (event) {
		if ($(event.target).hasClass("operator")) {
			console.log(this.calc());
		}
	});
});

$(function () {
	// 여러 엘리먼트들이 들어갈 수 있는 빈공간.
	// 내부에는 '하나'의 엘리먼트만 들어갈 수 있다.
	$(".element.space").each(function () {
		this.calc = function () {
			var $elmt = $(this).find(".element");

			return $elmt[0].calc();
		};
	});

	// number는 default element 중에 하나인데
	// 따로 존재할 수 업고 항상 다른 엘리먼트의 안에 있다.
	// TODO: space element가 텅 비어 있으면 나타나고, 아니면 숨겨지는 식으로 구현할 것.
	$(".element.number").each(function () {
		this.calc = function () {
			return parseInt(this.value);
		};
	});
});

var operators = {
	binary : {
		"plus": function (lhs, rhs) {
			return lhs + rhs;
		},
		"minus": function (lhs, rhs) {
			return lhs - rhs;
		}
	}
};

$(function () {
	// operator element의 기능 구현

	// 이항연산자 구현부
	$(".binary.operator").each(function () {
		this.calc = function () {
			var $this = $(this);
			var $space = $this.find(".space");

			return operators.binary[$this.attr("operator")]($space[0].calc(), $space[1].calc());
		}
	});
});