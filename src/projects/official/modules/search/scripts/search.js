import $ from 'jquery'

var $input = $('#sc input');

$('.j-st').click(function() {
  $(this).attr('href', (i, v) => getSearchUrl(v, $input.val()));
});

var rv = new RegExp($input.val(), 'ig');

$('.j-list a').each(function() {
  var $this = $(this);
  var t = $this.text().replace(rv, v => `<b class="text-normal">${v}</b>`);
  $this.html(t);
})