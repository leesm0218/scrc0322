/**
 * Created by Choi on 2016-05-06.
 */

$(function () {
	$("#save").bind("click", function(){
		var doc = document.body.innerHTML;
		
		document.body.innerHTML = "";
		
		document.body.innerHTML = doc;
		
		    var json = stage.toJSON();

    console.log(json);
		
	});
});
