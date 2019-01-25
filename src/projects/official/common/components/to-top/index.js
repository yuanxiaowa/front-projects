export default $ => {
  var wh = $(window).height();
  var $top = $('#to-top')
  $(window).scroll(() => {
    if ($(window).scrollTop() > wh / 2) {
      $top.show();
    } else {
      $top.hide();
    }
  })
  $top.click(() => {
    $(window).scrollTop(0);
  });
}