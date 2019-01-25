import $ from 'jquery'

var $helper = $('#helper');
$helper.children().click(function () {
  var index = $(this).index();
  if (index === 0) {
    $helper.next().show();
  } else {
    $helper.next().next().show();
  }
  $helper.remove();
  $.post('/product/question-answer-feedback', {
    id: window.qid,
    is_help: index === 0 ? 'Y' : 'N'
  })
  return false;
})


var $rlqs = $('#rlqs')
var $rlqsResult = $('<div class="rlqs__result">');
var curQs = rlqs && rlqs.stepDTOList && rlqs.stepDTOList[0];
var i = 0;

function getAs(i) {
  return item => `<div class="rlqs__as"><label><input name="rlqs${i}" type="radio" value="${item.nextStepId}">${item.checkingResult}</label></div>`
}

function getItem(item, i) {
  return `<div class="rlqs__item" data-id="${item.id}">
    <div class="rlqs__title">
      <span class="rlqs__label">步骤${i}</span>${item.stepTitle}
    </div>
    <div class="rlqs__content">
      ${$.map(item.checkingResultDTOList, getAs(i)).join('')}
    </div>
  </div>`;
}

function getQsById(id) {
  for (let i = 0, len = rlqs.stepDTOList.length; i < len; i++) {
    let item = rlqs.stepDTOList[i];
    if (item.id == id) {
      return item;
    }
  }
}
if (curQs) {
  $rlqs.append($(getItem(curQs, i + 1)))
}

$rlqs.on('change', ':radio', function () {
  var nextId = this.value;
  var $this = $(this);
  var $item = $this.closest('.rlqs__item');
  $item.nextAll().remove();
  if (nextId != 0) {
    curQs = getQsById(nextId);
    i = $item.index() + 1;
    $item.after($(getItem(curQs, i + 1)));
  } else {
    curQs = getQsById($item.data('id'));
    $rlqsResult.html(curQs.checkingResultDTOList[$this.parent().parent().index()].conclusionContext).appendTo($rlqs);
  }
})