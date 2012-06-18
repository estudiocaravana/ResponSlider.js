ResponSlider = function( slider, userOptions){

	var that = this;
	var options = {
		nElements: 1,
		previousSlideAction: null,
		nextSlideAction: null,
		mediaQueries: null,
		horizontallyCentered: false,
		verticallyCentered: false,
		transitionTime: 800
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
	if (options.horizontallyCentered){
		sliderChilden.addClass("responSlider-horizontallyCentered");
	}		
	if (options.verticallyCentered){
		sliderChilden.addClass("responSlider-verticallyCentered");
	}

	var sliderContainerID = 'responSlider-sliderContainer-'+$('.responSlider-sliderContainer').length;

	sliderChilden
		.wrapAll('<div id="'+sliderContainerID+'" class="responSlider-sliderContainer" />')		
		.wrap('<div class="responSlider-slide" />');

	var _$sliderContainer = this.$slider.find('.responSlider-sliderContainer');

	var slideSelector = '#'+sliderContainerID+' > .responSlider-slide';

	var slideWidthStyle = '<style type="text/css">';

	if (options.mediaQueries){		
		for (var mq in options.mediaQueries){
			slideWidthStyle += mq + '{ '+slideSelector+' { width: '+(100/options.mediaQueries[mq])+'% } }';
		}
	}
	else{
		slideWidthStyle += slideSelector+' { width: '+(100/options.nElements)+'% }';
	}

	slideWidthStyle += '</style>';

	$("head").append(slideWidthStyle);

	function _verticalCenterImages(){
		that.$slider.find('.responSlider-verticallyCentered').map(function(){
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
			}, options.transitionTime
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