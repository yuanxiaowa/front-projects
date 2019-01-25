import $ from 'jquery'

var $con = $('#con'), $timeline = $('#timeline'), timeline_items = '';

function getTemplate(item) {
  var html = ``;
  if (item.img) {
    html += `<div class="row__right"><img src="${item.img}"></div>`
  }
  html += '<div class="row__content">';
  html += `<h2>${item.year}</h2>`;
  html += $.map(item.events, name => `<p>${name}</p>`).join('');
  html += '</div>';
  return html;
}

function selectItem(index){
  $timeline.find('.evt-timeline__item:eq('+index+')').addClass('is-selected').siblings().removeClass('is-selected');
  $con.html(getTemplate(items[index]));
}

$.each(items, function(k, v){
  timeline_items += `
    <div class="evt-timeline__item">
      <div>${v.year}</div>
    </div>
  `;
});
$timeline.html(timeline_items)
.on('mouseover', '.evt-timeline__item', function () {
  selectItem($(this).index());
});
//选项宽度自适应
$(".evt-timeline__item").css({maxWidth: ($timeline.width()-100)/items.length});
selectItem(0);