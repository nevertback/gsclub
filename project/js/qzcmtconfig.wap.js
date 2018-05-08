(function ($) {
    var OperationMode = 'pro'; // dev | online;
    var qzScript = '//j.gamersky.com/user/club/wap/js/qz.wapwebcall.v1.0.1.js',
        qzLinkUrl = '//j.gamersky.com/user/club/wap/css/qz.wap.css',
        qzPSW = '//j.gamersky.com/css/g/lib/??photoswipe.min.css,default-skin.min.css',
        qzLink,
        clubOuter = $('#QZCMT'),
        coProp = {
            clubId: clubOuter.attr('clubId'),
            topicId: clubOuter.attr('topicId'),
            topic: clubOuter.attr('topic'),
            pageIndex: clubOuter.attr('data-pageIndex')
        },
        jsLibs = [
            '//j.gamersky.com/g/lib/photoswipe.min.js',
            '//j.gamersky.com/g/lib/photoswipe-ui-default.min.js',
            '//j.gamersky.com/file/ajaxfileupload.js'
        ];
    if(OperationMode === 'dev'){
        qzScript = 'js/qz.wapwebcall.v1.0.1.js';
        qzLinkUrl = 'css/qz.wap.css';
    }
    qzLink = '<link rel="stylesheet" href="' + qzPSW + '" ><link rel="stylesheet" href="' + qzLinkUrl + '">';
    function createQzMain() {
        var qzMainDom = '';
        qzMainDom = '<div class="qzMain qzOuter" id="qzMain" clubid="' + coProp.clubId + '" topicid="' + coProp.topicId + '" topic="' + coProp.topic + '">' +
            '<section class="qz-card-top">' +
            '<a class="icon"><img src="//image.gamersky.com/webimg15/user/club/wap/exp/icon-qz.png" alt="示例icon"></a>' +
            '<div class="intro joinCount">' +
            '<h5>网友评论</h5>' +
            '<p><span>0人</span>参与&nbsp;&nbsp;&nbsp;&nbsp;<span>0</span>条内容 </p>' +
            '<a target="_blank" href="" class="btn qwqz">前往圈子</a>' +
            '</div>' +
            '<a class="qz-smt qzBtnContext">发布评论</a>' +
            '</section>' +
            '<section class="qz-box">' +
            '<div class="qzNavPos"></div>' +
            '<aside class="qz-nav qzNavFxW">' +
            '<nav class="clearfix qzNavFx">' +
            '<a class="cur" data-cfg="new">最新</a>' +
            '<a data-cfg="hot">最热</a>' +
            '<a data-cfg="best" style="display: none;">精品</a>' +
            '</nav>' +
            '</aside>' +
            '<div class="qz-card-list" id="qzCardList" data-pageSize="10" data-loading="false" data-pageIndex="' + coProp.pageIndex + '"></div>' +
            '</section>' +
            '<a class="qzFixSmt qzBtnContext"></a>' +
            '</div>';
        return qzMainDom;
    }
    $(function () {
        //是否有登录弹窗，没有弹窗插入
        if ($('.gsZpPop').length < 1) {
            $.ajax({
                dataType: 'Script',
                url: '//j.gamersky.com/wap/component/loginpop/login.wap.pop.js',
                cache: true,
                success: function () {
                    $.componentLoginPop(640);
                }
            });
        }
        $('head').append(qzLink);
        clubOuter.html(createQzMain());
        for (var i = 0; i < jsLibs.length; i++) {
            $.ajax({
                dataType: 'Script',
                url: jsLibs[i],
                cache: true,
                success: function () {}
            });
        }
        $.ajax({
            dataType: 'Script',
            url: qzScript,
            cache: false,
            success: function () {
                //console.log('调用圈子成功！');
            }
        });
    });
})(jQuery);