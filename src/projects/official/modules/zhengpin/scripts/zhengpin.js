$('#zpform').submit(check_barcode);

$("[name='sn_number']:input").change(function (event) {
  check_barcode();
});

function check_barcode() {
  var $sn_number = $('#zpform').find("[name='sn_number']"),
    sn_number = $.trim($sn_number.val());
  if (sn_number === '' || !/^e\d{19}$/i.test(sn_number)) {
    $sn_number.next().text('请输入正确的SN码');
    // $sn_number.val('');
    return false;
  } else {
    $sn_number.next().text('');
    return true;
  }
}