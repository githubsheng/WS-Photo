function RawSlide(name, $slide){
	this.name = name;
	this.$slide = $slide;
    this.is_transition = false; //这个跟本来的HTML属性相对应。本来就是没有transition的
}

RawSlide.prototype.moveLeftTransformTransition = function(){
	if(!this.is_transition){
		this.toggleTransition(true);
	}
	this.$slide.css("-webkit-transform", "translate(-1210px, 0px)");
}

RawSlide.prototype.moveLeftNoTransition = function(){
	if(this.is_transition){
		this.toggleTransition(false);
	}
	this.$slide.css("-webkit-transform", "translate(-1210px, 0px)");
}

RawSlide.prototype.moveRightTransformTransition = function(){
	if(!this.is_transition){
		this.toggleTransition(true);
	}
	this.$slide.css("-webkit-transform", "translate(1210px, 0px)");
}

RawSlide.prototype.moveRightNoTransition = function(){
	if(this.is_transition){
		this.toggleTransition(false);
	}
	this.$slide.css("-webkit-transform", "translate(1210px, 0px)");	
}

RawSlide.prototype.makeActiveTransformTransition = function(){
	if(!this.is_transition){
		this.toggleTransition(true);
	}
	this.$slide.css("-webkit-transform", "translate(0px, 0px)");
}

RawSlide.prototype.makeActiveNoTransition = function(){
	if(this.is_transition){
		this.toggleTransition(false);
	}
	this.$slide.css("-webkit-transform", "translate(0px, 0px)");
}

RawSlide.prototype.toggleTransition = function(isTransition){
	if(isTransition){
		this.is_transition = true;
		this.$slide.css("transition", "1s");
	} else {
		this.is_transition = false;
		this.$slide.css("transition", "");
	}
}