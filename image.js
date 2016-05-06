/**
 * Created by Choi on 2016-05-06.
 */

//원래 이미지 미리보기를 하기 위해서는 이미지를 서버에 업로드를 한 후에 업로드된 이미지의 URL을 전달 받아 그 URL로 이미지 src에 세팅을 해주는 것으로 처리를 해야한다. 
//하지만 FileReader 라는 Javascript 객체가 생기면서 최신 브라우저에서는 서버에 이미지를 업로드 안해도 이미지 미리보기 기능을 구현할 수 있다. 
$(function() {
    $("#imgInp").on('change', function(){
        readURL(this);
    });
});

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#myimage').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}
