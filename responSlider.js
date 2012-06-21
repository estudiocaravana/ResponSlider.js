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
				visibleSlides: 1,
				movingSlides: 1,
				effect: 'slide',
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
			slideWidthStyle += slideSelector+' { width: '+(100/_options.visibleSlides)+'% }';
		}

		slideWidthStyle += '</style>';

		$("head").append(slideWidthStyle);
	}

	function _initEffects(){
		_effects.none = function(showNextSlide, movingSlides){
			var $slides 			=	_$sliderContainer.children(),
				$selectedSlides		= 	showNextSlide ? $slides.slice(0,movingSlides) : $slides.slice(-1 * movingSlides);

			showNextSlide ? _$sliderContainer.append($selectedSlides) : _$sliderContainer.prepend($selectedSlides);
		}


		_effects.slide = function(showNextSlide, movingSlides){
			var $slides 			=	_$sliderContainer.children(),
				horizontalOffset 	= 	$slides.outerWidth(true),
				$selectedSlides		= 	showNextSlide ? $slides.slice(0,movingSlides) : $slides.slice(-1 * movingSlides),
				startPosContainer 	= 	showNextSlide ? (horizontalOffset * movingSlides) : 0,
				endPosContainer		= 	(!showNextSlide) ? (horizontalOffset * movingSlides) : 0,
				maxZIndex			=	parseInt($slides.css("z-index"));

			if (showNextSlide){
				_$sliderContainer.append($selectedSlides);		
			}

			_$sliderContainer.css("left", startPosContainer + "px");

			$selectedSlides.each( 
				function(i){
					$(this).css({
						position: "absolute",
						left: (horizontalOffset * (i - movingSlides)) + "px",
						"z-index": maxZIndex + 1
					});
				}
			);				

			_$sliderContainer.animate({
				left: endPosContainer + "px"
			}, _options.transitionTime
			,function(){
				if (!showNextSlide){
					_$sliderContainer.prepend($selectedSlides);
				}
				_$sliderContainer.css("left", "");
				$selectedSlides.css({
					position: "",
					left: "",
					"z-index": ""
				});
			});
		}

		_effects.fade = function(showNextSlide, movingSlides){
			var $slides 			=	_$sliderContainer.children(),
				$selectedSlides		= 	showNextSlide ? $slides.slice(0,movingSlides) : $slides.slice(-1 * movingSlides),
				originalOpacity		=	_$sliderContainer.css("opacity");

			originalOpacity	= !!(originalOpacity) ? originalOpacity : 1;

			_$sliderContainer.animate({
				opacity: 0
			}, _options.transitionTime / 2,
			function(){
				showNextSlide ? _$sliderContainer.append($selectedSlides) : _$sliderContainer.prepend($selectedSlides);

				_$sliderContainer.animate({
					opacity: originalOpacity
				}, _options.transitionTime / 2, function(){
					_$sliderContainer.attr("style","");
				});
			});
		}
	}

	function _verticalCenterSlide(){
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

			var visibleSlides = Math.ceil(_$sliderContainer.outerWidth() / _$sliderContainer.find('.responSlider-slide').outerWidth());

			_effects[_options.effect](showNextSlide, Math.min(_options.movingSlides, visibleSlides));
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
		$(window).load(_verticalCenterSlide).resize(_verticalCenterSlide);
	}	

	$(_options.previousSlideAction).click(function(ev){ ev.preventDefault(); that.slideTransition(false)});
	$(_options.nextSlideAction).click(function(ev){ ev.preventDefault(); that.slideTransition(true)});

};