(function($, window, document, undefined){
    var UID = (typeof ecovacs_current_userid !== 'undefined') ? +ecovacs_current_userid : 0,
        ADV_URL = '//g.ecovacs.cn';
    var $window = $(window),winWidth = $window.width(),winHeight = $window.height();

    //类型字典
    var advTypeDict = {
        6: 'richtext',  //富文本+图片类型
        5: 'richtext',  //富文本类型
        4: 'richtext',  //code类型
        3: 'text',      //文本类型
        1: 'image'      //图片类型
    };
    //效果字典
    var advEffectDict = {
        0: 'normal',    //无效果
        1: 'carousel',  //轮播效果
        3: 'layer'      //弹层效果
    };
    var style = '<style>' +
        '.kws-ad-close{z-index: 9999;position: absolute;top: 0;right: 0;width: 19px;height: 19px;font-size: 20px;background: rgba(0,0,0,.2) none repeat scroll 0 0!important;filter: alpha(opacity=20);background: #000;text-align: center;line-height: 19px;cursor: pointer;}' +
        '.kws-ad-close:hover{background:rgba(0, 0, 0, 0.3) none repeat scroll 0 0 !important;filter:Alpha(opacity=30); background:#000;}.kws-ad-close>span{position: relative;display: block;color: #fff;}' +
        '.kws-ad-modal{z-index: 99999;position: fixed !important;opacity: 0.5;background:#000;top:0;left:0;right:0;bottom:0;width:100%}' +
        '.kws-ad-layer{z-index: 999999 !important;position: absolute;overflow: hidden;}' +
        '.kws-ad-layer-closeBtn{width: 80px;height:80px;overflow:hidden;position:absolute;right:-2px;top: -2px;cursor: pointer}' +
        '.kws-ad-overscreen{position:absolute;width:4000px;left:50%;margin-left:-2000px;top:0;text-align:center;}' +
        '</style>';
    $(style).appendTo('head');

    //广告点击统计
/*    $('body').on('click', 'div[data-adid]', function(event){
        event.stopPropagation();
        var query = '';
        query += 'ad_list_id='+$(this).attr('data-adid');
        query += '&ad_key='+$(this).attr('data-adkey');
        query += '&uid='+UID;
        query += '&put_in_url='+encodeURIComponent(location.href);

        //数据发送给后台
        $.ajax({
            url: ADV_URL+'/statistics/AddClick?'+query,
            dataType: "jsonp",
            success: function(){}
        });

    });*/

    //轮播效果
    carousel = function(elements){
        if (elements.length <= 1){
            elements.fadeIn();
            return;
        }
        var self = this;
        var $elements = [];
        self.total = elements.length;
        self.current = null;
        self.currInterval = null;

        self.init = function() {
            for(i=0; i<self.total; i++){
                var $item = $(elements[i]);
                $item.hide();
                $elements.push($item);
            }
            self.current = 0;
            self.start();
            return $elements;
        };
        //开始
        self.start = function(){
            var $item = $elements[self.current];
            $item.fadeIn('slow', 'linear');
            self.currInterval = setTimeout(function() {
                self.next();
            }, 5000);
            return self;
        };
        //切换到下一个
        self.next = function(){
            var target = self.current + 1;
            if(target >= self.total) {
                target = 0;
            }
            $elements[self.current].fadeOut('fast', 'linear');
            self.current = target;
            self.stop().start();
            return self;
        };
        //终止当前元素
        self.stop = function() {
            clearTimeout(self.currInterval);
            return self;
        };

        return self.init();
    };

    //弹层效果
    layer = function($ele, duration){
        var $closeBtn;
        var closeImg = 'data:image/png;base64,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';

        var $modal = $("<div></div>").addClass('kws-ad-modal')
            .css({'height':$(document).height()})
            .appendTo('body');
        $ele.addClass('kws-ad-layer')
            .css({'left':(winWidth-$ele.width())/2, 'top':$window.scrollTop()+(winHeight-$ele.height())/2});
        $closeBtn = $('<div class="kws-ad-layer-closeBtn"><img src="'+closeImg+'"></div>');
        $closeBtn.click(function(){
            $ele.remove();
            $modal.remove();
        });
        $closeBtn.prependTo($ele);
        //广告播放持续时间
        if(duration) setTimeout(function(){$ele.remove();$modal.remove();}, duration*1000);
    };

    //广告处理类
    Adv = function($ele, advData){
        var self = this;

        //广告内容
        self.init = function() {
            self.posId = advData.posId;
            //广告内容类型，1:文字 2:图片
            self.type = self.mapType(+advData.type);
            //广告展示效果
            self.effect = self.mapEffect(+advData.effect);
            self.data = advData.list;
            self.duration = +advData.duration;//单位s
            self.width = !!advData.width?advData.width:$ele.width();
            self.height = !!advData.height?advData.height:$ele.height();

            //是否需要关闭按钮
            self.closeBtn = !!$ele.attr('data-closeBtn');

            //是否超屏幕
            self.isOverscreen = !!$ele.attr('data-overscreen');

            self.render();
        };

        //广告类型映射
        self.mapType = function(type){
            return advTypeDict.hasOwnProperty(type) ? advTypeDict[type] : '';
        };

        //广告效果映射
        self.mapEffect = function(effect){
            return advEffectDict.hasOwnProperty(effect) ? advEffectDict[effect] : 'normal';
        };

        //广告dom渲染
        self.render = function(){
            var fun = 'render'+self.ucfirst(self.type);
            if( typeof self[fun]==='function' ){
                if(self.closeBtn){
                    $ele.css({"position": "relative"});
                    $('<div class="kws-ad-close"><span>×</span></div>')
                        .appendTo($ele)
                        .click(function(){
                            $(this).parent().hide();
                        });
                    $(".top-ad-1 .kws-ad-close").css({"right":(winWidth-1140)/2});
                }
                var $div = self[fun]();

                if(self.isOverscreen){
                    $div.addClass('kws-ad-overscreen').appendTo($ele);
                    //保证图片不会撑开
                    $('img', $div).css({"max-height": "100%"});
                }else{
                    $div.css({"width": self.width?self.width:'100%', "height": self.height?self.height:'100%', "overflow": "hidden"}).appendTo($ele);
                    //保证图片不会撑开
                    $('img', $div).css({"max-width": "100%", "max-height": "100%"});
                }

                //播放效果
                self.effects();

                //展示广告
                $ele.show();
            }

            $.fn.lazyload && $('img', $ele).lazyload();
        };

        //a标签渲染
        self.aDom = function(item){
            var html;
            var target = item.hasOwnProperty('link_target') && item.link_target ? item.link_target : '_blank';
            html = '<div class="item" data-adkey="'+self.posId+'" data-adid="'+item.adId+'"><a href="'+item.url+'" target="'+target+'">'+item.content+'</a></div>';
            return html;
        };

        //纯文字广告
        self.renderText = function(){
            var html = '';
            var data = self.data;
            var $div = $('<div class="kws-adv text"></div>');
            for(i in data){
                var item = data[i];
                item.content = item.text;
                html += self.aDom(item);
            }
            $div.html(html);
            $('.item', $div).css({"width": "100%", "line-height": self.height+'px'});
            return $div;
        };

        //图片广告
        self.renderImage = function(){
            var html = '';
            var $div = $('<div class="kws-adv image"></div>');
            var data = self.data;
            for(i in data){
                var item = data[i];
                item.content = '<img src="'+item.img+'">';
                html += self.aDom(item);
            }
            $div.html(html);
            $('.item', $div).css({"width": "100%", "height": "100%", "float": "left"});
            return $div;
        };

        //富文本/code广告
        self.renderRichtext = function(){
            var html = '';
            var data = self.data;
            var $div = $('<div class="kws-adv richtext"></div>');
            for(i in data){
                var item = data[i];
                html += '<div class="item" data-adkey="'+self.posId+'" data-adid="'+item.adId+'">'+item.content+'</div>';
            }
            $div.html(html);
            return $div;
        };

        //切换效果，仅适用于多个元素
        self.effects = function(){
            if( self.effect==='normal' ) return;
            if( self.effect==='carousel' ) return new carousel($('div.item', $ele));
            if( self.effect==='layer' ) return new layer($ele, self.duration);
        };

        //首字母大写
        self.ucfirst = function(str) {
            return (str + '').toLowerCase().replace(/^./, function(match) {
                return match.toUpperCase();
            });
        };
        return self.init();
    };

    $.fn.kwsAdv = function(opt) {
        var $elements = $(this), $ads = {}, query = '';
        if($elements.length == 0) return;

        $elements.each(function(){
            var posId = $(this).attr('data-adv');
            if(posId!==undefined && posId){
                $ads[posId] = $(this);
                query += '_'+posId;
                //避免重复渲染广告
                $(this).removeAttr('data-adv');
            }
        });

        if(query !== ''){
            query = 'ids' + query;
            $.ajax({
                url: ADV_URL+'/info/get/g_key/'+query,
                dataType: "jsonp",
                jsonp: 'jsonp_callback',
                jsonpCallback: query,
                async: true,
                cache: true,
                success: function(res){
                    if( $.isEmptyObject(res.data) ) return;
                    var data = res.data;
                    for(i in data){
                        var advData = data[i], posId = advData['ad_key'];
                        if(posId>0){
                            advData['posId'] = +posId;
                            new Adv($ads[posId], advData);
                        }
                    }
                }
            });
        }
    };
})(window.jQuery || window.Zepto, window, document);
$(function(){
    setTimeout(function () {
        $("div[data-adv]").kwsAdv();
    },1000);//延迟1秒请求广告
});