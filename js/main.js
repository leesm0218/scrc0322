$(function() {
	$("#work-space nav a:first").addClass("active");
	$("#work-space #script-tab").show();
	
	$("#work-space nav a").click(function() {
		$("#work-space nav a.active").removeClass("active");
		$("#work-space .tab").hide();
		
		$(this).addClass("active");
		$("#work-space " + this.target).fadeIn();
	});
});