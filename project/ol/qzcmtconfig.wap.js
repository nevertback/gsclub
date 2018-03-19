(function ($) {
    var qzScript = 'http://j.gamersky.com/user/club/wap/js/qz.wapwebcall.v1.0.1.js',
     //qzScript = 'http://j.gamersky.com/user/club/wap/js/qz.wapwebcall.v1.0.0.js',
        qzLinkUrl = 'http://j.gamersky.com/user/club/wap/css/qz.wap.css',
        qzPSW = 'http://j.gamersky.com/css/??g/lib/photoswipe.min.css,g/lib/default-skin.min.css',
        qzLink = '<link rel="stylesheet" href="'+qzPSW+'" ><link rel="stylesheet" href="'+qzLinkUrl+'">',
        clubOuter = $('#QZCMT'),
        coProp = {
            clubId:clubOuter.attr('clubId'),
            topicId:clubOuter.attr('topicId'),
            topic:clubOuter.attr('topic'),
            pageIndex:clubOuter.attr('data-pageIndex')
        };
    jsLibs = [
        'http://j.gamersky.com/g/lib/photoswipe.min.js',
        'http://j.gamersky.com/g/lib/photoswipe-ui-default.min.js',
        'http://j.gamersky.com/file/ajaxfileupload.js'
    ];
    function createQzMain() {
        var qzMainDom = '';
        qzMainDom = '<div class="qzMain qzOuter" id="qzMain" clubid="'+coProp.clubId+'" topicid="'+coProp.topicId+'" topic="'+coProp.topic+'">' +
            '<section class="qz-card-top">' +
            '<a class="icon"><img src="http://image.gamersky.com/webimg15/user/club/wap/exp/icon-qz.png" alt="示例icon"></a>' +
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
            '<a class="cur" data-type="0">全部</a>' +
            '<a data-type="1" style="display: none;">精品</a>' +
            '<a data-type="2" style="display: none;">图片</a>' +
            '<a data-type="3" style="display: none;">视频</a>' +
            '</nav>' +
            '<select data-sort="0" class="qz-nav-sort">' +
            '<option data-sort="0" value="">默认排序</option>' +
            '<option data-sort="1" value="">发帖时间</option>' +
            '<option data-sort="2" value="">热门排序</option>' +
            '</select>' +
            '</aside>' +
            '<div class="qz-card-list" id="qzCardList" data-pageSize="10" data-loading="false" data-pageIndex="'+coProp.pageIndex+'"></div>' +
            '</section>' +
            '<a class="qzFixSmt qzBtnContext"></a>' +
            '</div>';
        return qzMainDom;
    }
    $(function(){
        //是否有登录弹窗，没有坦弹窗插入
        if($('.gsZpPop').length < 1 ){
            $.ajax({
                dataType:'Script',
                url:'http://j.gamersky.com/wap/component/loginpop/login.wap.pop.js',
                cache:true,
                success:function () {
                    $.componentLoginPop(640);
                }
            });
        }
        $('head').append(qzLink);
        clubOuter.html(createQzMain());
        for(var i = 0;i<jsLibs.length;i++){
            $.ajax({
                dataType:'Script',
                url:jsLibs[i],
                cache:true,
                success:function () {}
            });
        }
        $.ajax({
            dataType:'Script',
            url:qzScript,
            cache:false,
            success:function () {
                //console.log('调用圈子成功！');
            }
        });
    });
})(jQuery);