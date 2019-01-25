import $ from 'jquery'

var $mask = $('<div class="mask">').appendTo('body')

function getTemp(content) {
  return `<div class="dialog" style="display: none;">
  <div class="dialog-container">
    <div class="dialog-header">
      <i class="dialog-close"></i>
    </div>
    <div class="dialog-content">${content}</div>
  </div>
</div>`
}
export function Dialog(opt) {
  this.content = opt.content;
  this.title = opt.title;
  this.ob = $({});
  this.state = 'invisible';
  this.init();
}
var count = 0;
Dialog.prototype = {
  constructor: Dialog,
  init() {
    var $ele = this.$ele = $(getTemp(this.content))
    $ele.appendTo('body');
    $ele.on('click', '.dialog-close', () => {
      this.hide();
    })
  },
  on(type, fn) {
    this.ob.on(type, fn);
  },
  trigger(type) {
    this.ob.trigger(type);
  },
  setContent(content) {
    this.$ele.find('.dialog-content').html(content)
  },
  show() {
    if (count === 0) {
      $mask.show()
    }
    this.$ele.show();
    count++;
    this.state = 'show';
    this.trigger('visible');
  },
  hide() {
    count--;
    if (count === 0) {
      $mask.hide();
    }
    this.$ele.hide();
    this.state = 'invisible';
    this.trigger('hided');
  },
  destroy() {
    if (this.state === 'visible') {
      this.hide();
    }
    this.$ele.remove();
  }
}
$.alert = function (msg, type = 'success') {
  var content = '';
  if (type === 'error') {
    content += `<span style="color:gray" class="iconfont icon-tanhao"></span>`
  } else {
    content += '<span style="color:#f00" class="iconfont icon-chenggong"></span>'
  }
  content += '<br>';
  content += msg.replace(/\r?\n/g, '<br>');
  var dialog = new Dialog({
    content
  });
  dialog.on('hided', () => {
    dialog.destroy();
  })
  dialog.show();
  return dialog;
}
export default Dialog;