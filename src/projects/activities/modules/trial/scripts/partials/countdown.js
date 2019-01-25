import $ from 'jquery'

export default ($btn, sec) => {
  var remain = 0;
  function countdown() {
    if (remain === 0) {
      $btn.text('重新发送')
    } else {
      $btn.text(remain + 's');
      setTimeout(() => {
        --remain;
        countdown();
      }, 1000);
    }
  }
  return {
    start() {
      remain = sec;
      countdown();
    },
    valid() {
      return remain <= 0;
    }
  };
}