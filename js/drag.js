/**
 * Created by hwss on 2016-05-02.
 */


$(function(){
    // 드래그 기능 활용 시 필요한 부분

    jQuery.event.props.push('dataTransfer');

    var body = jQuery('body')
        .bind( 'dragenter dragover', false);
});

$(function () {
    // code-piece의 드래그 앤 드랍 기능 구현부

    $("#blocks")
        .on("dragstart", ".code-piece", dragstart_blocks)
        .on("drop", drop_blocks);

    $("#code-sec")
        .on("dragstart", ".code-piece", dragstart_code_sec)
        .on("drop", drop_code_sec);

    // TODO: 이벤트 버블링 개 빡친다!!! input 박스에서 드래그를 해도 먹히게 하면 안되는데. 답답하다.
    //드래그 시작시 호출 할 함수
    function dragstart_blocks(event)
    {
        console.log(event.target.classList);
        if ($(event.target).hasClass("default")) return false;

        var $copy = $(this).clone();

        $copy
            .attr("id", scrc.util.uniqueId())
            .hide()
            .appendTo("main");

        event.dataTransfer.setData('piece', $copy.attr("id"));
    }

    function dragstart_code_sec(event)
    {
        var $this = $(this);

        event.dataTransfer.setData('piece', $this.attr("id"));
    }

    //드롭시 호출 할 함수
    function drop_blocks(event)
    {
        var id = event.dataTransfer.getData('piece');

        $("#" + id).remove();
        event.preventDefault();
    }

    function drop_code_sec(event)
    {
        var id = event.dataTransfer.getData('piece');

        $("#" + id).show().appendTo(this);
        event.preventDefault();
    }
});
