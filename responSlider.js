var $sliderContainers,
	$navegador,
	$container,
	$img;

$(function(){

	$sliderContainers = $(".slider-container");
	$navegador = $("#navegador");
	$container = $("#wrapper");
	$img = $(".slide-foto > img");

	$(window).scroll(function(){
		var $this = $(this);

		//TODO No hacer cambio siempre, sólo cuando se pasa el límite

		if ($this.scrollTop() >= $("#header").outerHeight(true)){
			$navegador.css({
				position : "fixed",
				top: "0px"			
			});			
			$container.css({
				"padding-top": $navegador.height()
			});
		}
		else{
			$navegador.attr("style", "");
			$container.attr("style", "");
		}
	});

	$(window).load(centraImagenes).resize(centraImagenes);
});

function centraImagenes(){
	$img.map(function(){
		var $this = $(this);
		$this.css({
			"margin-top" : ($this.outerHeight() / 2) * (-1)
		});
	});
}

function mueveFicha(id, avanza){
	var $sliderContainer = $sliderContainers.filter("#"+id),
		$slides = $sliderContainer.find(".slide"),
		selectedPos = avanza ? 0 : ($slides.length - 1),
		$selectedSlide = $($slides[selectedPos]),
		avance = $slides.outerWidth(true),
		posContainer = avanza ? avance : 0;

	if ($sliderContainer.filter(":animated").length == 0){

		if (avanza){
			$sliderContainer.append($selectedSlide);		
		}

		$sliderContainer.css("left", posContainer + "px");

		$selectedSlide.css({
			position: "absolute",
			left: (-1 * avance) + "px",
			"z-index": 3
		});				
		
		$sliderContainer.animate({
			left: (avance - posContainer) + "px"
		}, 800
		,function(){
			$sliderContainer.attr("style","");	
			$selectedSlide.attr("style","");
			if (!avanza){
				$sliderContainer.prepend($selectedSlide);
			}		
		});

	}

}

function scrollA(seccion){
	var $seccion = $(seccion);
	var top = $seccion.offset().top - $seccion.outerHeight()/2 - $navegador.outerHeight()/2;
	$("html,body").animate({scrollTop: top},1000);
}