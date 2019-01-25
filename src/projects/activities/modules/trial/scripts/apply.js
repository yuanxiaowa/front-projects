import $ from 'jquery'
import {
  config
} from './partials/wx'
// import './partials/anim'
import getCounter from './partials/countdown'

setDialog($('#dialog'), $('.j-show-dialog'));
var $toSign = $('#to_sign')
$toSign.click(() => {
  $toSign.parent().remove()

  if (!subscribe) {
    $mask.show();
    $('.j-subs').show();
  } else {
    var $captcha = $('.j-captcha');
    var $form = $('.j-wrap form');
    $form[0].noValidate = true;
    $form.show();
    $('.j-wrap').css('height', $(window).height())
    $captcha.click(function () {
      this.src = API_URL + '/captcha/showImage?_=' + Date.now();
      $('.j-captcha-line input').val('')
    });
    var $btnGetCode = $('.j-getcode');
    var countdown = getCounter($btnGetCode, 60)
    $.ajaxSettings.dataType = 'json';
    var $inputs = $form.find('input');
    var rules = [{
      required: true,
      text: '姓名'
    }, {
      required: true,
      text: '地址'
    }, {
      required: true,
      text: '手机号码',
      pattern: __regex('mobile')
    }, {
      required: false,
      text: '图片验证码',
      pattern: /^\w{5}$/
    }, {
      required: true,
      text: '验证码',
      pattern: /^\d{6}$/
    }]

    function validate(...indices) {
      for (let i of indices) {
        var v = $inputs.eq(i).val().trim()
        var rule = rules[i]
        if (!v) {
          if (rule.required) {
            return '请输入' + rule.text
          }
        } else if (rule.pattern) {
          if (!rule.pattern.test(v)) {
            return rule.text + '不正确'
          }
        }
      }
    }

    function showImageCapcha() {
      $('.j-captcha-line').show()
      rules[3].required = true
    }
    var req;
    $btnGetCode.click(() => {
      if (!countdown.valid()) {
        return;
      }
      var msg = validate(2, 3)
      if (msg) {
        return alert(msg);
      }
      if (req) {
        return;
      }
      req = $.post('/shopApi/sms/simpleSendCode/', {
        captcha: $inputs.eq(3).val().trim(),
        mobile: $inputs.eq(2).val().trim(),
        _csrf,
        type: 'trial'
      }, function ({
        data,
        code,
        msg
      }) {
        req = null;
        _csrf = data._csrf
        if (code === 1) {
          countdown.start();
        } else {
          if (code === 10018) {
            showImageCapcha()
          }
          alert(msg);
        }
      });
      req.catch(e => {
        alert('网络错误');
        req = null
      })
    });
    $inputs.each(function (i) {
      var $this = $(this);
      $this.on('input', () => {
        var msg = validate(i)
        if (msg) {
          $this.addClass('has-error')
        } else {
          $this.removeClass('has-error')
        }
      })
    })
    $form.submit(() => {
      var msg = validate(0, 1, 2, 3, 4)
      if (msg) {
        alert(msg);
      } else {
        $('#sign').prop('disabled', true)
        $.ajax({
          url: WECHAT_URL + '/wechat/trial/dj35Submit',
          method: 'post',
          data: $form.serialize()
        }).then(function ({
          code,
          msg,
          data
        }) {
          if (code === 1) {
            let url = WECHAT_URL + '/wechat/trial/dj35Share?record_id=' + data.record_id
            $('#share').show()
            $mask.show().one('click', function () {
              location.href = url;
            })
            // alert('恭喜您已报名成功！<br>快邀请好友助力，赢取大奖。');
            config(url)
          } else {
            _csrf = data._csrf || _csrf
            alert(msg);
            $('#sign').prop('disabled', false)
          }
        });
      }
      return false;
    });
  }
})