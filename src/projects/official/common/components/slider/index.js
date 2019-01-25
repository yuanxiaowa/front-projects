import $ from 'jquery'

var $slider = $('.j-slider');
var $wrapper = $slider.find('.j-slider-wrapper');
var len = $wrapper.children().length;
var $arrows = $slider.find('.j-slider-arrow').children();
var $bullets = $slider.find('.j-slider-bulltet').children();

var w = $wrapper.width();
$wrapper.width(w * len);
$wrapper.children().width(w);

function sliderTo(index) {
  $wrapper.stop().animate({
    marginLeft: -index * w
  });
  $bullets.eq(index).addClass('is-selected').siblings().removeClass('is-selected');
}

var st;
var delay = 3000;
var cur = 0;

$slider
  .mouseenter(() => {
    clearTimeout(st);
  })
  .mouseleave(animate);

function animate() {
  st = setTimeout(() => {
    sliderTo(cur++);
    cur = cur % len;
    animate();
  }, delay);
}
animate();
$arrows.click(function () {
  var index = $(this).index();
  if (index === 0) {
    cur--;
  } else {
    cur++;
  }
  cur = (cur + len) % len;
  sliderTo(cur);
});
$bullets.click(function () {
  cur = $(this).index();
  sliderTo(cur);
});