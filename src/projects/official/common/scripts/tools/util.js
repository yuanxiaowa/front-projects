import $ from 'jquery';
var util = {
  //获取cookie
  getCookie: function (c_name) {
    if (document.cookie.length > 0) {
      let c_start = ("; " + document.cookie).indexOf("; " + c_name + "=");
      if (c_start != -1) {
        c_start = c_start + c_name.length;
        let c_end = document.cookie.indexOf(";", c_start);
        if (c_end == -1) c_end = document.cookie.length;
        return decodeURIComponent(document.cookie.substring(c_start, c_end).replace('=', ''));
      }
    }
    return ""
  },
  //是否登录
  isLogin: function () {
    var userinfo = this.userInfo();
    return !($.isEmptyObject(userinfo) || userinfo.username === '');
  },
  //用户信息
  userInfo: function () {
    var userinfo = this.getCookie('userinfo');
    if (userinfo != '') {
      return JSON.parse(userinfo);
    } else {
      return {};
    }
  },

  jsonp: function (url, callback, failCallback) {
    function getCallbackName() {
      var a = document.createElement('a');
      a.href = url;
      return a.pathname.replace(/^([^\/])/, '/$1').replace('/', '').replace(/\//g, '_');
    }
    $.ajax({
      url: url,
      dataType: 'jsonp',
      jsonp: 'jsonp_callback',
      jsonpCallback: getCallbackName(),
      async: true,
      cache: true,
      success: function (res) {
        if (res.code == '1') {
          if (typeof callback === 'function') callback(res.data, res.msg);
        } else {
          if (typeof failCallback === 'function')
            failCallback(res);
          else
            alert(res.msg);
        }
      }
    });
  }
};

export default util;