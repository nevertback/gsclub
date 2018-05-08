(function ($) {
    var $qzMain =$("#qzMain"),  clubId = $qzMain.attr("clubId"), topicId = $qzMain.attr("topicId"), topic = $qzMain.attr("topic");
    var isTrim = function (s) {
        if (typeof (s) == 'undefined') {
            return false;
        }
        return s.replace(/(^\s*)|(\s*$)/g, "");
    };  //清除空格
    $.fn.extend({
        //文本框自适应高度
        textareaAutoHeight: function (options) {
            this._options = { minHeight: 0, maxHeight: 1000 }
            this.init = function () {
                for (var p in options) {
                    this._options[p] = options[p];
                }
                if (this._options.minHeight == 0) {
                    this._options.minHeight = parseFloat($(this).height());
                }
                for (var p in this._options) {
                    if ($(this).attr(p) == null) {
                        $(this).attr(p, this._options[p]);
                    }
                }
                $(this).keyup(this.resetHeight).change(this.resetHeight).focus(this.resetHeight);
            }
            this.resetHeight = function () {
                var _minHeight = parseFloat($(this).attr("minHeight"));
                var _maxHeight = parseFloat($(this).attr("maxHeight"));

                if (!$.browser.msie) { $(this).height(0); }
                var h = parseFloat(this.scrollHeight);
                h = h < _minHeight ? _minHeight : h > _maxHeight ? _maxHeight : h;
                $(this).height(h).scrollTop(h);
                $(this).css("overflow-y", h >= _maxHeight ? "scroll" : "hidden");
            }
            this.init();
        }
    });
    //模拟加载更多用测试数据end
    var qzConfig = {
        // 判断是否开始无限加载
        isCanLoading: true,
        //加载中 结构
        loadingDom: '<div class="qz-loading">正在加载</div>',
        //全部加载完成 结构
        loadedDom: '<div class="qz-loaded">全部加载完成</div>',
        //内容为空 结构
        loadnullDom: '<div class="qz-loadnull">还没有内容</div>'
    };
    var qzFunc = {
        //设置屏幕缩放
        setRem: function () {
            var pw = $(window).width(),$clubDad = $('#QZCMT'),scaleSize = $clubDad.attr('data-scale');
            if (pw >= 640) {
                pw = 640;
            }
            if(parseInt(scaleSize) === 720){
                var insertStyle = '';
                insertStyle += '<style>';
                insertStyle += '.qz-video-pop .qz-video-pop-con iframe{width:7.2rem;height:4.05rem}\n' +
                    '.ymw-backtotop a{width:.7rem;height:.7rem}\n' +
                    '.qzFixSmt{bottom:1.1rem;width:.7rem;height:.7rem;background-size:.3375rem .315rem;background-position:.22rem .2025rem}\n';
                insertStyle += '</style>';
                $('head').append(insertStyle);
                $qzMain.css({
                    margin:0
                });
                $qzMain.find('.qz-card-top,.qz-box').css({
                    'transform-origin':'0 0',
                    'transform':'scale('+720/640+')',
                    'margin':0
                });
                function setDadHeight() {
                    var innerHt = $qzMain.height(),scaleHeight;
                    scaleHeight = (innerHt+0.15/6.4*pw)*720/640;
                    $clubDad.css('height',scaleHeight);
                }
                setInterval(setDadHeight,200);
            }else{
                $('html').css({ 'font-size': pw / 6.4 + 'px' });
            }
        },
        //构建卡片
        createCard: function (cdp) {
            var cardDom = '';
            //插入卡片ID cdp.cardid
            cardDom += '<div class="qz-card qzCard" data-cid="' + cdp.cardid + '">';
            //头部 begin
            //插入用户头像 cdp.head
            cardDom += '<header><a class="head"><img src="' + cdp.head + '" alt="head"></a>';
            cardDom += '<div class="info"><h5>';
            //插入用户名 cdp.user
            cardDom += '<a>' + cdp.user + '</a>';
            //是否加V图标
            if (isTrim(cdp.vauth)) {
                cardDom += '<img src="http://image.gamersky.com/webimg15/user/club/pc/zheng-bj.png">';
            }
            //是否加编辑V图标
            //if (isTrim(cdp.editauth)) {
            //   cardDom += '<i class="member member-v2"></i>';
            // }
            cardDom += '</h5><p>';
            //插入创建时间 cdp.createtime
            cardDom += '<span class="time">' + cdp.createtime + '</span>';
            cardDom += '</p>';
            cardDom += '</div>';
            //是否加置顶 cdp.spectop 和 精 cdp.specvalue 图标
            if (cdp.spectop === true || cdp.specvalue === true) {
                cardDom += '<div class="spec-icons">';
                if (cdp.spectop === true) {
                    cardDom += '<a class="spec-top">置顶</a>';
                }
                if (cdp.specvalue === true) {
                    cardDom += '<a class="spec-value">精</a>';
                }
                cardDom += '</div>';
            }
            cardDom += '</header>';
            //头部 end
            //主体 begin
            //插入卡片跳转地址 cdp.url
            cardDom += '<section class="detail qzZoneHref" data-href="' + cdp.url + '">';
            //插入卡片内容 cdp.text
            cardDom += '<div class="content">';
            if (cdp.isVideo) {
                cardDom += cdp.text;
                cardDom += '<a href=' + cdp.video.src + ' class="link-video">' + cdp.video.videoTitle + '</a>';
            }
            else {
                cardDom += cdp.text;
            }
            cardDom += '</div>';
            //判断 插入 图片列表 cdp.piclist
            if (cdp.piclist.length > 0) {
                cardDom += '<div class="media-pic-list"><div class="clearfix qz-figs qzPicPswp">';
                $.each(cdp.piclist, function (i, item) {
                    cardDom += '<figure class="qzPicPswpBtn';
                    //输出数据文件中的图片样式item.ext
                    if (item.ext === 'gif') {
                        cardDom += ' gif"';
                        item.large = item.origin;
                    } else if (item.ext === 'long') {
                        cardDom += ' long"';
                    }
                    //大图地址item.large,尺寸item.size,缩略图地址item.url
                    cardDom += '"><a data-origin="' + item.origin + '"  data-large="' + item.large + '" data-size="' + item.size + '"><img src="' + item.url + '"></a></figure>';
                });
                cardDom += '</div></div>';
            }
            //判断是否插入大图
            if (cdp.picbig.large != undefined) {
                cdp.picbig.large = cdp.picbig.url;
                var picType = "";
                cardDom += '<div class="qzPicPswp media-pic';
                //输出数据文件中的图片样式 item.ext
                if (cdp.picbig.ext === 'gif') {
                    picType = ' gif';
                    cdp.picbig.large = cdp.picbig.origin;
                } else if (cdp.picbig.ext === 'long') {
                    picType = ' long';
                }
                //大图地址cdp.picbig.large,尺寸cdp.picbig.size,缩略图地址cdp.picbig.url
                cardDom += '"><figure class="' + picType + '"><a data-origin="' + cdp.picbig.origin + '" data-large="' + cdp.picbig.large + '" data-size="' + cdp.picbig.size + '"><img src="' + cdp.picbig.url + '" class="qzPicPswpBtn"></a></figure></div>';
            }
            //判断是否插入视频
            if (cdp.isVideo) {
                cardDom += '<div class="media-video">';
                //视频跳转地址 cdp.video.src,视频缩略图 cdp.video.pic
                cardDom += '<a class="qzVideoPopBtn" data-href="' + cdp.video.src + '"><img src="' + cdp.video.pic + '" alt=""></a></div>'
            }

            cardDom += '</section>';
            //判断是否输出来源
            if (cdp.fromUrl) {
                //来源地址cdp.fromUrl,来源名称cdp.from
                cardDom += '<div class="from">来自：<a href="' + cdp.fromUrl + '" >' + cdp.from + '</a></div>';
            }
            //主体 end
            //底部 begin
            cardDom += '<footer>';
            //点赞数cdp.countlike
            cardDom += '<a class="btn-like qzBtnLike" data-likecount="" data-clubcontentid="' + cdp.cardid + '" ><i></i><b></b></a><span></span>';
            //评论数 cdp.countcomment,卡片ID cdp.cardid
            cardDom += '<a class="btn-comment qzBtnComment" data-commcount=""  data-clubcontentid="' + cdp.cardid + '"   data-href="' + cdp.url + '">0</a>';
            cardDom += '</footer>';
            //底部 end
            cardDom += '</div>';
            cardDom += '';
            cardDom += '';

            return cardDom;
        },
        //图片弹出层 默认执行,一般情况不需要修改
        addSwpOnce: function () {
            var swp = '<div class="pswp pswpClub" tabindex="-1" role="dialog" aria-hidden="true"><div class="pswp__bg"></div><div class="pswp__scroll-wrap"><div class="pswp__container"><div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div><div class="pswp__ui pswp__ui--hidden"><div class="pswp__top-bar"><div class="pswp__counter"></div><button class="pswp__button pswp__button--close" title="Close (Esc)"></button><a target="_blank" class="pswp__button pswpBtnOrigin pswp__single-tap" title="查看原图"></a> <button class="pswp__button pswp__button--share" title="Share"></button> <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button> <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button><div class="pswp__preloader"><div class="pswp__preloader__icn"><div class="pswp__preloader__cut"><div class="pswp__preloader__donut"></div></div></div></div></div><div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"><div class="pswp__share-tooltip"></div></div><button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button> <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button><div class="pswp__caption"><div class="pswp__caption__center"></div></div></div></div></div>';
            $('body').append(swp);
        },
        //图片弹出层方法 默认执行,一般情况不需要修改
        photoSwp: function () {
            var initPhotoSwipeFromDOM = function (gallerySelector) {
                var parseThumbnailElements = function (el) {
                    var thumbElements = el.childNodes,
                        numNodes = thumbElements.length,
                        items = [],
                        figureEl,
                        linkEl,
                        size,
                        item;
                    for (var i = 0; i < numNodes; i++) {
                        figureEl = thumbElements[i];
                        if (figureEl.nodeType !== 1) {
                            continue;
                        }
                        linkEl = figureEl.children[0];
                        size = linkEl.getAttribute('data-size').split('x');
                        item = {
                            src: linkEl.getAttribute('data-large'),
                            w: parseInt(size[0], 10),
                            h: parseInt(size[1], 10),
                            ori: linkEl.getAttribute('data-origin')
                        };
                        if (figureEl.children.length > 1) {
                            item.title = figureEl.children[1].innerHTML;
                        }
                        if (linkEl.children.length > 0) {
                            item.msrc = linkEl.children[0].getAttribute('src');
                        }
                        item.el = figureEl;
                        items.push(item);
                    }
                    return items;
                };
                var closest = function closest(el, fn) {
                    return el && (fn(el) ? el : closest(el.parentNode, fn));
                };
                var onThumbnailsClick = function (e) {
                    e = e || window.event;
                    e.preventDefault ? e.preventDefault() : e.returnValue = false;
                    var eTarget = e.target || e.srcElement;
                    var clickedListItem = closest(eTarget, function (el) {
                        return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
                    });
                    if (!clickedListItem) {
                        return;
                    }
                    var clickedGallery = clickedListItem.parentNode,
                        childNodes = clickedListItem.parentNode.childNodes,
                        numChildNodes = childNodes.length,
                        nodeIndex = 0,
                        index;
                    for (var i = 0; i < numChildNodes; i++) {
                        if (childNodes[i].nodeType !== 1) {
                            continue;
                        }
                        if (childNodes[i] === clickedListItem) {
                            index = nodeIndex;
                            break;
                        }
                        nodeIndex++;
                    }
                    if (index >= 0) {
                        openPhotoSwipe(index, clickedGallery);
                    }
                    return false;
                };

                var openPhotoSwipe = function (index, galleryElement, disableAnimation, fromURL) {
                    var pswpElement = $('.pswpClub')[0],
                        gallery,
                        options,
                        items;
                    items = parseThumbnailElements(galleryElement);
                    options = {
                        shareEl: false,
                        fullscreenEl: false,
                        zoomEl: false,
                        bgOpacity: 1,
                        showHideOpacity: 0,
                        galleryUID: galleryElement.getAttribute('data-pswp-uid'),
                        history: false,
                        getThumbBoundsFn: function (index) {
                            var thumbnail = items[index].el.getElementsByTagName('img')[0],
                                pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                                rect = thumbnail.getBoundingClientRect();
                            return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
                        }
                    };
                    if (fromURL) {
                        if (options.galleryPIDs) {
                            for (var j = 0; j < items.length; j++) {
                                if (items[j].pid == index) {
                                    options.index = j;
                                    break;
                                }
                            }
                        } else {
                            options.index = parseInt(index, 10) - 1;
                        }
                    } else {
                        options.index = parseInt(index, 10);
                    }
                    if (isNaN(options.index)) {
                        return;
                    }
                    if (disableAnimation) {
                        options.showAnimationDuration = 0;
                    }
                    gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
                    gallery.init();
                    function setOrigin(num) {
                        $('.pswpClub .pswpBtnOrigin').attr('href', items[num].ori)
                    }
                    gallery.listen('initialZoomIn', function () {
                        setOrigin(gallery.getCurrentIndex());
                        $('.pswpClub').animate({ 'opacity': 1 }, 333);
                    });
                    gallery.listen('initialZoomOut', function () {
                        $('.pswpClub').animate({ 'opacity': 0 }, 200);
                    });
                    gallery.listen('afterChange', function () {
                        setOrigin(gallery.getCurrentIndex());
                    });
                };
                var galleryElements = document.querySelectorAll(gallerySelector);
                for (var i = 0, l = galleryElements.length; i < l; i++) {
                    galleryElements[i].setAttribute('data-pswp-uid', i + 1);
                    galleryElements[i].onclick = onThumbnailsClick;
                }
            };
            initPhotoSwipeFromDOM('.qzPicPswp');
        },
        //插入卡片
        insertCard: function (tar, dt) {
            var insDom = '';
            $.each(dt, function (i, item) {
                //使用返回数据 构建卡片
                insDom += qzFunc.createCard(item);
            });
            $(tar).html(insDom);
            $(".qzBtnLike").like();
            $(".qzBtnLike").addLike();
            $(".qzBtnComment").commentCount();
            $(".qzCard .content").removeTarget();
            //构建完成后调用图片弹出层
            qzFunc.photoSwp();
            //开启视频弹窗
            qzFunc.openVideoPop();
        },
        //加载更多卡片
        appendCard: function (tar, dt) {
            var insDom = '';
            $.each(dt, function (i, item) {
                //使用返回数据 构建卡片
                insDom += qzFunc.createCard(item);
            });
            $(tar).append(insDom);
            $(".qzBtnLike").like();
            $(".qzBtnLike").addLike();
            $(".qzBtnComment").commentCount();
            $(".qzCard .content").removeTarget();
            //构建完成后调用图片弹出层
            qzFunc.photoSwp();
            //开启视频弹窗
            qzFunc.openVideoPop();
        },
        //发布/参与
        addContext: function () {
            function insertContext(scrolltopval) {
                var tar = $("#qzCardList");
                var topic = tar.data("topic"), clubname = tar.data("clubname");
                var comDom = '';
                comDom += '<div class="qz-pop qzPop">';
                comDom += '<header>发布内容<a class="qz-pop-close qzPopClose"></a><a class="qz-pop-smt qzPopSmt">发布</a></header>';
                comDom += '<div class="pop-con">';
                comDom += '<div class="pop-srl"><textarea class="realIpt" placeholder="分享你的游戏心得...">';
                if (isTrim(topic)) {
                    comDom += topic;
                }
                comDom += '</textarea > <textarea class="mathIpt" rows="3"></textarea></div > ';
                //上传图片后显示，不传图片不显示 begin
                comDom += '<div class="clearfix qz-pic-list">';
                comDom += '<div class="qz-pic-list-li"><label for="qzSelectPhoto" class="qz-pic-list-add"></label></div>';
                comDom += '</div>';
                comDom += '<input id="fileupload"  data-imagesize="5120"   type="file" style="display:none" name="files" method="POST" multiple="">';
                //上传图片后显示，不传图片不显示 end
                comDom += '</div>';
                comDom += '<footer><label for="qzSelectPhoto" class="qz-upload-pic qzUploadPic">图片</label><select class="qz-pop-sel">';
                //右下角选项
                comDom += '</select>';
                //隐藏的上传input
                //comDom += '<input id="qzSelectPhoto" class="qz-select-photo" type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/bmp">';
                comDom += '</footer></div>';
                //输出弹层
                $('body').append(comDom);
                var $qzPop = $('.qzPop');
                //选择图片
                $(".qz-pic-list-add,.qzUploadPic").selectPhoto();
                //选择圈子
                if (isTrim(clubname)) {
                    $(".qz-pop-sel").html("<option value='clubId'>发往" + clubname + "</option>");
                }

                //添加弹层动画
                setTimeout(function () {
                    $qzPop.addClass('cur');
                }, 10);
                //设置textarea尺寸
                function setAreaSize() {
                    $qzPop.find('.realIpt').on('input', function () {
                        $qzPop.find('.mathIpt').val($qzPop.find('.realIpt').val());
                        var textsth = $qzPop.find('.mathIpt')[0].scrollHeight;
                        $qzPop.find('.realIpt').css('height', textsth);
                    })
                }
                setAreaSize();
                //关闭弹层
                function closePop() {
                    $qzPop.removeClass('cur');
                    $('html,body').removeClass('hideScroll').animate({ scrollTop: scrolltopval }, 0);
                    //等待弹层动画执行完后移除弹层
                    setTimeout(function () {
                        $qzPop.remove();
                    }, 250);
                }
                //关闭按钮
                $('.qzPopClose').on('click', closePop);
                //发布按钮
                $qzPop.fabuSubmit(scrolltopval);

            }
            //绑定发布按钮事件
            $('#qzMain').on('click', '.qzBtnContext', function () {
                $(this).UserOnline(function (response) {
                    if (response.status == 'ok') {
                        var st = $('html').scrollTop();
                        if (st === 0) {
                            st = $('body').scrollTop();
                        }
                        setTimeout(function () {
                            $('html,body').addClass('hideScroll');
                        }, 300);
                        //打开弹层
                        insertContext(st);
                    }
                });
            });
        },
        //评论
        addComment: function () {
            function insertComment(scrolltopval, cid, commentId, rename, userId) {
                var comDom = '', placeholder = rename ? '回复 ' + rename + '：' : '我来说两句...';
                comDom += '<div class="qz-pop qzPop">';
                comDom += '<header>评论<a class="qz-pop-close qzPopClose"></a><a data-userId="' + userId + '" data-clubContentId="' + cid + '"  data-commentId="' + commentId + '" class="qz-pop-smt qzPopSmt">发布</a></header>';
                comDom += '<div class="pop-con"><div class="pop-srl"><textarea class="realIpt" placeholder="' + placeholder + '"></textarea><textarea class="mathIpt" rows="3"></textarea></div></div>';
                comDom += '</div>';
                $('body').append(comDom);
                var $qzPop = $('.qzPop');
                setTimeout(function () {
                    $qzPop.addClass('cur');
                }, 10);
                //设置textarea尺寸
                function setAreaSize() {
                    $qzPop.find('.realIpt').on('input', function () {
                        $qzPop.find('.mathIpt').val($qzPop.find('.realIpt').val());
                        var textsth = $qzPop.find('.mathIpt')[0].scrollHeight;
                        $qzPop.find('.realIpt').css('height', textsth);
                    })
                }
                setAreaSize();
                function closePop() {
                    $qzPop.removeClass('cur');
                    $('html,body').removeClass('hideScroll').animate({ scrollTop: scrolltopval }, 0);
                    setTimeout(function () {
                        $qzPop.remove();
                    }, 250);
                }
                //关闭按钮
                $('.qzPopClose').on('click', closePop);
                //发布按钮
                $('.qzPopSmt').on('click', function () {
                    var context = $qzPop.find('.realIpt').val();
                    //数据提交后执行下面函数
                    $(this).addComment(scrolltopval);
                });
            }
            $('#qzMain').on('click', '.qzBtnComment', function () {
                var $this = $(this);
                $this.UserOnline(function (response) {
                    if (response.status == 'ok') {
                        var st = $('html').scrollTop(),
                            cid = $this.data('clubcontentid'),
                            //评论数量
                            count = $this.data('commcount'),
                            //单页卡片地址
                            url = $this.data('href'),
                            //回复的用户名
                            uerId = $this.data('userid'),
                            commentId = $this.data('commid'),
                            rename = $this.attr('data-name');

                        //判断是否单页 单页直接打开弹层，不判断评论数
                        if ($('#qzCardContext').length > 0) {
                            if (st === 0) {
                                st = $('body').scrollTop();
                            }
                            setTimeout(function () {
                                $('html,body').addClass('hideScroll');
                            }, 300);
                            //打开弹层
                            insertComment(st, cid, commentId, rename, uerId);
                            return false;
                        }
                        if (count === 0 || count == "") {
                            if (st === 0) {
                                st = $('body').scrollTop();
                            }
                            setTimeout(function () {
                                $('html,body').addClass('hideScroll');
                            }, 300);
                            //打开弹层
                            insertComment(st, cid, commentId, rename, uerId);
                        } else {
                            //如果评论数不为0 跳转到卡片单页
                            window.location.href = url;
                        }
                    }
                });
            });
        },
        //点赞
        addLike: function () {
            $('#qzMain').on('click', '.qzBtnLike', function () {
                var $this = $(this),
                    cid = $this.closest('.qzCard').data('cid'),
                    //赞的数量
                    count = $this.attr('data-likecount');
                //判断是否喜欢过,data-islike=1为点过赞，再次点击删除赞，同时设置data-islike=0
                if (parseInt($this.attr('data-islike')) === 1) {
                    //删除赞 数据提交后回调
                    $this.removeClass('cur').attr('data-islike', '0').attr('data-likecount', parseInt(count) - 1).find('b').html(parseInt(count) - 1);
                    console.log('删除赞');
                } else {
                    //添加赞数 据提交后回调
                    $this.addClass('cur').attr('data-islike', '1').attr('data-likecount', parseInt(count) + 1).find('b').html(parseInt(count) + 1);
                    console.log('喜欢了 cid = ' + cid + ' 的卡片 *** cid 为按钮传入的卡片id,供开发使用');
                }
            })
        },
        //初始化内容 卡片列表
        //初始化内容 话题上部
        initPageTopic: function () {
            var tar = '#qzCardListTopic', tarInsert = $(tar);
            if (tarInsert.length > 0) {
                //获取数据，具体参数和方式后端自定义
                var dt = tarInsert.data('from');
                $.ajax({
                    dataType: 'Script',
                    url: dt,
                    beforeSend: function () {
                        //插入加载动画
                        tarInsert.append(qzConfig.loadingDom);
                    },
                    success: function () {
                        //判断数据状态
                        if (fakeDate.dataType === 'ok') {
                            //处理获取的数据
                            tarInsert.attr('data-page', fakeDate.page);
                            //允许无限加载
                            tarInsert.attr('data-moreload', 'open');
                            qzFunc.insertCard(tar, fakeDate.cardgroup);
                        } else {
                            //数据为空是插入提示
                            tarInsert.html(qzConfig.loadnullDom);
                        }
                    }
                })
            }
        },
        //初始化内容 内容单页
        initPageContext: function () {
            var tar = '#qzCardContext', tarInsert = $(tar);
            if (tarInsert.length > 0) {
                //获取数据，具体参数和方式后端自定义
                var dt = tarInsert.data('from');
                $.ajax({
                    dataType: 'Script',
                    url: dt,
                    beforeSend: function () {
                        //插入加载动画
                        tarInsert.append(qzConfig.loadingDom);
                    },
                    success: function () {
                        //判断数据状态
                        if (fakeDate.dataType === 'ok') {
                            //处理获取的数据
                            tarInsert.attr('data-page', fakeDate.page);
                            qzFunc.insertCard(tar, fakeDate.cardgroup);
                        } else {
                            //数据为空是插入提示
                            tarInsert.html(qzConfig.loadnullDom);
                        }
                    }
                });
                var commtar = '#qzClComment', commurl = $(commtar).data('from');
                $.ajax({
                    dataType: 'Script',
                    url: commurl,
                    beforeSend: function () {
                        //插入加载动画
                        $(commtar).append(qzConfig.loadingDom);
                    },
                    success: function () {
                        //判断数据状态
                        if (fakeCommData.dataType === 'ok') {
                            //处理获取的数据
                            $(commtar).attr('data-page', fakeCommData.page);
                            $(commtar).attr('data-infiload', 'open');
                            qzFunc.insertCardComment(commtar, fakeCommData.commlist);
                        } else {
                            //数据为空时插入提示
                            $(commtar).html(qzConfig.loadnullDom);
                        }
                    }
                });
                //评论/赞 无限加载
                function infiniteLoadCl() {
                    function loadFunc() {
                        var selid = $('.qzClCon.cur').attr('id'), tar, tarInsert;
                        if (selid === 'qzClComment') {
                            tar = '#qzClComment';
                            tarInsert = $(tar);
                            if (tarInsert.attr('data-infiload') === 'open') {
                                $.ajax({
                                    dataType: 'Script',
                                    url: pgMoredataUrlComm,
                                    beforeSend: function () {
                                        //插入加载动画
                                        tarInsert.append(qzConfig.loadingDom);
                                    },
                                    success: function () {
                                        var nowPage = tarInsert.attr('data-page'), dataPage = fakeCommData.page;
                                        //加载成功后移除加载动画
                                        tarInsert.find('.qz-loading').remove();
                                        //判断时候还有当前数据页码是否加载完成
                                        if (dataPage > nowPage) {
                                            //设置新页码
                                            tarInsert.attr('data-page', dataPage);
                                            //插入更多数据
                                            qzFunc.appendCardComment(tar, fakeCommData.commlist);
                                        } else {
                                            if (tarInsert.attr('data-infiload') === 'open') {
                                                //全部加载完成 关闭加载
                                                tarInsert.attr('data-infiload', 'close');
                                                //插入 全部加载完成 提示
                                                tarInsert.append(qzConfig.loadedDom);
                                            }
                                        }
                                        qzConfig.isCanLoading = true;
                                    }
                                })
                            } else {
                                qzConfig.isCanLoading = true;
                            }

                        } else if (selid === 'qzClLike') {
                            tar = '#qzClLike';
                            tarInsert = $(tar);
                            if (tarInsert.attr('data-infiload') === 'open') {
                                $.ajax({
                                    dataType: 'Script',
                                    url: pgMoredataUrlLike,
                                    beforeSend: function () {
                                        //插入加载动画
                                        tarInsert.append(qzConfig.loadingDom);
                                    },
                                    success: function () {
                                        var nowPage = tarInsert.attr('data-page'), dataPage = fakeLikeData.page;
                                        //加载成功后移除加载动画
                                        tarInsert.find('.qz-loading').remove();
                                        //判断时候还有当前数据页码是否加载完成
                                        if (dataPage > nowPage) {
                                            //设置新页码
                                            tarInsert.attr('data-page', dataPage);
                                            //插入更多数据
                                            qzFunc.appendCardLike(tar, fakeLikeData.likelist);
                                        } else {
                                            if (tarInsert.attr('data-infiload') === 'open') {
                                                //全部加载完成 关闭加载
                                                tarInsert.attr('data-infiload', 'close');
                                                //插入 全部加载完成 提示
                                                tarInsert.append(qzConfig.loadedDom);
                                            }
                                        }
                                        qzConfig.isCanLoading = true;
                                    }
                                })
                            } else {
                                qzConfig.isCanLoading = true;
                            }
                        }
                    }
                    function scrollJudge() {
                        var st = $('html').scrollTop(), dh = $(document).height(), wh = $(window).height();
                        if (st === 0) {
                            st = $('body').scrollTop();
                        }
                        if (st > dh - wh - 100 && st > wh - dh && qzConfig.isCanLoading === true) {
                            qzConfig.isCanLoading = false;
                            loadFunc();
                        }
                    }
                    if ($(tar).length > 0) {
                        $(window).scroll(function () {
                            scrollJudge();
                        });
                    }
                }
                infiniteLoadCl();
            }
        },
        //无限加载
        infiniteLoad: function (tar, callback) {
            function loadFunc() {
                var tarInsert = $(tar);
                //判断列表是否开启无限加载
                if (tarInsert.attr('data-infiload') === 'open') {
                    //获取数据，具体参数和方式后端自定义
                    if (typeof callback === 'function') {
                        callback(tar, tarInsert);
                    }
                }
            }
            function scrollJudge() {
                var st = $('html').scrollTop(), dh = $(document).height(), wh = $(window).height();
                if (st === 0) {
                    st = $('body').scrollTop();
                }
                if (st > dh - wh - 100 && st > wh - dh && qzConfig.isCanLoading === true) {
                    qzConfig.isCanLoading = false;
                    loadFunc();
                }
            }
            if ($(tar).length > 0) {
                $(window).scroll(function () {
                    scrollJudge();
                });
            }
        },
        //话题页上部加载更多按钮
        topicMore: function () {
            var $moreBtn = $('.qzCardMoreBtn');
            $moreBtn.on('click', function () {
                var tarInsert = $('#qzCardListTopic');
                //判断列表是否开启查看更多
                if (tarInsert.length > 0 && tarInsert.attr('data-moreload') === 'open') {
                    //获取数据，具体参数和方式后端自定义
                    $.ajax({
                        dataType: 'Script',
                        url: pgMoredataUrl,
                        beforeSend: function () {
                            //插入加载动画
                            tarInsert.append(qzConfig.loadingDom);
                        },
                        success: function () {
                            var nowPage = tarInsert.attr('data-page'), dataPage = fakeDate.page;
                            //加载成功后移除加载动画
                            tarInsert.find('.qz-loading').remove();
                            //判断时候还有当前数据页码是否加载完成
                            if (dataPage > nowPage) {
                                //设置新页码
                                tarInsert.attr('data-page', dataPage);
                                //插入更多数据
                                qzFunc.appendCard('#qzCardListTopic', fakeDate.cardgroup);
                            } else {
                                if (tarInsert.attr('data-moreload') === 'open') {
                                    //全部加载完成 关闭加载
                                    tarInsert.attr('data-moreload', 'close');
                                    //按钮 改变提示文字
                                    $moreBtn.html('全部加载完成');
                                }
                            }
                        }
                    })
                }
            });
        },
        //列表切换
        tabNav: function () {
            function navFunc() {
                var $nav = $('.qzNavFx'),
                    //浮动导航层
                    $navWrap = $('.qzNavFxW'),
                    //固定不动的占位导航
                    $navPos = $('.qzNavPos'),
                    loadedTimer;
                //判断滚动距离添加浮动导航
                function fixNav() {
                    var navTop = $navPos.offset().top, srlTop = $('html').scrollTop();
                    if (srlTop === 0) {
                        srlTop = $('body').scrollTop();
                    }
                    if (srlTop >= navTop) {
                        $navWrap.addClass('openQzNavFixed');
                    } else {
                        $navWrap.removeClass('openQzNavFixed');
                    }
                }
                fixNav();
                $(window).scroll(function () {
                    fixNav();
                });
                //加载tab内容前 页面位置
                function scrollLoading() {
                    var $html = $('html'), hh = $html.height(),
                        navSt = $navPos.offset().top, srlTop = $html.scrollTop();
                    if (srlTop === 0) {
                        srlTop = $('body').scrollTop();
                    }
                    $html.css('height', hh);
                    if (srlTop > navSt) {
                        $('html,body').animate({ scrollTop: navSt }, 0);
                    }
                }
                //加载tab内容后 页面位置
                function scrollLoaded() {
                    var $html = $('html');
                    clearTimeout(loadedTimer);
                    loadedTimer = setTimeout(function () {
                        $html.css('height', '');
                    }, 200);
                }
                //点击切换绑定事件
                $nav.find('a').on('click', function () {
                    var $this = $(this), tarCon = '#qzCardList';
                    //设置按钮点击后样式
                    $nav.find('a').removeClass('cur');
                    $this.addClass('cur');
                    $(tarCon).html("").attr("data-pageIndex", 0).attr("data-loading", false);
                    qzConfig.isCanLoading = false;
                    scrollLoading();
                    $(tarCon).getClub(function () {
                        scrollLoaded();
                    });
                })
            }
            if ($('.qzNavFx').length > 0) {
                navFunc();
            }
        },
        //内容单页赞-评论切换
        tabCl: function () {
            var $nav = $('.tabNavCl'), $con = $('.qzClCon');
            $nav.find('a').on('click', function () {
                var $this = $(this), tar = $this.data('tar');
                $nav.find('a').removeClass('cur');
                $con.removeClass('cur');
                $this.addClass('cur');
                $('.' + tar).addClass('cur');
                //数据获取后端自定义
                if (tar === 'qzClLike') {
                    var liketar = '#qzClLike', likeurl = $(liketar).data('from');
                    if ($(liketar).attr('data-page') === undefined) {
                        $.ajax({
                            dataType: 'Script',
                            url: likeurl,
                            beforeSend: function () {
                                //插入加载动画
                                $(liketar).append(qzConfig.loadingDom);
                            },
                            success: function () {
                                $(liketar).find('.qz-loading').remove();
                                //判断数据状态
                                if (fakeLikeData.dataType === 'ok') {
                                    //处理获取的数据
                                    $(liketar).attr('data-page', fakeLikeData.page);
                                    $(liketar).attr('data-infiload', 'open');
                                    qzFunc.appendCardLike(liketar, fakeLikeData.likelist);
                                } else {
                                    //数据为空时插入提示
                                    $(commtar).html(qzConfig.loadnullDom);
                                }
                            }
                        });
                    }
                }
            });
        },
        //单页跳转
        pageGoto: function () {
            var openId = $('.qz-card-list');
            //点击其他区域跳转到单页
            openId.on('click', '.qzCard .qzZoneHref', function () {
                var $this = $(this), url = $this.data('href');
                window.location.href = url;
            });
            //阻止事件冒泡
            openId.on('click', '.qzZoneHref figure,.qzZoneHref a', function (event) {
                event.stopPropagation();
            });
        },
        //构建卡片内评论
        createCardComment: function (cmdt) {
            var commDom = '';
            commDom += '<li data-commid="' + cmdt.commid + '"><a class="head">';
            commDom += '<img src="' + cmdt.head + '" alt="' + cmdt.name + '"></a>';
            commDom += '<div class="info qzBtnComment" data-commid="' + cmdt.commid + '" data-name="' + cmdt.name + '">';
            commDom += '<h5>' + cmdt.name;
            if (cmdt.reply) {
                commDom += '<b>回复</b>' + cmdt.reply;
            }
            commDom += '</h5>';
            commDom += '<p class="time">' + cmdt.replytime + '</p>';
            commDom += '<div class="context">';
            commDom += cmdt.context;
            commDom += '</div></div></li>';
            return commDom;
        },
        //插入卡片内评论
        insertCardComment: function (tar, dt) {
            var insDom = '';
            $.each(dt, function (i, item) {
                //使用返回数据 构建卡片
                insDom += qzFunc.createCardComment(item);
            });
            $(tar).html(insDom);
        },
        //插入卡片内更多评论
        appendCardComment: function (tar, dt) {
            var insDom = '';
            $.each(dt, function (i, item) {
                //使用返回数据 构建卡片
                insDom += qzFunc.createCardComment(item);
            });
            $(tar).append(insDom);
        },
        //构建卡片内赞
        createCardLike: function (lkdt) {
            var likeDom = '';
            likeDom += '<li data-likeid="' + lkdt.likeid + '"><a class="head">';
            likeDom += '<img src="' + lkdt.head + '" alt="' + lkdt.name + '"></a>';
            likeDom += '<div class="name"><a>' + lkdt.name + '</a></div>';
            likeDom += '</div></li>';
            return likeDom;
        },
        //插入卡片内赞
        insertCardLike: function (tar, dt) {
            var insDom = '';
            $.each(dt, function (i, item) {
                //使用返回数据 构建卡片
                insDom += qzFunc.createCardLike(item);
            });
            $(tar).html(insDom);
        },
        //插入卡片内更多赞
        appendCardLike: function (tar, dt) {
            var insDom = '';
            $.each(dt, function (i, item) {
                //使用返回数据 构建卡片
                insDom += qzFunc.createCardLike(item);
            });
            $(tar).append(insDom);
        },
        //打开视频弹窗
        openVideoPop: function () {
            function videoPop(vdsrc) {
                var popDom = '';
                popDom += '<div class="qz-video-pop qzVideoPop">';
                popDom += '<div class="qz-video-pop-con">';
                popDom += '<iframe height="100%" width="100%" src="http://player.youku.com/embed/' + vdsrc + '" frameborder=0 allowfullscreen></iframe>';
                popDom += '</div>';
                popDom += '<div class="qz-video-bar"><a class="qz-video-pop-close qzVideoPopClose"></div></a>';
                popDom += '</div>';
                $('body').append(popDom);
                var $pop = $('.qzVideoPop');
                setTimeout(function () {
                    $pop.addClass('cur');
                }, 10);
                function closePop() {
                    $pop.removeClass('cur');
                    setTimeout(function () {
                        $pop.remove();
                    }, 250);
                }
                $pop.on('click', closePop);
                $pop.on('click', 'iframe', function (event) {
                    event.stopPropagation();
                });
            }
            $('.qzVideoPopBtn').on('click', function () {
                var $this = $(this), vdurl = $this.data('href'), vdsrc = '';
                var ykSign = 'http://v.youku.com/v_show/id_', ykIndexOfBegin = vdurl.indexOf(ykSign) + ykSign.length, ykIndexOfEnd = vdurl.indexOf('==.html');
                vdsrc = vdurl.substring(ykIndexOfBegin, ykIndexOfEnd);
                videoPop(vdsrc);
            })
        },
        //构建全部话题列表
        createAllTopic: function (dt) {
            var topicDom = '';
            topicDom += '<li data-topicid="' + dt.id + '"><a href="' + dt.url + '"><b>#' + dt.title + '#</b><span><i class="num-in">' + dt.countjoin + '</i>人参与<i class="num-comm">' + dt.countcomm + '</i>条讨论</span></a></li>';
            return topicDom;
        },
        //插入全部话题列表
        allTopic: function () {
            var $topicList = $('#qzAllTopicList');
            function createList(dt) {
                var listDom = '';
                $.each(dt, function (i, item) {
                    listDom += qzFunc.createAllTopic(item);
                });
                $topicList.html(listDom);
            }
            function addList(dt) {
                var listDom = '';
                $.each(dt, function (i, item) {
                    listDom += qzFunc.createAllTopic(item);
                });
                $topicList.append(listDom);
            }
            function getListData() {
                var dataOriUrl = $topicList.data('from');
                $.ajax({
                    dataType: 'script',
                    url: dataOriUrl,
                    success: function () {
                        var listData = fakeAlltopic;
                        $topicList.attr({ 'data-page': listData.page, 'data-infiload': 'open' });
                        createList(listData.topiclist);
                    }
                })
            }
            if ($topicList.length > 0) {
                getListData();
                qzFunc.infiniteLoad('#qzAllTopicList', function (tar, tarInsert) {
                    var $main = $('#qzMain');
                    $.ajax({
                        dataType: 'Script',
                        url: pgMoredataAllTopic,
                        beforeSend: function () {
                            //插入加载动画
                            $main.append(qzConfig.loadingDom);
                        },
                        success: function () {
                            var nowPage = tarInsert.attr('data-page'), dataPage = fakeAlltopic.page;
                            //加载成功后移除加载动画
                            $main.find('.qz-loading').remove();
                            //判断时候还有当前数据页码是否加载完成
                            if (dataPage > nowPage) {
                                //设置新页码
                                tarInsert.attr('data-page', dataPage);
                                //插入更多数据
                                addList(fakeAlltopic.topiclist);
                            } else {
                                if (tarInsert.attr('data-infiload') === 'open') {
                                    //全部加载完成 关闭加载
                                    tarInsert.attr('data-infiload', 'close');
                                    //插入 全部加载完成 提示
                                    $main.append(qzConfig.loadedDom);
                                }
                            }
                            qzConfig.isCanLoading = true;
                        }
                    })
                })
            }
        },
        //入口
        main: function () {
            //设置屏幕缩放
            qzFunc.setRem();
            //插入图片弹层，只需执行一次
            qzFunc.addSwpOnce();
            //开启评论
            qzFunc.addComment();
            //开启发布/参与
            qzFunc.addContext();
            //插入测试数据
            //qzFunc.initPage();
            //插入测试数据 话题页
            qzFunc.initPageTopic();
            //插入测试数据 内容单页
            qzFunc.initPageContext();
            //列表切换导航
            qzFunc.tabNav();
            //插入测试数据 模拟无限加载
            qzFunc.infiniteLoad('#qzCardList', function (tar, tarInsert) {
                tarInsert.getClub();
            });
            //开启 话题页上部加载更多按钮功能
            qzFunc.topicMore();
            //开启 内容单页评论和赞的切换功能
            qzFunc.tabCl();
            //开启 内容单页 跳转功能
            qzFunc.pageGoto();
            //加载 全部话题 列表
            qzFunc.allTopic();
            //旋转屏幕需要执行的函数
            $(window).resize(function () {
                qzFunc.setRem();
            });
        }
    };
    $.fn.UserOnline = function (fun) {
        $.ajax({
            type: "GET", dataType: "jsonp", url: "//i.gamersky.com/api/logincheck",
            success: function (responseJson) {
                if (responseJson.status !== "ok") {
                    $(".ymw-loginpop-btns").insertYmwLoginPop();
                    $(".ymw-loginpop-btns").QZloginForm();
                }
                else {
                    fun(responseJson);
                }
            }
        })
    };
    $.fn.QZloginForm = function () {
        var $this = $(this);
        $this.on("click", "#qqLogin", function (event) {
            event.preventDefault();
            var returnUrl = window.location.href;
            window.location.href = "//i.gamersky.com/oauth/authorizelogin?authorizetype=qq&returnUrl=" + encodeURI(returnUrl);
        }).on("click", "#sinaLogin", function (event) {
            event.preventDefault();
            var returnUrl = window.location.href;
            window.location.href = "//i.gamersky.com/oauth/authorizelogin?authorizetype=sina&returnUrl=" + encodeURI(returnUrl);
        })
    };
    $.fn.insertYmwLoginPop = function () {
        $(".gsZpPopLoginClose,.gs_zp_pop_login").show();
        $('.gsZpPopLoginClose').on('click', function () {
            $(".gs_zp_pop_login,.gsZpPopLoginClose").hide();
        })
    };
    $.fn.selectPhoto = function () {
        return this.each(function () {
            $(this).bind("click", function () {
                $("#fileupload").trigger("click");
                $('#fileupload').fileupload({
                    type: 'post',
                    dataType: 'json',
                    crossDomain: true,
                    maxFileSize: '5000000',//5M
                    url: '//i.gamersky.com/uploadpic/index',
                    done: function (e, data) {
                        var result = data.result;
                        if (result.status == "ok") {
                            var count = $(".qz-pic-list-li .qz-img-remove").length + 1;
                            if (count > 9) {
                                alert("最多只能传9张");
                                $(".qz-pic-list .temp:first").remove();
                            }
                            else {
                                if (count == 9) {
                                    $(".qz-pic-list-add").parent().css("display", "none");
                                }
                                var html = "<img src='" + result.tiny + "' data-original='" + result.original + "' data-height=\"" + result.height + "\" data-width=\"" + result.width + "\" data-type=\"" + result.imageclass + "\"><a class='qz-img-remove'></a>";
                                $(".qz-pic-list .temp:first").removeClass("temp").html(html);

                            }
                            $(".qz-pic-list .qz-img-remove").each(function () {
                                $(this).unbind("click");
                                $(this).bind("click", function () {
                                    var original = $(this).parents(".pic").find("img").attr("data-original");
                                    var len = $(".qz-pic-list-li").not(":last").length;
                                    $(this).parent(".qz-pic-list-li").remove();
                                    $.ajax({
                                        type: "get", dataType: "json", url: "//i.gamersky.com/uploadpic/delete?origin=" + original,
                                        data: {},
                                        success: function (responseJson) {
                                        }
                                    });
                                    if (len < 9) {
                                        $(".qz-pic-list-add").parent().css("display", "block");
                                    }
                                });
                            });
                        }
                        else {
                            alert("包含不支持的文件格式");
                            $(".qz-pic-list .temp:first").remove();

                        }
                    },
                    change: function (e, data) {
                        var i = 0;
                        var settingSize = parseInt($("#fileupload").attr("data-imagesize"));
                        var settingSizeMb = settingSize / 1024;
                        $.each(data.files, function (index, item) {
                            if (item.size / 1024 > settingSize && i <= 0) {
                                i += 1;
                                alert("图片容量超过" + settingSizeMb + "MB，无法上传！");
                            }
                            else {
                                if (item.size / 1024 <= settingSize) {
                                    var html = '<div class="qz-pic-list-li temp"><img src="http://image.gamersky.com/webimg15/user/club/pc/loading.gif" ></div>';
                                    $(".qz-pic-list-li:first").before(html);
                                }
                            }
                        });
                    },
                });
            });
        })
    };
    $.fn.fabuSubmit = function (beforeOpenSt) {
        return this.each(function () {
            var $div = $(this), maxnum = parseInt($div.find(".maxNum").html());
            var $textarea = $div.find(".mathIpt");
            var minH = $textarea.height(), rowH = parseInt($textarea.css("line-height"));//行高
            var maxH = rowH * 15; //最小高度

            $textarea.textareaAutoHeight({ minHeight: minH, maxHeight: maxH });//文本框自适应高度
            $div.on("focus", ".mathIpt", function () {
                var $this = $(this), htm = $this.attr("placeholder");
                $this.attr("data-val", htm).removeAttr("placeholder").parent().addClass("cur");
            }).on("blur", ".mathIpt", function () {
                var $this = $(this), htm = $this.attr("data-val");
                $this.attr("placeholder", htm).parent().removeClass("cur");
            }).on("keyup blur", ".mathIpt", function () {
                var len = this.value.length;
                this.value = this.value.substr(0, maxnum);
                $div.find(".curNum").html(len);
                $div.find(".fabu-num").css("display", len > 0 ? 'block' : '');
            });

            //提交发布
            $div.on("click", ".qzPopSmt", function () {
                if ($(this).attr("data-isclick") == 'true') {
                    return;
                }
                $(this).attr("data-isclick", true);
                var $lipic = $(".qz-pic-list-li:not(.temp)");
                var $fabuVideo = $(".fabuVideo");
                var valHtm = '', picHtm = '', videoHtm = '';
                var valcon = $(".mathIpt").val();

                //处理图片
                var images = "";
                var len = $lipic.length > 9 ? 9 : $lipic.length - 1;
                if (len > 0) {
                    images = [];
                    for (var i = 0; i < len; i++) {
                        var type = $lipic.eq(i).find("img").attr("data-type");
                        var src = $lipic.eq(i).find("img").attr("src");
                        var small = src.replace("tiny", "small");
                        var origin = src.replace("tiny", "origin");
                        var tinysquare = src.replace("tiny", "tinysquare");
                        if (type == "gif") {
                            origin = origin.replace(".jpg", ".gif");
                        }
                        var height = $lipic.eq(i).find("img").attr("data-height");
                        var width = $lipic.eq(i).find("img").attr("data-width");
                        images.push({ "tiny": src, "tinysquare": tinysquare, "small": small, "origin": origin, "height": height, "width": width, "imageType": type });
                    }
                }

                //判断视频是否添加
                var videos = "";
                if ($fabuVideo.length > 0) {
                    var avvid = '', avtit = '', avurl = '', avimg = '', avname = '';
                    if ($fabuVideo.attr("data-tit") == undefined) {
                        avtit = '视频链接'; //视频标题
                    } else {
                        avvid = $fabuVideo.attr("data-vid"); //视频id
                        avtit = $fabuVideo.attr("data-tit"); //视频标题
                        avimg = $fabuVideo.attr("data-img"); //视频图片
                        avname = $fabuVideo.attr("data-sitename"); //视频图片
                    }
                    avurl = $fabuVideo.attr("data-url"); //视频地址
                    videos = { "image": avimg, "title": avtit, "videoUrl": avurl, "videoVid": avvid, "siteName": avname };
                }
                //如果图片和视频为空就判断输入框是为空
                if (images == '' && videos == '' && !isTrim(valcon)) { alert("你还没有输入内容!"); return; }
                //上传图片或添加视频后，空内容也可以提交，否则空内容不可以提交;
                var jsondata = {
                    content: valcon,
                    images: images,
                    videos: videos,
                    clubId: clubId,
                    device: 1
                };
                $.ajax({
                    type: "post",
                    dataType: "json",
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    url: "//i.gamersky.com/club/api/addclubcontent",
                    data: { "jsondata": JSON.stringify(jsondata) },
                    success: function (result) {
                        if (result.dataType == "ok") {
                            $(this).attr("data-isclick", false);
                            $(".mathIpt").val("");
                            var html = qzFunc.createCard(result.cardgroup);
                            $("#qzCardList").prepend(html);
                            qzFunc.photoSwp();
                            //点赞
                            $(".qzBtnLike").like();
                            $(".qzBtnLike").addLike();
                            $(".qzBtnComment").commentCount();
                            //var scrolltopval = $('html').scrollTop();
                            $('html,body').removeClass('hideScroll').animate({ scrollTop: beforeOpenSt }, 0);
                            setTimeout(function () {
                                $(".qzPop").remove();
                            }, 250);
                        }
                        else {
                            alert("发布失败，请重试！");
                        }
                    }
                });
            });
        });
    };
    //获取点赞数据
    $.fn.like = function () {
        var support = "";
        $(this).each(function () {
            if (support != "") {
                support = support + ","
            }
            support = support + $(this).attr("data-clubcontentid");
        });
        var jsondata = {
            clubContentId: support
        };
        $.ajax({
            type: "get", dataType: "jsonp", url: "//i.gamersky.com/club/api/getlike",
            data: { jsondata: JSON.stringify(jsondata) },
            success: function (data) {
                if (data.status == "ok") {
                    var body = $.parseJSON(data.body);
                    $.each(body, function (index, value) {
                        $(".qzBtnLike[data-clubcontentid='" + value.Id + "']").each(function () {
                            $(this).find("b").html(value.digg);
                            $(this).attr("data-likecount", value.digg);
                        });
                    });
                }
            }
        });
    };
    //添加点赞
    $.fn.addLike = function (options) {
        return this.each(function () {
            var $this = $(this);
            $this.unbind("click");
            $this.click(function (event) {
                event.preventDefault();
                $(this).UserOnline(function (response) {
                    if (response.status == 'ok') {
                        var Id = $this.attr("data-clubcontentid");
                        var jsondata = {
                            clubContentId: Id,
                            fromDevice: 1,
                        };
                        $.ajax({
                            type: "get", dataType: "jsonp", url: "//i.gamersky.com/club/api/addlike",
                            data: { jsondata: JSON.stringify(jsondata) },
                            success: function (result) {
                                if (result.status == "err") {
                                    alert(result.body);
                                }
                                else {
                                    var m = parseInt($this.find("b").html()) + 1;
                                    $this.find("b").html(m);
                                    $(".tabNavCl a").eq(1).find("i").html(m);
                                }
                            }
                        });
                    }
                })
            });
        });
    };
    $.fn.commentCount = function () {
        var support = "";
        $(this).each(function () {
            if (support != "") {
                support = support + ","
            }
            support = support + $(this).attr("data-clubcontentid");
        });
        var jsondata = {
            clubContentId: support
        };
        $.ajax({
            type: "get", dataType: "jsonp", url: "//i.gamersky.com/club/api/getcommentcount",
            data: { jsondata: JSON.stringify(jsondata) },
            success: function (data) {
                if (data.status == "ok") {
                    var body = $.parseJSON(data.body);
                    $.each(body, function (index, value) {
                        $(".qzBtnComment[data-clubcontentid='" + value.Id + "']").each(function () {
                            $(this).html(value.commentCount);
                            $(this).attr("data-commcount", value.commentCount);
                        });
                    });
                }
            }
        });
    };
    //发布评论
    $.fn.addComment = function (beforeOpenSt) {
        var $this = $(this);
        if ($this.attr("data-isclick") == 'true') {
            return;
        }
        $this.attr("data-isclick", true);
        var text = $.trim($this.parent().siblings(".pop-con").find(".mathIpt").val());
        var userId = $this.data("userid");
        var clubContentId = $this.data("clubcontentid");
        var replyCommentId = $this.data("commentid");
        if (text == "") {
            alert("评论不能为空！");
            return;
        }
        else if (text.length >= 5000) {
            alert("评论不能超过5000个字符！");
            return;
        }
        else {
            var jsondata = {
                userId: userId,
                clubContentId: clubContentId,
                content: text,
                replyId: replyCommentId,
                fromDevice: 1
            };
            $.ajax({
                type: "post",
                dataType: "json",
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                url: "//i.gamersky.com/club/api/addcomment",
                data: { "jsondata": JSON.stringify(jsondata) },
                success: function (result) {
                    if (result.dataType == "ok") {
                        $this.attr("data-isclick", false);
                        var $qzClComment = $("#qzClComment");
                        if ($qzClComment.length > 0) {
                            var html = qzFunc.createCardComment(result.commlist);
                            $qzClComment.find("li").length == 0 ? $qzClComment.html(html) : $qzClComment.prepend(html);
                        }
                        else {
                            $(".qzBtnComment[data-clubcontentid=" + clubContentId + "]").html("1").attr("data-commcount", 1);
                        }
                        //var scrolltopval = $(".qzPop ").scrollTop();
                        $(".qzPop ").removeClass('cur');
                        $('html,body').removeClass('hideScroll').animate({ scrollTop: beforeOpenSt }, 0);
                        //等待弹层动画执行完后移除弹层
                        setTimeout(function () {
                            $(".qzPop ").remove();
                        }, 250);
                    }
                    else {
                        alert(result.body);
                    }
                }
            });
        }
    };
    $.fn.getClub = function (callback) {
        return this.each(function () {
            var $this = $(this);
            var contentType = $(".qzNavFx a.cur").attr("data-type");
            var sort = $(".qz-nav-sort").attr("data-sort");
            var pageIndex = parseInt($this.attr("data-pageIndex")) + 1;
            var pageSize = $this.attr("data-pageSize");
            var loading = $this.attr("data-loading");
            if (loading == "true") {
                return;
            }
            $this.attr("data-loading", "true");
            var length = $this.find(".qzCard").length;
            var index = 0;
            var excludeIds = $this.find(".qzCard:first").attr("data-cid");
            if (excludeIds ==undefined || excludeIds==null){
                excludeIds=""
            }
            excludeIds+=",";
            if (length >=50) {
                index = length - 50;
            }
            $this.find(".qzCard:gt(" + index + ")").each(function () {
                excludeIds += $(this).attr("data-cid") + ",";
            });
            var jsondata = {
                contentType: contentType,
                sort: sort,
                pageIndex: pageIndex,
                pageSize: pageSize,
                clubId: clubId,
                topicId: topicId,
                excludeIds: excludeIds
            };
            $this.attr("data-pageIndex", pageIndex);
            $.ajax({
                type: "get",
                dataType: "jsonp",
                url: "//i.gamersky.com/club/api/getwebcallclubcontent",
                data: { "jsondata": JSON.stringify(jsondata) },
                beforeSend: function () {
                    //插入加载动画
                    $(".qz-loadnull,.qz-loaded").remove();
                    $this.append(qzConfig.loadingDom);
                },
                success: function (result) {
                    if (pageIndex == 1) {
                        $this.attr("data-clubname", result.clubName).attr("data-topic", result.topic);
                    }
                    if (result.dataType == "ok") {
                        $this.attr("data-loading", "false");
                        $this.find('.qz-loading').remove();
                        var len = result.cardgroup.length;
                        if (pageIndex == 1 && len == 0) {
                            $this.html(qzConfig.loadnullDom).attr('data-infiload', 'close');
                        }
                        else if (pageIndex == 1 && len > 0) {
                            qzFunc.insertCard($this, result.cardgroup);
                            $this.attr("data-infiload", "open");
                            qzConfig.isCanLoading = true;
                        }
                        else if (pageIndex > 1 && len > 0) {
                            qzFunc.appendCard($this, result.cardgroup);
                            $this.attr("data-infiload", "open");
                            qzConfig.isCanLoading = true;
                        }
                        else {
                            $this.attr('data-infiload', 'close').append(qzConfig.loadedDom);
                        }
                        $(".qzBtnLike").like();
                        $(".qzBtnLike").addLike();
                        $(".qzBtnComment").commentCount();
                    }
                    else {
                        $this.find('.qz-loading').remove();
                        qzConfig.isCanLoading = false;
                        if (pageIndex > 1) {
                            $this.attr('data-loading', 'true').append(qzConfig.loadedDom);
                        }
                        else {
                            $this.attr('data-loading', 'true').html(qzConfig.loadnullDom);
                        }
                    }
                    if (typeof callback === 'function') {
                        callback && callback();
                    }
                }
            });
        });
    };
    $.fn.removeTarget = function () {
        return this.each(function () {
            $(this).find("a").attr("target", "_self");
        })
    }
    //获取参与人数
    $.fn.joinCount = function () {
        var jsondata = {
            clubId: clubId,
            topicId: topicId
        };
        $.ajax({
            type: "get", dataType: "jsonp", url: "//i.gamersky.com/club/api/getjoincount",
            data: { jsondata: JSON.stringify(jsondata) },
            success: function (data) {
                $(".joinCount").find("p span").eq(0).html(data.join + "人");
                $(".joinCount").find("p span").eq(1).html(data.clubContent);
            }
        });
    };
    $.fn.showNav = function () {
        var that = this;
        return this.each(function () {
            var jsondata = {
                clubId: clubId,
                topicId: topicId
            };
            $.ajax({
                type: "get", dataType: "jsonp", url: "//i.gamersky.com/club/api/isshownav",
                data: { jsondata: JSON.stringify(jsondata) },
                success: function (data) {
                    if (data.isElite) {
                        $(that).find("a").eq(1).css("display","block");
                    }
                    if (data.isPicture) {
                        $(that).find("a").eq(2).css("display", "block");
                    }
                    if (data.isVideo) {
                        $(that).find("a").eq(3).css("display", "block");
                    }
                    var icon;
                    if(clubId>0){
                        icon = data.clubWapIcon;
                    }
                    if($.trim(topicId) !== ''){
                        icon = data.topicWapIcon;
                    }
                    $("#qzMain .icon img").attr("src",icon);
                }
            });
        })
    }
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }
    qzFunc.main();
    $(document).ready(function () {
        $('#qzCardList').getClub();
        $(".qzNavFx").showNav();
        $(".qz-nav-sort").change(function (event) {
            event.preventDefault();
            var sort = $(this).find('option:selected').attr("data-sort");
            $(this).attr("data-sort", sort);
            $("#qzCardList").html("").attr("data-pageIndex", 0).attr("data-loading", false).getClub();
        });
        $(".joinCount").joinCount();
        var url = "";
        if (clubId > 0) {
            $(".qwqz").html("前往圈子");
            url = "//i.gamersky.com/m/club/" + clubId + "";
        }
        if (topicId > 0) {
            $(".qwqz").html("前往话题");
            url = clubId > 0 ? "//i.gamersky.com/m/topic/" + topicId + "?club=" + clubId + "" : "//i.gamersky.com/m/topic/" + topicId + "";
        }
        $(".qwqz").attr("href", url);
    });
})(jQuery);