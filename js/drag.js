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

    var id, pickX, pickY;

    $("#blocks")
        .on("dragstart", ".code-piece", dragstart_blocks)
        //.on("drag", ".code-piece", drag)
        .on("drop", drop_blocks);

    $("#script-tab .code-sec")
        .on("dragstart", ".code-piece", dragstart_code_sec)
        //.on("drag", ".code-piece", drag)
        .on("drop", drop_code_sec);

    // TODO: 이벤트 버블링
    //드래그 시작시 호출 할 함수
    function dragstart_blocks(event)
    {
        console.log(event.target.classList);
        if ($(event.target).hasClass("default")) return false;

        var $this = $(this);
        var $copy = $this.clone();

        $copy
            .attr("id", scrc.util.uniqueId())
            .appendTo("main");

        id = $copy.attr("id");
        pickX = event.clientX - $this.position().left;
        pickY = event.clientY - $this.position().top;
        event.dataTransfer.setData('piece', $copy.attr("id"));
    }

    function dragstart_code_sec(event)
    {
        var $this = $(this);
        var $code_sec = $("#script-tab .code-sec");

        id = $this.attr("id");
        pickX = event.clientX - $code_sec.position().left - $this.position().left;
        pickY = event.clientY - $code_sec.position().top - $this.position().top;
        event.dataTransfer.setData('piece', $this.attr("id"));
    }

    /*
    function drag (event)
    {
        console.log(id);
        $("#" + id).css({
            left: event.clientX - $("#script-tab .code-sec").position().left - pickX,
            top: event.clientY - $("#script-tab .code-sec").position().top - pickY
        });
    }
    */

    //드롭시 호출 할 함수
    function drop_blocks(event)
    {
        var id = event.dataTransfer.getData('piece');

        console.log("drop bl: " + id);
        $("#" + id).remove();
        event.preventDefault();
    }

    function drop_code_sec(event)
    {
        var id = event.dataTransfer.getData('piece');
        var $code_sec = $("#script-tab .code-sec");
        var px = $code_sec.position().left,
            py = $code_sec.position().top;

        console.log("drop cs: " + id);
        $("#" + id)
            .show()
            .css({
                left: event.clientX - px - pickX,
                top: event.clientY - py - pickY
            })
            .appendTo(this);

        event.preventDefault();
    }
});
