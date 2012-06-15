var com;

if (!com) com = {};

if (!com.estudiocaravana) com.estudiocaravana = {};

com.estudiocaravana.ResponSlider = {};

(function( ){
	
	var _$sliderContainer;

	function init( sliderContainer ){
		_$sliderContainer 	= 	$(sliderContainer);

		$(window).load(_verticalCenterImages).resize(_verticalCenterImages);
	}

	function _verticalCenterImages(){
		_$sliderContainer.find("img").map(function(){
			var $this = $(this);
			$this.css({
				"margin-top" : ($this.outerHeight() / 2) * (-1)
			});
		});
	}
	
	function moveSlide( direction ){
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
	
	var ns = com.estudiocaravana.ResponSlider;
	ns.init = init;
	ns.moveSlide = moveSlide;
	
})();



