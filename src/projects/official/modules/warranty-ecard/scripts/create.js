import $ from 'jquery'
import '../../../common/components/uploader/index'
import '../../../common/components/dialog/index'

var $snCode = $('#sn_code');
var timer;
var $productModel = $('input[name=product_model]');
var $materialNo = $('input[name=material_no]');
$snCode.on('input', () => {
  if (!$snCode.valid()) {
    return;
  }
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    if (!$snCode.valid()) {
      return;
    }
    var v = $snCode.val();
    if (!v) {
      return;
    }
    $.getJSON('/warranty-ecard/get-product?sn_code=' + v).then(res => {
      if (res.code === 1) {
        $productModel.val(res.data.product_model);
        $materialNo.val(res.data.material_no);
      }
      timer = null;
    });
  }, 200);
})

$.validator.addMethod('mobile', function (value, element) {
  return this.optional(element) || /^0?1\d{10}$/.test(value.trim());
})
$.validator.addMethod('sncode', function (value, element) {
  return this.optional(element) || /^E\w{19}$/.test(value.trim());
})
var $form = $('#rc-form')
$form.validate({
  ignore: '.ignore',
  submitHandler() {
    $.ajax({
      url: $form.attr('action'),
      method: $form.attr('method'),
      data: $form.serialize(),
      dataType: 'json'
    }).then(res => {
      if (res.code === 1) {
        var href = SHOP_URL + '/account/warrantyEcard/list';
        var html = `<b>恭喜您添加成功！</b><br><br><p style="color:red;text-decoration:underline"><a href="${href}">查看我的电子保修卡</a></p><p class="text-desc">（您也可以进入我的个人中心，查看我的电子保修卡）</p>`
        $.alert(html).on('hided', () => {
          location.href = href;
        });
      } else {
        $.alert(res.msg, 'error');
      }
    })
  }
})