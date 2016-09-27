//label(name(라디오탭 이름) , value(라디오탭 번호)) 과 div(class(라디오탭 이름) , name(라디오탭의 상태) , value(라디오탭 번호))
//name 을 label 과 div 를 같지 않게 한 이유는 "." + $(this).attr( 'name' ) 이 아닌 단순히 name 으로 찾을때 , label 이 검색되어 버리지 않게 하기 위함.
//실수방지의도.
    $(document).ready(function () {
        $("label").bind("click", function(){
			$("." + $(this).attr( 'name' ) + "[value=" + $(this).attr( 'value' )+ "]").attr( 'name' , $(this).attr( 'name' ) + '-visible')
			//class 가 $(this).attr( 'name' ) 이고 value 가 $(this).attr( 'value' ) 인 목표를 찾고 name 변수를 $(this).attr( 'name' ) + '-visible' 로 바꾼다.
			.siblings()//바꾼것 이외의 목표들을 찾는다.
			.attr( 'name' , $(this).attr( 'name' ) + '-hidden');//name 변수를 $(this).attr( 'name' ) + '-hidden' 으로 바꾼다.
        });
    });

	$(document).ready(function () {
        $("label[name=workmenu]").bind("click", function(){
			$(this).removeClass("Workmenulabelactive").addClass("Workmenulabelactive").siblings().removeClass("Workmenulabelactive");
        });
    });
// workmenu 용 label 추가 이벤트. 처음 화면에서는 적용되어 있지 않기 때문에 초기화가 필요.
/*
	$(document).ready(function () {
        $("label[name=workmenu]").bind("click", function(){
			$(this).css("border-bottom","2px solid #FFFFFF").siblings().css("border-bottom","2px solid #ccc"); 
        });
    });

	$(document).ready(function () {
		$("label[name=workmenu][value=01]").css("border-bottom","2px solid #FFFFFF");
	});
*/
	/*$(function(){
		$("label[name=toolbox]").each(function(){
			var temp0 = $(this).css("background");
			var temp1 = $(this).css("background").split("%)");
			var temp2 = (temp1[0]+"%,").split("rgb");
			var tempcss = "rgb" + temp2[1] + "rgb" +temp2[parseInt($(this).attr( 'value' ))+2] + "rgb(255,255,255) 0%," +"rgb" + temp2[2].split("%,")[0]+"%)" + temp1[1];
			$(this).css("background", tempcss); 
		});
    });*/