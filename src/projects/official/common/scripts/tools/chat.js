export default $ => {
  var $body = $('body');
  var NTKF_SITEID = 'kf_9290',
    NTKF_SETTINGID = 'kf_9290_1469524199094'; //默认的接待组编号

  //如果有额外的参数则赋给小能，没有则直接调用
  //基本参数
  window.NTKF_PARAM = {
    siteid: NTKF_SITEID, //企业ID，为固定值，必填
    settingid: NTKF_SETTINGID, //接待组ID，为固定值，必填
    uid: "0", //用户ID，未登录可以为空，但不能给null，uid赋予的值显示到小能客户端上
    uname: '', //用户名，未登录可以为空，但不能给null，uname赋予的值显示到小能客户端上
    isvip: "0", //是否为vip用户，0代表非会员，1代表会员，取值显示到小能客户端上
    userlevel: "1", //网站自定义会员级别，0-N，可根据选择判断，取值显示到小能客户端上
    erpparam: {
      sign: '',
      uid: '0',
      uname: '',
      isvip: '0'
    } //erpparam为erp功能的扩展字段，可选，购买erp功能后用于erp功能集成
  };

  if (typeof SELF_NTKF_PARAM !== 'undefined' && !$.isEmptyObject(SELF_NTKF_PARAM)) $.extend(NTKF_PARAM, SELF_NTKF_PARAM);

  //初始化用户信息
  var userinfo = util.userInfo();
  if (!$.isEmptyObject(userinfo) && userinfo.username != '') {
    NTKF_PARAM.uid = userinfo.uid;
    NTKF_PARAM.uname = userinfo.username == null ? '' : userinfo.username;
    NTKF_PARAM.isvip = userinfo.isvip;
    NTKF_PARAM.userlevel = userinfo.group_id;

    //扩展字段
    NTKF_PARAM.erpparam.sign = userinfo.sign;
    NTKF_PARAM.erpparam.uid = NTKF_PARAM.uid;
    NTKF_PARAM.erpparam.uname = NTKF_PARAM.uname;
    NTKF_PARAM.erpparam.isvip = NTKF_PARAM.isvip;
  }
  NTKF_PARAM.erpparam = encodeURIComponent(JSON.stringify(NTKF_PARAM.erpparam));

  $.getScript('//dl.ntalker.com/js/xn6/ntkfstat.js?siteid=' + NTKF_SITEID, function () {
    $body.on('click', '.openChatBox', function (event) {
      event.preventDefault();
      var settingid = $(this).attr('data-group');
      settingid = settingid !== undefined ? settingid : NTKF_SETTINGID;
      NTKF.im_openInPageChat(settingid);
    });
  });
}