import $ from 'jquery'
import './partials/wx'
$.ajaxSettings.dataType = 'json';
setDialog($('#dialog'), $('.j-show-dialog'));
var rankLoaded = false
setDialog($('#dialog2'), $('.j-show-dialog2'), $dialog => {
  if (rankLoaded) {
    return
  }
  $.get('/wechat/trial/dj35Rank').then(({
    data
  }) => {
    rankLoaded = true
    if (!data.length) {
      $dialog.find('ul li').text('暂无记录！')
      return
    }
    $dialog.find('ul').html(data.map(item => `<li>${item}</li>`).join(''))
  })
});

if (!oauth_avatar) {
  $('#avatar').attr('src', defaultAvatar)
}

if (!past_due) {
  ((n, $ele) => {
    var $spans = $ele.find('span');
    var secPerDay = 60 * 60 * 24;
    var secPerHour = 60 * 60;
    var secPerMin = 60;

    function countdown() {
      if (n <= 0) {
        past_due = true;
        $ele.text('本期活动已经结束，下期活动即将开启');
        $('.j-wrap').addClass('is-past-date');
        return;
      }
      var d = n / secPerDay >> 0;
      var h = (n - d * secPerDay) / secPerHour >> 0;
      var m = (n - d * secPerDay - h * secPerHour) / secPerMin >> 0;
      $spans.eq(0).text(d < 10 ? '0' + d : d);
      $spans.eq(1).text(h < 10 ? '0' + h : h);
      $spans.eq(2).text(m < 10 ? '0' + m : m);
      var t = (n - d * secPerDay - h * secPerHour - m * secPerMin) || 60;
      setTimeout(countdown, t * 1000);
      n -= t;
    }
    countdown();
  })(remain_seconds, $('.j-countdown'));
}
var req;
var $num = $('.j-num');
var isRecord = false;
var isAuthor = oauth_user_id === openid;

function showShare() {
  $mask.show();
  $('#share').show();
  $mask.one('click', function () {
    $mask.hide();
    $('#share').hide();
  })
}
$('.j-witness').click(function () {
  var $this = $(this);
  $this.addClass('is-clicking');
  setTimeout(() => {
    $this.removeClass('is-clicking')
  }, 300);
  if (past_due) {
    return;
  }
  if (isRecord) {
    return alert('已成功为好友助力，你也来试试吧！');
  }
  if (isAuthor) {
    showShare();
    return;
  }
  if (req || isRecord) {
    return;
  }
  req = $.post(WECHAT_URL + '/wechat/trial/dj35Fighting', {
    record_id
  });
  req.then(({
    code,
    msg,
    data
  }) => {
    req = null;
    isRecord = code === 1;
    if (!isRecord) {
      return alert(msg);
    }
    var num = +$num.text();
    $num.attr('data-num', data.score)
    $num.addClass('is-adding');
    setTimeout(() => {
      $num.removeClass('is-adding');
      $num.text(num + data.score);
    }, 1000);
    setTimeout(() => {
      $('.j-star').addClass('is-adding');
    }, 300);
  })
})
$('.j-sign').click(() => {
  if (past_due) {
    return false
  }
  if (isAuthor) {
    showShare()
    return false
  }
});