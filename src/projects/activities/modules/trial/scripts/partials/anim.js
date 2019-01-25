import $ from 'jquery'
var winWidth = $(window).width();
$(".index")
  .off("click", ".loading")
  .on("click", ".loading", function () {
    $(".index .welcome").addClass("hide");
    $("#video1")[0].play();
    setTimeout(function () {
      $("#video1").removeClass("hide");
    }, 200);
  });
$("#video1").on("ended", function () {
  $(".index .shouji").removeClass("hide");
  setTimeout(function () {
    $(".index .shouji").addClass("in");
  }, 100);
  $(".index .v1-click").removeClass("hide");
  $("#video1").addClass("hide");
});
$(".index")
  .off("click", ".v1-click")
  .on("click", ".v1-click", function () {
    $(this).addClass("hide");
    $(".index .shouji").addClass("hide");
    $(".index .shouji").removeClass("in");
    $("#video2")[0].play();
    setTimeout(function () {
      $("#video2").removeClass("hide");
    }, 200);
  });
$("#video2").on("ended", function () {
  $("#video2").addClass("hide");
  $(".index .v2-click").removeClass("hide");
  setTimeout(function () {
    $(".index .v2-click").addClass("show");
  }, 10);

});
$(".index")
  .off("click", ".over-again")
  .on("click", ".over-again", function () {
    $(".index .welcome").removeClass("hide");
    $(".index .v2-click").addClass("hide");
    $(".index .v2-click").removeClass("show");
  });
$(".index")
  .off("click", ".over-share")
  .on("click", ".over-share", function () {
    $(".index .share").removeClass("hide");
  });
$(".index")
  .off("click", ".share")
  .on("click", ".share", function () {
    $(".index .share").addClass("hide");
  });
$(".index")
  .off("click", ".over-help")
  .on("click", ".over-help", function () {
    $(".index .v2-click").addClass("hide");
    $(".index .v2-click").removeClass("show");
    $(".index .finish-box").removeClass("hide");
  });
/* var clipboard = new Clipboard(".index .btn");
clipboard.on("success", function (e) {
  _hmt.push(["_trackEvent", "button", "copy", "success"]);
  toast("复制成功");
});

clipboard.on("error", function (e) {
  _hmt.push(["_trackEvent", "button", "copy", "fail"]);
  toast("长按框内文字复制");
});
 */
function toast(text) {
  if ($(".index .toast").hasClass("hide")) {
    $(".index .toast").text(text);
    $(".index .toast").removeClass("hide");
    setTimeout(function () {
      $(".index .toast").addClass("hide");
    }, 2000);
  }
}