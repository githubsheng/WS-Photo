function QuestionListSlide(slide_index, $slide){
	this.slide_index = slide_index;
	this.$slide = $slide;
	this.is_transition = false; //初始的CSS设置里是没有transition的
	this.questions = [];//此集合里的元素应该为QuestionListQuestion对象,此属性为可选的，只有当slide_type = 0的时候才需要用到这个属性
}

QuestionListSlide.prototype.moveLeftTransformTransition = function(){
	if(!this.is_transition){
		this.toggleTransition(true);
	}
	this.$slide.css("-webkit-transform", "translate(-1210px, 0px)");
}

QuestionListSlide.prototype.moveLeftNoTransition = function(){
	if(this.is_transition){
		this.toggleTransition(false);
	}
	this.$slide.css("-webkit-transform", "translate(-1210px, 0px)");
}

QuestionListSlide.prototype.moveRightTransformTransition = function(){
	if(!this.is_transition){
		this.toggleTransition(true);
	}
	this.$slide.css("-webkit-transform", "translate(1210px, 0px)");
}

QuestionListSlide.prototype.moveRightNoTransition = function(){
	if(this.is_transition){
		this.toggleTransition(false);
	}
	this.$slide.css("-webkit-transform", "translate(1210px, 0px)");	
}

QuestionListSlide.prototype.makeActiveTransformTransition = function(){
	if(!this.is_transition){
		this.toggleTransition(true);
	}
	this.$slide.css("-webkit-transform", "translate(0px, 0px)");
}

QuestionListSlide.prototype.makeActiveNoTransition = function(){
	if(this.is_transition){
		this.toggleTransition(false);
	}
	this.$slide.css("-webkit-transform", "translate(0px, 0px)");
}

QuestionListSlide.prototype.toggleTransition = function(isTransition){
	if(isTransition){
		this.is_transition = true;
		this.$slide.css("transition", "1s");
	} else {
		this.is_transition = false;
		this.$slide.css("transition", "");
	}
}