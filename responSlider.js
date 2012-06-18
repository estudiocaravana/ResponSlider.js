ResponSlider = function( slider, userOptions){

	/*
	 * Auxiliar properties
	 */
	var that = this;		

	/*
	 * Private properties
	 */
	var _$sliderContainer, 
		_effects = {},		
		_options = 
			{
				nElements: 1,
				effect: 'fade',
				previousSlideAction: null,
				nextSlideAction: null,
				mediaQueries: null,
				horizontallyCentered: false,
				verticallyCentered: false,
				transitionTime: 800
			};

	/*
	 * Public properties
	 */
	this.$slider = $(slider);

	/*
	 * Private methods
	 */
	function _initSlider(){
		var slideSelector,
			sliderChilden,
			sliderContainerID,
			sliderSelector,
			slideWidthStyle;

		that.$slider.addClass('responSlider-slider');

		sliderChilden = that.$slider.children();
		if (_options.horizontallyCentered){
			sliderChilden.addClass("responSlider-horizontallyCentered");
		}		
		if (_options.verticallyCentered){
			sliderChilden.addClass("responSlider-verticallyCentered");
		}

		sliderContainerID = 'responSlider-sliderContainer-'+$('.responSlider-sliderContainer').length;

		sliderChilden
			.wrapAll('<div id="'+sliderContainerID+'" class="responSlider-sliderContainer" />')		
			.wrap('<div class="responSlider-slide" />');

		_$sliderContainer = that.$slider.find('.responSlider-sliderContainer');

		slideSelector = '#'+sliderContainerID+' > .responSlider-slide';

		slideWidthStyle = '<style type="text/css">';

		if (_options.mediaQueries){		
			for (var mq in _options.mediaQueries){
				slideWidthStyle += mq + '{ '+slideSelector+' { width: '+(100/_options.mediaQueries[mq])+'% } }';
			}
		}
		else{
			slideWidthStyle += slideSelector+' { width: '+(100/_options.nElements)+'% }';
		}

		slideWidthStyle += '</style>';

		$("head").append(slideWidthStyle);
	}

	function _initEffects(){
		_effects.slide = function(showNextSlide){
			var $slides 			=	_$sliderContainer.children(),
				selectedPos 		= 	showNextSlide ? 0 : ($slides.length - 1),		
				horizontalOffset 	= 	$slides.outerWidth(true),
				posContainer 		= 	showNextSlide ? horizontalOffset : 0,
				$selectedSlide 		= 	$($slides[selectedPos]);

			if (showNextSlide){
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
			}, _options.transitionTime
			,function(){
				if (!showNextSlide){
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

		_effects.fade = function(showNextSlide){
			var $slides 			=	_$sliderContainer.children(),
				selectedPos 		= 	showNextSlide ? 0 : ($slides.length - 1),		
				$selectedSlide 		= 	$($slides[selectedPos]),
				originalOpacity		=	_$sliderContainer.css("opacity");

			originalOpacity	= !!(originalOpacity) ? originalOpacity : 1;

			_$sliderContainer.animate({
				opacity: 0
			}, _options.transitionTime / 2,
			function(){
				if (showNextSlide){
					_$sliderContainer.append($selectedSlide);
				}
				else{
					_$sliderContainer.prepend($selectedSlide);
				}
				_$sliderContainer.animate({
					opacity: originalOpacity
				}, _options.transitionTime / 2, function(){
					_$sliderContainer.attr("style","");
				});
			});
		}
	}

	function _verticalCenterImages(){
		that.$slider.find('.responSlider-verticallyCentered').map(function(){
			var $this = $(this);
			$this.css({
				"margin-top" : ($this.outerHeight() / 2) * (-1)
			});
		});
	}

	/*
	 * Public methods
	 */
	this.slideTransition = function( showNextSlide ){		
		if (_$sliderContainer.filter(":animated").length == 0){
			_effects[_options.effect](showNextSlide);
		}
	}


	/*
	 * Slider initialization
	 */
	if (!!userOptions){
		for (var op in _options){
			if (!!userOptions[op]){
				_options[op] = userOptions[op];
			}
		}	
	}

	_initSlider();
	_initEffects();

	if (_options.verticallyCentered){
		_verticalCenterImages();
		$(window).resize(_verticalCenterImages);
	}	

	$(_options.previousSlideAction).click(function(ev){ ev.preventDefault(); that.slideTransition(false)});
	$(_options.nextSlideAction).click(function(ev){ ev.preventDefault(); that.slideTransition(true)});
	
};