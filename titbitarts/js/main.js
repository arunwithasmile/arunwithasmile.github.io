var animatingBanner = true;
$(document).ready(function () {
	updateScrollItems();

	setTimeout(() => {
		animatingBanner = false;
		$('banner').removeClass('with-animation');
	}, 1000);

	$(document).scroll(updateScrollItems);

	setTimeout(() => {
		$('banner').removeClass("init");
	}, 0);
});

var frameRotate = 0,
	frameOffsetX = 0,
	frameOffsetY = 0,
	framePosTop = 0,
	frameScale = 1,
	isFrameFixed = false;

var BANNER_VANISH_POS = 180;
var BRUSH_MOVE_POS = 100;
var GREETING_START_POS = 200;
var FRAME_MOVE_START_POS = GREETING_START_POS + 1060;
var FRAME_FULL_SCREEN_POS = FRAME_MOVE_START_POS + 400;
var FRAME_SHRINK_POS = FRAME_FULL_SCREEN_POS + 800;
var FRAME_STICK_POS = FRAME_SHRINK_POS + 5000;

function updateScrollItems() {
	animateBanner = false;
	var top = $(this).scrollTop();
	console.log(top);

	if (!animatingBanner) {
		var bannerOpacity = (BANNER_VANISH_POS - top) / BANNER_VANISH_POS;
		$('banner.top').css('opacity', bannerOpacity);
	}

	if (top < FRAME_MOVE_START_POS) {
		$('object').show();
		$('object.paint.red').css('transform', 'translateX(' + top / 2 + 'px)');
		$('object.paint.blue').css('transform', 'translateX(' + top / 2 + 'px)');
		$('object.paint.green').css('transform', 'translate(' + top / 2 + 'px,-' + top / 2 + 'px)');

		var brushOffset = top > BRUSH_MOVE_POS ? (top - BRUSH_MOVE_POS) / 2 : 0;
		$('object.brush').css('transform', 'translateY(' + brushOffset + 'px)');
		$('object.brush.blue').css('transform', 'rotate(-10deg) translateY(' + brushOffset + 'px)');

		$('pframe.splash').removeAttr('style');
	} else {
		$('object').hide();
	}


	if (top < GREETING_START_POS) {
		$('banner.greeting h4').css('opacity', '0');
		$('banner.greeting h6').css('opacity', '0');
		$('banner.greeting').css('display', 'block');
	}

	if (top > GREETING_START_POS) {
		$('banner.greeting h4').css('opacity', '1');
	}

	if (top > GREETING_START_POS + 400) {
		$('banner.greeting h6').css('opacity', '1');
	}

	if (top > FRAME_MOVE_START_POS) {
		$('banner.greeting h4').css('opacity', '0');
		$('banner.greeting h6').css('opacity', '0');
		setTimeout(() => {
			$('banner.greeting').css('display', 'none');
		}, 1000);
	}

	// 360 to 760 Frame moves
	if (top > FRAME_MOVE_START_POS && top <= FRAME_FULL_SCREEN_POS) {

		frameRotate = 16 - (top > FRAME_MOVE_START_POS ? (top - FRAME_MOVE_START_POS) / (FRAME_FULL_SCREEN_POS - FRAME_MOVE_START_POS) * 16 : 0);
		frameOffsetX = -65 + (top > FRAME_MOVE_START_POS && top <= FRAME_FULL_SCREEN_POS ? (top - FRAME_MOVE_START_POS) / (FRAME_FULL_SCREEN_POS - FRAME_MOVE_START_POS) * 65 : 0);
		frameOffsetY = 100 - (top > FRAME_MOVE_START_POS && top <= FRAME_FULL_SCREEN_POS ? (top - FRAME_MOVE_START_POS) / (FRAME_FULL_SCREEN_POS - FRAME_MOVE_START_POS) * 100 : 0);
		frameScale = 0.6 + (top > FRAME_MOVE_START_POS && top <= FRAME_FULL_SCREEN_POS ? (top - FRAME_MOVE_START_POS) / (FRAME_FULL_SCREEN_POS - FRAME_MOVE_START_POS) * 0.4 : 0);
		$('pframe.splash').css('transform', 'scale(' + frameScale + ') rotate(' + frameRotate + 'deg) translate(' + frameOffsetX + 'vw, ' + frameOffsetY + 'vh)');
	} else if (top > FRAME_FULL_SCREEN_POS && top <= FRAME_SHRINK_POS) {
		frameRotate = 0;
		frameOffsetX = 0;
		frameOffsetY = 0;
		frameScale = 1;
		$('pframe.splash').css('transform', 'scale(' + frameScale + ') rotate(' + frameRotate + 'deg) translate(' + frameOffsetX + 'vw, ' + frameOffsetY + 'vh)');
	} else if (top > FRAME_SHRINK_POS && top < FRAME_STICK_POS) {
		frameScale = (FRAME_SHRINK_POS / top);
		frameOffsetY = (FRAME_SHRINK_POS - top) / 200;
		$('pframe.splash, lroom pframe').css('transform', 'scale(' + frameScale + ') rotate(' + frameRotate + 'deg) translate(' + frameOffsetX + 'vw, ' + frameOffsetY + 'vh)');
		framePosTop = top;

	}
	
	if (top < (FRAME_SHRINK_POS + FRAME_STICK_POS) / 2) {
		$('pframe.splash').css('display', 'block');
		$('lroom pframe').css('display', 'none');
	} else {
		$('pframe.splash').css('display', 'none');
		$('lroom pframe').css('display', 'block');
	}

	if (top > (FRAME_SHRINK_POS + FRAME_STICK_POS) / 2) {
		$('pframe.splash').css('display', 'none');
	}

	console.log("frameRotate: " + frameRotate + "deg");
	console.log("frameOffset: " + frameOffsetX + "," + frameOffsetY);
	console.log("frameScale: " + frameScale);

}