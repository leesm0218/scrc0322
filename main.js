// TODO: html 코드 생성을 자동화시켜야 함(operator element 템플릿화하기 등).
var scrc;
scrc = scrc || {};


$(function() {
	// 탭(스크립트, 모양, 소리) 구현부

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
				.find(".tab").hide();

			$(this).addClass("active");
			$work_space
				.find(this.target).fadeIn();
		});
});

function audio_play(){
	var oAudio = document.getElementById('myaudio');
	var btn = document.getElementById('play');

	if (oAudio.paused) {
		oAudio.src = "http://ggumimugg.cafe24.com/audio/You_Raise_Me_Up.mp3";
		oAudio.play();
		btn.textContent = "Pause";
	}
	else {
		oAudio.pause();
		btn.textContent = "Play ";
	}
}
