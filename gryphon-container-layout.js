var gryphon_container_layout = {};

/**
 * 调整上下上下边距以让整个APP垂直居中
 */
gryphon_container_layout.adjust_body_margin = function(){
	var viewport_height = $(window).height();
	var up_bottom_margin = (viewport_height - 590)/2;
	$("body").css("margin", up_bottom_margin + "px 0px");
}