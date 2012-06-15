ResponSlider = function( slider, nElements, justImages){

	var that = this;
	var classPrefix = "responSlider-";

	this.$slider = $(slider);
	this.$slider.addClass(classPrefix+"slider");

	var wrapper = '<div class="'+classPrefix+'slide'
	if (justImages){
		wrapper += ' '+classPrefix+'slide-img';
	}
	wrapper += '" />';

	this.$slider.children().wrap(wrapper);

	var nElements = nElements;

	var _$sliderContainer = $('<div class="'+classPrefix+'sliderContainer" />');
	this.$slider.children().appendTo(_$sliderContainer);
	_$sliderContainer.appendTo(this.$slider);

	var $head = $("head");
	$head.html($head.html() + 
		'<style type="text/css">\
			.'+classPrefix+'slider{ \
		        overflow: hidden;\
			}\
			.'+classPrefix+'sliderContainer{\
				position: relative;\
				max-width: 100%;\
				height: 100%;\
			}\
			.'+classPrefix+'slide{\
				height: 100%;\
				float: left;\
				box-sizing: border-box;\
				position: relative;\
				margin-right: 0px;\
				padding: 20px;\
				overflow: hidden;'+
				'width: '+(100/nElements)+'%'+
			'}\
			.'+classPrefix+'slide > img {\
				max-width: 100%;\
			}\
			.'+classPrefix+'slide-img > img {\
				top: 50%;\
				margin: 0px auto;\
				display: block;\
				position: relative;\
			}\
		</style>');

	function _verticalCenterImages(){
		that.$slider.find('.'+classPrefix+"slide-img > img").map(function(){
			var $this = $(this);
			$this.css({
				"margin-top" : ($this.outerHeight() / 2) * (-1)
			});
		});
	}
	
	this.moveSlide = function( direction ){
		var $slides 			=	_$sliderContainer.children(),
			selectedPos 		= 	direction ? 0 : ($slides.length - 1),		
			horizontalOffset 	= 	$slides.outerWidth(true),
			posContainer 		= 	direction ? horizontalOffset : 0,
			$selectedSlide 		= 	$($slides[selectedPos]);

		if (_$sliderContainer.filter(":animated").length == 0){

			if (direction){
				_$sliderContainer.append($selectedSlide);		
			}

			_$sliderContainer.css("left", posContainer + "px");

			$selectedSlide.css({
				position: "absolute",
				left: (-1 * horizontalOffset) + "px",
				"z-index": parseInt($slides.css("z-index")) + 1
			});				
			
			_$sliderContainer.animate({
				left: (horizontalOffset - posContainer) + "px"
			}, 800
			,function(){
				if (!direction){
					_$sliderContainer.prepend($selectedSlide);
				}
				_$sliderContainer.attr("style","");	
				$selectedSlide.attr("style","");						
			});

		}
	}

	_verticalCenterImages();
	$(window).resize(_verticalCenterImages);
	
};