import img from '../../images/goods.jpg'


var imgUrl = img
if (img.startsWith('//')) {
  imgUrl = location.protocol + imgUrl
}

export function config(link) {
  var title = '我正在参加科沃斯机器人新品免费试用活动';
  var desc = '你不来吗？';
  if (link.indexOf('_f') === -1) {
    if (link.indexOf('?') === -1) {
      link += '?';
    } else {
      link += '&';
    }
    link += '_f=' + openid;
  }
  wx.onMenuShareTimeline({
    title, // 分享标题
    link, // 分享链接 
    imgUrl, // 分享图标
    success() {
      // 用户确认分享后执行的回调函数
      (typeof (_jtimelineshare) == 'function') && _jtimelineshare(true);
    },
    cancel() {
      // 用户取消分享后执行的回调函数
      (typeof (_jtimelineshare) == 'function') && _jtimelineshare(false);
    }
  });
  wx.onMenuShareAppMessage({
    title, // 分享标题
    desc, // 分享描述
    link, // 分享链接
    imgUrl, // 分享图标
    success() {
      (typeof (_jappshare) == 'function') && _jappshare(true);
    },
    cancel() {
      // 用户取消分享后执行的回调函数
      (typeof (_jappshare) == 'function') && _jappshare(false);
    }
  });
}

(typeof (_jinit) == 'function') && _jinit(openid);
(typeof (_ja) == 'function') && _ja(click_action);
wx.config(jsSDKConfigJSON);
wx.ready(() => {
  config(link)
});