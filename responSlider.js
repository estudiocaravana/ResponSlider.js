ResponSlider = function( slider, userOptions){

	var that = this;
	var options = {
		nElements: 1,
		previousSlideAction: null,
		nextSlideAction: null,
		verticalCentered: false,
	}

	if (!!userOptions){
		for (var op in options){
			if (!!userOptions[op]){
				options[op] = userOptions[op];
			}
		}	
	}

	this.$slider = $(slider);
	this.$slider.addClass('responSlider-slider');

	var sliderChilden = this.$slider.children();		
	if (options.verticalCentered){
		sliderChilden.addClass("responSlider-verticalCentered");
	}
	sliderChilden
		.wrapAll('<div class="responSlider-sliderContainer" />')
		.wrap('<div class="responSlider-slide" style="width: '+(100/options.nElements)+'%" />');

	var _$sliderContainer = this.$slider.find('.responSlider-sliderContainer');

	function _verticalCenterImages(){
		that.$slider.find('.responSlider-verticalCentered').map(function(){
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
				_$sliderContainer.css("left", "");
				$selectedSlide.css({
					position: "",
					left: "",
					"z-index": ""
				});
			});

		}
	}

	_verticalCenterImages();
	$(window).resize(_verticalCenterImages);

	$(options.previousSlideAction).click(function(ev){ ev.preventDefault(); that.moveSlide(false)});
	$(options.nextSlideAction).click(function(ev){ ev.preventDefault(); that.moveSlide(true)});
	
};