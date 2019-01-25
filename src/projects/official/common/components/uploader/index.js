import $ from 'jquery'
$('.j-uploader').each(function () {
  var $uploader = $(this);
  var count = $uploader.data('count') || 1;
  var num = 0;
  var results = [];
  var $hidden = $uploader.siblings('input[type=hidden]');

  function setVal() {
    $hidden.data('val', results).val(results.join(',')).trigger('blur')
  }
  $uploader.parent().on('click', '.uploader-area__close', function () {
    var $this = $(this)
    var src = $this.prev().attr('src')
    $this.parent().remove();
    results.splice(results.indexOf(src), 1);
    num--;
    if (num < count) {
      $uploader.show();
    }
    setVal();
  })
  var uploader = new window.plupload.Uploader({
    runtimes: 'html5,flash,html4',
    browse_button: $uploader.find('.uploader-picker')[0],
    url: '/file/do-image-upload?file_type=' + ($uploader.data('type') || 'warranty'),
    flash_swf_url: __uri('../../vendors/plupload/Moxie.swf'),
    file_data_name: 'file',
    filters: {
      max_file_size: '5m',
      prevent_duplicates: true,
      mime_types: [{
        title: "图片类型",
        extensions: 'jpg,gif,png'
      }]
    },
    multi_selection: count > 1,
    init: {
      FilesAdded(uploader, files) {
        let r = count - num;
        if (r > 0) {
          if (r < files.length) {
            $.alert('最多上传' + count + '张图片', 'error');
            uploader.splice(r);
          }
          uploader.start();
        }
      },
      FileUploaded(uploader, file, responseObject) {
        var res = (typeof responseObject.response == 'object') ? responseObject.response : JSON.parse(responseObject.response);
        uploader.removeFile(file)
        if (res.code === 1) {
          num++;
          $uploader.before(`<div class="uploader-area">
          <img src="${CDN_URL+res.data}">
          <span class="uploader-area__close"></span>
        </div>`)
          if (num >= count) {
            $uploader.hide();
          }
          results.push(res.data);
          setVal();
        } else {
          $.alert(res.msg, 'error');
        }
      },
      Error(up, err) {
        var msg = '上传出错!';
        if (err.code === '-600') {
          msg = '图片太大了！';
        }
        $.alert(msg, 'error');
      }
    }
  });
  uploader.init();
  window.uploader = uploader;
});