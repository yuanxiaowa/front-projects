import $ from 'jquery'

export var $mask = $('<div class="mask"></div>').prependTo('body')
export default function($dialog, $btn, onOpen) {
  $btn.click(() => {
    $dialog.show();
    $mask.show()
    onOpen && onOpen($dialog)
    return false;
  });
  $dialog.on('click', '.j-dialog-close', () => {
    $dialog.hide();
    $mask.hide()
    return false;
  });
}