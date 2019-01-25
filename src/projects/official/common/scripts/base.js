import $ from 'jquery'
import topbar from '../components/topbar/index';
import util from './tools/util';
// import fChat from './tools/chat';
import fTop from '../components/to-top/index'

window.util = util;

function getSearchUrl(url, kw) {
  if (kw) {
    url = url.replace(/(?=\.\w+$)/, '-' + encodeURIComponent(kw.trim()));
  }
  return url;
}
window.getSearchUrl = getSearchUrl;
$(() => {
  // fChat($);
  fTop($);
  topbar.refreshUserInfo();

  $('#add-fav').click(() => {
    try {
      window.external.AddFavorite(location.href, document.title)
    } catch (e) {
      alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!')
    }
    return false;
  })

  $('form.j-sbox').submit(function () {
    var $this = $(this);
    var v = $this.find('input').val();
    if (v) {
      location.href = getSearchUrl($this.attr('action'), v);
    } else {
      alert('请输入关键字~~~');
    }
    return false;
  });
})