$(document).ready(function() {
	updateScrollItems();
	$(document).scroll(updateScrollItems);

});

var frameRotate = 0,
frameOffsetX = 0,
frameOffsetY = 0,
framePosTop = 0,
frameScale = 1,
isFrameFixed = false;

function updateScrollItems() {
	var top = $(this).scrollTop();
	console.log(top);
	
	var bannerOpacity = (130-top)/130;
	$('banner').css('opacity', bannerOpacity);

	$('object.paint.red').css('transform','translateX('+top/2+'px)');
	$('object.paint.blue').css('transform','translateX('+top/2+'px)');
	$('object.paint.green').css('transform','translate('+top/2+'px,-'+top/2+'px)');
	
	var brushOffset = top > 100 ? (top-100)/2 : 0;
	$('object.brush').css('transform','translateY('+brushOffset+'px)');
	$('object.brush.blue').css('transform','rotate(-10deg) translateY('+brushOffset+'px)');

	// 360 to 760 Frame moves
	if(top > 360 && top <= 760) {
		frameRotate = 16 - (top > 360 ? (top - 360) / (760 - 360) * 16 : 0);
		// if(frameRotate < 0) {
		// 	frameRotate = 0;
		// }
		frameOffsetX = -65 + (top > 360 && top <= 1350 ? (top - 360) / (760 - 360) * 65 : 0);
		// if(frameOffsetX > 0){
		// 	frameOffsetX = 0;
		// }
		frameOffsetY = 100 - (top > 360 && top <= 1350 ? (top - 360) / (760 - 360) * 100 : 0);
		// if(frameOffsetY < 0){
		// 	frameOffsetY = 0;
		// }
		frameScale = 0.6 + (top > 360 && top <= 1350 ? (top - 360) / (760 - 360) * 0.4 : 0);
		// if(frameScale > 1){
		// 	frameScale = 1;
		// }

		$('pframe.splash').css('transform', 'scale(' + frameScale + ') rotate(' + frameRotate + 'deg) translate(' + frameOffsetX + 'vw, ' + frameOffsetY + 'vh)');
	} else if (top > 760 && top <= 1350) {
		frameRotate = 0;
		frameOffsetX = 0;
		frameOffsetY = 0;
		frameScale = 1;
		$('pframe.splash').css('transform', 'scale(' + frameScale + ') rotate(' + frameRotate + 'deg) translate(' + frameOffsetX + 'vw, ' + frameOffsetY + 'vh)');
	}
	
		console.log("frameRotate: " + frameRotate + "deg");
		console.log("frameOffset: " + frameOffsetX + "," + frameOffsetY);
		console.log("frameScale: " + frameScale);

	if(top > 1350 && top < 3500) {
		frameScale = (1350 / top);
		frameOffsetY = (1350 - top) / 60;
		$('pframe.splash').css('transform', 'scale(' + frameScale + ') rotate(' + frameRotate + 'deg) translate(' + frameOffsetX + 'vw, ' + frameOffsetY + 'vh)');
		framePosTop = top;
	}

	if(top >= 3700) {
		if(!isFrameFixed) {
			console.log("framePosTop: " + framePosTop);
			$('pframe.splash').css('position', 'absolute');
			$('pframe.splash').css('top', top + 'px');
			$('pframe.splash').css('z-index', '0');
			isFrameFixed = true;
		}
	} else if(isFrameFixed) {
		$('pframe.splash').css('position', 'fixed');
		$('pframe.splash').css('top', '0');
		$('pframe.splash').css('z-index', '10');
		isFrameFixed = false;
	}
}