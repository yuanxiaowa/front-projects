import $ from 'jquery'
import '../../../common/components/area-list/index'
import '../../../common/components/uploader/index'
import '../../../common/components/dialog/index'

var $picker = $('#datetimepicker');
$.datetimepicker.setLocale('zh');
$picker.datetimepicker({
  format: 'Y-m-d',
  timepicker: false,
  maxDate: Date.now(),
  scrollInput: false
});
var $pm = $('#pm');
var $pmList = $pm.next();
var $pmHidden = $pm.prev();
var material_no;
function setVal(v) {
  $pmHidden.val(v).valid()
}
$pm.on('input', () => {
  var v = $pm.val().trim();
  var items = window.product_list;
  let errorText = '';
  if (v) {
    errorText=`找不到“${v}”的机器，请重试`
    v = v.toLowerCase();
    items = items.filter(item => item.market_name.toLowerCase().indexOf(v) > -1 || item.product_model.toLowerCase().indexOf(v) > -1);
  } else {
    errorText='请选择型号';
  }
  validator.settings.messages.product_model = errorText
  $pm.next().html(items.map(item => `<div class="select__item" data-id="${item.id}">${item.product_model}(${item.market_name})</div>`)).show();
}).on('focus', () => {
  $pmList.show();
}).on('change', () => {
  setVal('')
})
$pmList.on('click', '.select__item', function () {
  var $this = $(this);
  var id = $this.data('id');
  var product_model;
  product_list.forEach(item => {
    if (item.id === id) {
      material_no = item.material_no;
      product_model = item.product_model;
    }
  })
  setVal(product_model);
  $pm.val($this.text())
  $pmList.hide();
});
$(document).on('click', () => {
  $pmList.hide();
});
var $desc = $('#desc');
$desc.on('input change', () => {
  var len = $desc.val().trim().length;
  $desc.next().text(`${len}/1000字`)
})
$pm.parent().click(false)

$.validator.addMethod('mobile', function (value, element) {
  return this.optional(element) || /^0?1\d{10}$/.test(value.trim());
})
var $groupError = $('<label class="error">请填写收货地址</label>');
var areaNames = ['province', 'city', 'area', 'address'];
var validator = $('#rc-form').validate({
  ignore: '.ignore',
  rules: {
    province: {
      required: true
    },
    city: {
      required: true
    },
    area: {
      required: true
    },
    address: {
      required: true
    }
  },
  messages: {
    product_model: {
      required: '请选择型号'
    }
  },
  submitHandler(form) {
    var url = form.action;
    var method = form.method;
    var data = {
      material_no
    };
    $(form).find('[name]').each((_, item) => {
      var $this = $(item)
      var name = $this.attr('name');
      var value = item.value;
      if (name === 'attach') {
        value = value.split(',').map(url => ({
          type: 'IMAGE',
          url
        }));
      }
      if (name !== 'chk') {
        data[name] = value;
      }
    })
    $.ajax({
      url,
      method,
      data: $.param(data),
      dataType: 'json'
    }).then(res => {
      if (res.code === 1) {
        $.alert('您的保修申请已经提交！\n我们会尽快处理。');
        setTimeout(() => {
          location.href = SHOP_URL + '/account/repair/list';
        }, 1500);
      } else {
        $.alert(res.msg, 'error');
      }
    });
    return false;
  },
  errorPlacement(error, element) {
    var name = element.attr('name');
    if (areaNames.indexOf(name) > -1) {
      $groupError.appendTo(element.closest('.form-line'));
    } else {
      error.appendTo(element.closest('.form-line'));
    }
  },
  success(label, element) {
    var $ele = $(element);
    if (areaNames.indexOf($ele.attr('name')) > -1) {
      let i = areaNames.filter(name => typeof validator.invalid[name] !== 'string').length;
      if (i === 4) {
        $groupError.remove();
      }
    } else {
      label.remove();
    }
  }
})