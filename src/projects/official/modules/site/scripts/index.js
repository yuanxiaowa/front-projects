import '../../../common/components/slider/index'

//首页广告
// $.getScript(__uri('../../../common/vendors/adv.js'));
function setCookie(name,value){ 
    var date = new Date();
    var expipres = new Date(date.getFullYear(), date.getMonth(), date.getDate()+1); 
    document.cookie = name + "="+ escape (value) + ";expires=" + expipres.toGMTString(); 
} 

if( util.getCookie('pc_ad_300102') != 1 ){
  $(".topbar").before('<div class="home-top-ad" data-adv="300102" data-closeBtn="1" data-overscreen="1"></div>');
  $(".home-top-ad").on('click', '.kws-ad-close', function(){
    setCookie('pc_ad_300102', 1);
  });
}

//全屏广告
if( util.getCookie('pc_fullscreen_300101') != 1 ){
  util.jsonp(API_URL+'/commonApi/gInfo/g_key/300101', function (res) {
      if($.isEmptyObject(res)) return;
      var ad = res[0];
      var $elem = $('<div class="m-fullscreen-ad"><div class="mask" style="z-index: 99;"></div><div class="ad-main" style="z-index: 999;"><i class="close"></i><div class="ad-content"></div></div></div>').appendTo($("body"));
      $elem.find('.ad-content').css({width:$(window).width(), height:$(window).height()}).html('<a ga="ADG-300101/click/ADP-'+ad.adId+'" href="'+ad.url+'" target="'+ad.link_target+'"><img src="'+ad.img+'"></a>');
      $elem.find('.close').on('click', function () {
          $elem.remove();
      });
      setTimeout(function(){$elem.remove();}, 8000);//8秒后自动关闭
  });
}else{
  $("div[data-adv='300101']").remove();
}