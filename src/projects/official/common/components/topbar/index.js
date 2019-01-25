import $ from 'jquery'
import util from '../../scripts/tools/util'

//刷新用户状态信息
function refreshUserInfo() {
  let userInfoDom = '';
  let user = util.userInfo();
  let callback = 'callback='+location.href;
  if (user.hasOwnProperty('username') && user.username !== '') {
    userInfoDom = `
      <span class="topbar__item">
        <span class="iconfont icon-user"></span>
        <a href="${ACCOUNT_URL}/member.html?${callback}">${user.username}</a>，<a href="${ACCOUNT_URL}/account/member/logout?${callback}">退出</a>&nbsp;|&nbsp;<a href="${ACCOUNT_URL}/member-order.html">我的订单</a>
      </span>
      <a href="${SHOP_CART_URL}" class="topbar__item cartInfo">
        <span class="iconfont icon-cart"></span>
        购物车
      </a>
    `;
  } else {
    userInfoDom = `
      <span class="topbar__item">
        <span class="iconfont icon-user"></span>
        <a href="${ACCOUNT_URL}/login.html?${callback}">登录</a>
        |
        <a href="${ACCOUNT_URL}/register.html?${callback}">注册</a>
      </span>
      <a href="${SHOP_CART_URL}" class="topbar__item cartInfo">
        <span class="iconfont icon-cart"></span>
        购物车
      </a>
    `;
  }
  $("#userinfo").html(userInfoDom);
  refreshCartInfo();
}

//刷新购物车状态
function refreshCartInfo() {
  var $cart = $("#userinfo").find(".cartInfo");
  var num = util.getCookie('user_cart_num');
  num = isNaN(num) ? 0 : +num;

  //购物车点亮或调暗
  if (num > 0) {
      $cart.addClass('has-goods');
  } else if (num == 0) {
      $cart.removeClass('has-goods');
  }
}

export default {
  refreshUserInfo,
  refreshCartInfo
};
