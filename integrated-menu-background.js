$(function(){
	var canvas = document.querySelector("#menu-system-background");
	canvas.width = 1210;
	canvas.height = 90;
	
	var ctx = canvas.getContext("2d");
	ctx.strokeStyle = "gray";
	ctx.lineWidth = 1;
	
	ctx.beginPath();
	ctx.moveTo(100, 45);
	ctx.lineTo(1100, 45);
	ctx.stroke();
	ctx.restore();
})