(function ($) {
    var Layerhtml = '<div class="dp_mask"></div>';
    Layerhtml += '<div class="dp_layer">';
    Layerhtml += '  <h3>简评：<span class="gamename"></span></h3><a href="javascript:;" class="dp_layer_close"></a>';
    Layerhtml += '  <div class="Layer-top">';
    Layerhtml += '    <div class="layeruser" data-click="false">';
    Layerhtml += '      <div class="img"><img class="userimg" src="http://image.gamersky.com/webimg15/comment/anonymous.jpg" /></div>';
    Layerhtml += '      <div class="int">';
    Layerhtml += '        <div class="nav">';
    Layerhtml += '          <a href="javascript:;" class="a1" data-type="7"  data-i="0" data-click="false" fromdevice="0">想玩</a>';
    Layerhtml += '          <a href="javascript:;" class="a2" data-type="8" data-i="1" data-click="false" fromdevice="0">玩过</a>';
    Layerhtml += '        </div>';
    Layerhtml += '        <div class="dafen">';
    Layerhtml += '          <div class="dfen" id="layerdfen">';
    Layerhtml += '            <span class="dftit">打分：</span>';
    Layerhtml += '            <a href="javascript:;" fromdevice="0" data-txt="渣作"></a>';
    Layerhtml += '            <a href="javascript:;" fromdevice="0" data-txt="平庸"></a>';
    Layerhtml += '            <a href="javascript:;" fromdevice="0" data-txt="一般"></a>';
    Layerhtml += '            <a href="javascript:;" fromdevice="0" data-txt="佳作"></a>';
    Layerhtml += '            <a href="javascript:;" fromdevice="0" data-txt="神作"></a>';
    Layerhtml += '            <span class="dftxt"></span>';
    Layerhtml += '          </div>';
    Layerhtml += '        </div>';
    Layerhtml += '      </div>';
    Layerhtml += '    </div>';
    Layerhtml += '    <div class="fuxuan">';
    Layerhtml += '      <div class="tit">玩过的平台：</div>';
    Layerhtml += '      <ul class="fxuan fxuanlist" id="fxuan">';
    Layerhtml += '      </ul>';
    Layerhtml += '    </div>';
    Layerhtml += '  </div>';
    Layerhtml += '  <div class="Layer-con">';
    Layerhtml += '    <div class="tit"><h4>简短评价</h4></div>';
    Layerhtml += '    <div class="con"><textarea id="mytextarea" class="textarea-fw"></textarea></div>';
    Layerhtml += '  </div>';
    Layerhtml += '  <div class="Layer-btn">';
    Layerhtml += '    <div class="btn"><a href="javascript:;" class="cmt-btn" id="submitbtn">提交</a></div>'; //点保存后把 “正在保存...” 文字录入替换保存按钮
    Layerhtml += '    <div class="con">修改评价会重置当前评价的顶/踩数</div>';
    Layerhtml += '  </div>';
    Layerhtml += '</div>';
    var cb = new Date().getTime();//获取时间戳
    $("<link>").attr({ rel: "stylesheet", type: "text/css", href: "http://j.gamersky.com/web2015/ku/css/zqdp_layer.css?" + cb }).appendTo("head");
    var gameid = $(".gamePF1").attr("data-generalid");
    var userId = 0;
    var isTrim = function (s) { return s.replace(/(^\s*)|(\s*$)/g, ""); };  //清除空格
    if (cookie("UserCookie")) { var responseJson = $.parseJSON($.cookie("UserCookie")); userId = responseJson.userid; };
    var FloatLayer = {
        danXuan: function (div, options) {//想玩*玩过切换
            var $div = $(div);
            if (typeof (idx) == 'undefined') {
                idx = $(".pingtai").attr("date-selltime") == "未上市" ? 0 : 1;
            };
            if (options.hasClass("mybtn")) { idx = 1; }
            $div.find(".nav").find("a").removeClass("cur").eq(idx).addClass("cur");
            if ($(".pingtai").attr("date-selltime") == "未上市") {
                $div.find(".nav").find("a").eq(1).removeClass("cur").addClass("stop").attr("title", "该游戏未上市");
            }
            $(".Layer-top").find(".fuxuan,.dafen").css("display", idx == 0 ? "none" : "block");
            $div.find(".nav").on("click", "a", function (event) {
                event.preventDefault();
                if ($("#mytextarea").attr("readonly") == "readonly") { return; }
                var $this = $(this), i = $this.parents(".nav").find("a").index($this);
                if ($this.text() == "玩过" && $(".pingtai").attr("date-selltime") == '未上市') {
                    return;
                }
                $this.parents(".nav").find("a").removeClass("cur").eq(i).addClass("cur");
                $(".Layer-top").find(".fuxuan,.dafen").css("display", i == 0 ? "none" : "block");
                $(".ratingGroup .btn a").eq(i).addwanFun();
                if (i == 0) {
                    $.removeCookie("MYscore" + gameid + userId, { path: "/" });
                    $("#layerdfen a").removeClass("cur");
                    $("#layerdfen .dftxt").html('');
                }
            });
        },
        starScore: function (div) {//✩✩✩✩✩打分
            var $div = $(div), $ida = $div.find("a");
            gameid = gameid == 0 ? $(".div1 .tit_CH").attr("gameid") : gameid;
            FloatLayer.GetRating($div);
            $div.on("mouseover", "a", function () {
                if ($("#mytextarea").attr("readonly") == "readonly") { return; }
                var $this = $(this), i = $div.find("a").index($this) + 1;
                if (!judgeTime(".selltime")) { console.log(0); return; }
                FloatLayer.fnShow($div, i); $div.find(".dftxt").html($this.attr("data-txt"));
            }).on("mouseleave", function () {
                if ($("#mytextarea").attr("readonly") == "readonly") { return; }
                if (!cookie("UserCookie")) {
                    FloatLayer.fnShow($div, -1); $div.find(".dftxt").html("");
                    return;
                }
                FloatLayer.GetRating($div);
            }).on("click", "a", function (event) {
                event.preventDefault();
                if ($("#mytextarea").attr("readonly") == "readonly") { return; }
                var $this = $(this), tempnum = $this.index();
                if (!judgeTime(".selltime")) { return; }

                $div.attr("data-sorce", tempnum * 2);
                FloatLayer.AddRating($this.parent());
            });
        },
        gouXuan: function (div) {//复选玩过的平台
            $(div).find("a").each(function () {
                $(this).unbind("click");
                $(this).on("click", function (event) {
                    event.preventDefault();
                    if ($("#mytextarea").attr("readonly") == "readonly") { return; }
                    var $this = $(this);
                    if ($this.hasClass("cur") || $this.hasClass("stop")) { $this.removeClass("cur"); return; }
                    else { $this.addClass("cur"); return; }
                })
            });
            $.ajax({
                type: "GET",
                dataType: "jsonp",
                url: "http://cm1.gamersky.com/apirating/getplatform",
                data: { 'jsondata': JSON2.stringify({ "GenneralId": gameid }) },
                success: function (data) {
                    if (data.status == "ok" && data.platform != null) {
                        var platformArrays = data.platform.split("、");
                        if(!String.prototype.trim) {
                            String.prototype.trim = function () {
                                return this.replace(/^\s+|\s+$/g,'');
                            };}
                        for (var i = 0; i < platformArrays.length; i++) {
                            $("#fxuan").find("a").each(function () {
                                var $this = $(this);
                                if ($this.html().toLocaleLowerCase().trim() == platformArrays[i].toLocaleLowerCase().trim()) {
                                    $this.addClass("cur");
                                }
                            })
                        }
                    }
                }
            });
        },
        userImg: function (img) {
            var UserCookie = $.cookie("UserCookie");
            if (UserCookie !== undefined && UserCookie !== null) {
                var responseJson = $.parseJSON(UserCookie);
                var userface = responseJson.userface;
                if (!CheckImgExists(userface)) {
                    userface = 'http://image.gamersky.com/webimg15/comment/anonymous.jpg';
                }
                $(img).attr("src", userface);
            } else {
                $.ajax({
                    type: "GET", dataType: "jsonp", url: "http://i.gamersky.com/api/logincheck",
                    success: function (responseJson) {
                        if (responseJson.status == "ok") {
                            $(img).attr("src", responseJson.userface);
                        }
                    }
                });
            }
        },
        //提交评分信息
        Submit: function (div) {
            var $this = $(div);
            $this.on("click", "a.cmt-btn", function (event) {
                event.preventDefault();
                if ($('#mytextarea').attr("readonly") == "readonly") {
                    $(".Layer-btn").find(".con").html("数据加载中，请稍等…").show();
                    return;
                }
                var $con = $this.find(".textarea-fw"), con = $con.val();
                var $cmttextarea = $this.find(".remark-textarea");
                var cmtid = $(".remark-textarea").attr("cmtid");
                var that = $(this);
                var pfhtml = "";
                $("#fxuan").find(".cur").each(function () {
                    var $this = $(this);
                    pfhtml += $this.text() + "、";
                })
                if (pfhtml != '') {
                    pfhtml = pfhtml.substring(0, pfhtml.length - 1);
                }
                if (!isTrim(con)) {
                    FloatLayer.addPlatform(pfhtml);
                    that.parents(".btn").siblings().text("未输入评论内容").show();
                    $(".dp_mask,.dp_layer,.dp_pop_mask,.dp_pop_layer").remove();
                    that.attr("data-click", "true");
                } else if (con.length > 1000) {
                    FloatLayer.addPlatform(pfhtml);
                    that.parents(".btn").siblings().text("输入内容过长,请重新输入！！！").show();
                    $(".dp_mask,.dp_layer,.dp_pop_mask,.dp_pop_layer").remove();
                    that.attr("data-click", "true");

                } else {
                    if (that.attr("data-click") == "true") {
                        return;
                    }
                    that.attr("data-click", "true");
                    var div = $(".layeruser").find("a.cur");
                    var type = $(div).attr("data-type");
                    $(div).addwanFun(function (responseJson) {
                        if (responseJson.status == "ok") {
                            FloatLayer.updateIndex();
                        }
                        FloatLayer.SubmitAjax($cmttextarea, con, function (responseJson) {
                            that.attr("data-click", "false");
                            if (responseJson.status == "ok") {
                                $("body").append(alertLayer("发布成功"));
                                $(".dp_mask,.dp_layer,.dp_pop_mask,.dp_pop_layer").hide();
                            }
                            else {
                                $(".dp_mask,.dp_layer,.dp_pop_mask,.dp_pop_layer").remove();
                                $("body").append(alertLayer(responseJson.body));
                            }
                            $('#mytextarea').attr("readonly", false);
                            FloatLayer.addPlatform(pfhtml);
                        })
                    });
                }
            })
        },
        SubmitAjax: function (that, con, fun) {
            var sid = gameid;//文章ID
            var nodeId = $("#Remark").attr("nodeId");//节点ID
            var url = "";
            var title = $(".box_game .tit a").text();
            var brow = $.browser.msie ? "jsonp" : "json";
            $.ajax({
                type: "POST", dataType: brow, url: "http://cm1.gamersky.com/api/addcommnet",
                data: { jsondata: JSON2.stringify({ sid: sid, content: con, topicTitle: title, topicUrl: url, nodeId: nodeId }) },
                xhrFields: { withCredentials: true },
                success: function (responseJson) { fun(responseJson); }
            });
        },
        fnShow: function (div, num) {
            var $this = $(div);
            var $ida = $this.find("a");
            for (var i = 1; i <= $ida.length; i++) { num >= i ? $ida.eq(i - 1).addClass("cur") : $ida.eq(i - 1).removeClass("cur") }
            var dftxt = $this.find("a").eq((num) - 1).attr("data-txt");
            $this.find(".dftxt").html(dftxt);
        },
        AddRating: function (div) {
            $(div).each(function () {
                var $this = $(this);
                var sorce = $this.attr("data-sorce");
                var fromDevice = $this.attr("fromDevice");
                $.ajax({
                    type: "GET",
                    dataType: "jsonp",
                    url: "http://cm1.gamersky.com/apirating/AddRating",
                    data: { 'Rating': JSON2.stringify({ "GenneralId": gameid, 'Sorce': sorce, 'Type': "0", fromDevice: fromDevice }) },
                    success: function (data) {
                        var i = parseInt(data.Sorce / 2);
                        if (i > 0) {
                            FloatLayer.updateIndex();
                            FloatLayer.fnShow("#layerdfen", i);
                            if (data.isFrist == true) {
                                FloatLayer.fnShow("#layerdfen", i);
                            }
                            else { FloatLayer.fnShow($this, i); }
                        }
                    }
                });
            })
        },
        GetRating: function (div) {
            $(div).each(function () {
                var $this = $(this);
                $.ajax({
                    type: "GET",
                    dataType: "jsonp",
                    url: "http://cm1.gamersky.com/apirating/getuserrating",
                    data: { 'Rating': JSON2.stringify({ "GenneralId": gameid, 'Type': "0" }) },
                    success: function (data) {
                        if (data.status == "ok" && data.sorce > 0) {
                            var i = parseInt(data.sorce / 2);
                            FloatLayer.fnShow("#layerdfen", i);
                        }
                    }
                });
            })
        },
        addPlatform: function (platform) {
            $.ajax({
                type: "GET",
                dataType: "jsonp",
                url: "http://cm1.gamersky.com/apirating/addplatform",
                data: { 'jsondata': JSON2.stringify({ "GenneralId": gameid, 'platform': platform }) },
                success: function (responseJson) { }
            });
        },
        updateIndex: function () {
            var sid = gameid;
            $.ajax({
                type: "GET", dataType: "jsonp", url: "http://cm1.gamersky.com/api/updateindex",
                data: { sid: sid },
                success: function (responseJson) { }
            });
        },
        getCommnet: function (div) {
            var $this = $(div);
            $.ajax({
                type: "GET",
                dataType: "jsonp",
                url: "http://cm1.gamersky.com/api/exists",
                data: { "GenneralId": gameid },
                success: function (data) {
                    if (data.content != undefined) {
                        $this.html(data.content.replace(/<br\/>/g, "\n"));
                        $("#submitbtn").attr("class", "").attr("cmtId", data.cmtId);
                        FloatLayer.editComment("#submitbtn");
                    }
                    $('#mytextarea').attr("readonly", false);
                }
            })
        },
        editComment: function (div) {
            var $this = $(div);
            $this.on("click", function () {
                if ($('#mytextarea').attr("readonly") == "readonly") {
                    $this.parents(".btn").siblings(".con").html("数据加载中，请稍等…").show();
                    return;
                }
                var content=$("#mytextarea").val();
                if($.browser.msie<=8)
                {
                    content=$("#mytextarea").html();
                    content = content.replace(/<BR>/g, "\n")
                }
                var brow = $.browser.msie ? "jsonp" : "json";
                var cmtId = $this.attr("cmtId");
                var pfhtml = "";
                $("#fxuan").find(".cur").each(function () {
                    var $this = $(this);
                    pfhtml += $this.text() + "、";
                })
                if (pfhtml != '') {
                    pfhtml = pfhtml.substring(0, pfhtml.length - 1);
                }
                $.ajax({
                    type: "POST",
                    dataType: brow,
                    url: "http://cm1.gamersky.com/api/updatecomment",
                    xhrFields: { withCredentials: true },
                    data: { 'jsondata': JSON2.stringify({ "cmtId": cmtId, "content": content, "platform": pfhtml }) },
                    success: function (responseJson) {
                        if (responseJson.status == "ok") {
                            $(".ratingGroup .btn a").eq(idx).addwanFun(function (responseJson) { });
                            $(".dp_mask,.dp_layer,.dp_pop_mask,.dp_pop_layer").hide();
                        }
                        $('#mytextarea').attr("readonly", false);
                    }
                });
            })
        }
    };
    $.fn.wanFun = function () {
        var ids = $(this).attr("data-generalid");
        $.ajax({
            type: "GET",
            dataType: "jsonp",
            url: "http://cm1.gamersky.com/apirating/getwanrating",
            data: { 'Idlist': ids },
            success: function (data) {
                if (data.status == 'ok') {
                    $("#wantplay span").text(data.result[0].wantplayCount);
                    $("#played").text(data.result[0].playedCount);
                }
            }
        });
    };
    $.fn.addwanFun = function (fun) {
        return this.each(function () {
            var $this = $(this);
            if ($this.attr("data-click") == "false") {
                $this.attr("data-click", true);
                var Id = $this.attr("gameid");
                var type = $this.attr("data-type");
                $.ajax({
                    type: "GET",
                    dataType: "jsonp",
                    url: "http://cm1.gamersky.com/apirating/addwanRating",
                    data: { 'Rating': JSON2.stringify({ "GenneralId": Id, 'Sorce': "1", 'Type': type }) },
                    success: function (data) {
                        if(data.status == "ok")
                        {
                            $(".gamePF1").ratingFun();
                            $(".gameScore").wanFun();
                        }
                        if (fun != undefined) { fun(data); }
                        $this.attr("data-click", false);
                    }
                });
            }
        })
    };
    $.fn.starStatistics = function () {
        var $this = $(this);
        var genneralId = $this.attr("data-generalid");
        $.ajax({
            type: "GET",
            dataType: "jsonp",
            url: "http://cm1.gamersky.com/apirating/starstatistics",
            data: { "GenneralId": genneralId },
            success: function (data) {
                if (data.status == "ok") {
                    var n = 0; maxNum = 0;
                    maxNum = parseFloat(data.result[0].percentAge);
                    for (var i = 1; i < data.result.length; i++) {
                        var h = parseFloat(data.result[i].percentAge);
                        if (h > maxNum) {
                            maxNum = h;
                        }
                    }
                    for (var i = data.result.length - 1; i >= 0; i--) {
                        n++;
                        var m = data.result[i].percentAge;
                        var w = m == maxNum ? 90 : (m / maxNum) * 90;
                        w = maxNum == 0 ? maxNum : w;
                        $this.find(".tiao").eq(n - 1).attr("style", "width:" + w.toFixed(1) + "px;");
                        $this.find(".bili").eq(n - 1).html("" + m + "%");
                    }
                    if ($(".pingtai").attr("date-selltime") == "已上市") {
                        $(".gamePF1").show();
                    }
                }
                $(".loading").hide();
            }
        });
    };
    $.fn.ratingFun = function (options) {
        return this.each(function () {
            var $this = $(this);
            var genneralId = $this.attr("data-generalid");
            $.ajax({
                type: "GET",
                dataType: "jsonp",
                url: "http://cm1.gamersky.com/apirating/getplayersscore",
                data: { jsondata: JSON2.stringify({ genneralId: genneralId, num: "10" }) },
                success: function (data) {
                    if (data.status == 'ok') {
                        if ($(".pingtai").attr("date-selltime") == "已上市") {
                            var sorce = data.sorce == "10.0" ? "10" : data.sorce
                            data.totalnumber >= 10 ? $("#scoreAvg").html(sorce) : $this.find(".PF-L").html("<div class='txt'>人数不足</div>");
                            $("#scoreTimes").html(data.totalnumber);
                        }
                    }
                }
            });
        });
    };
    $.fn.mybtnClick = function () {
        var $this = $(this);
        var cmtId = $("#submitbtn").attr("cmtid");
        $("#mytextarea").focus(function () {
            if ($("#submitbtn").attr("cmtid") > 0) {
                $(".Layer-btn").find(".con").html("修改评价会重置当前评价的顶/踩数").show();
            }
        });
        FloatLayer.gouXuan("#fxuan");//复选
        FloatLayer.userImg(".layeruser .userimg")//获取用户登录头像
        FloatLayer.danXuan(".Layer-top", $this);//切换
        FloatLayer.starScore("#layerdfen");//打分
        if (cmtId == undefined) {
            $('#mytextarea').attr("readonly", true);
            FloatLayer.Submit(".dp_layer");//头部发布
            FloatLayer.getCommnet("#mytextarea");
        }
    };
    $.fn.addwanClick = function () {
        var $this = $(this);
        $this.on('click', function () {
            idx = $(this).attr("data-i");
            if (cookie("UserCookie") != null) {
                var gamename = $(".box_game .tit a").text();//获取游戏名
                if ($(".dp_layer").length == 0) {
                    $("body").append(Layerhtml);
                    var strhtml = $(".pingtai").html();
                    $(".fxuanlist").html(strhtml);
                    var len = $(strhtml).find("a").length;
                    if (len < 2) {
                        $(".fxuanlist").find("a").addClass("cur");
                    }
                    $(".dp_layer .gamename").html(gamename);
                }
                else {
                    $(".dp_layer,.dp_mask").show();
                }
                $(this).addwanFun();
                $(this).mybtnClick();
            }
        });
    };
})(jQuery)
$(function () {
    $(".gameScore").wanFun();
    $('.dpbtn').addwanClick();
    $(document).on("click", ".dp_mask,.dp_layer_close,.dp_pop_close", function (event) {//关闭弹窗
        event.preventDefault();
        $(".cmt-btn").attr("data-click", false);
        var con = $("#mytextarea").val();
        con != '' ? $(".dp_mask,.dp_layer,.dp_pop_mask,.dp_pop_layer").hide() : $(".dp_mask,.dp_layer,.dp_pop_mask,.dp_pop_layer").remove();
    });
})

function checkMarketTime(div) {
    $(div).find("a").each(function (){
        var $this = $(this);
        var time = $this.attr("data-time");
        if (judgeTime(time)) {
            $(div).attr("date-selltime", "已上市");
            return false;
        }
        else {
            $(div).attr("date-selltime", "未上市");
        }
    })
    if ($(div).find("a").length <= 0){
        $(div).attr("date-selltime", "未上市");
    }
    judgeListedState($(div));
}

function judgeListedState(div) {
    $(div).each(function () {
        var $this = $(this);
        var sellTime = $this.attr("date-selltime");
        if (sellTime == '未上市') {
            $(div).find("a").eq(1).attr("Class", "stop").attr("title", "该游戏未上市");
            $(".gameWSS").show();
            $(".gamePC1,.gamePFs").remove();
        }
    });
    $(".gamePF1").starStatistics();
    $(".gamePF1").ratingFun();
};
function judgeTime(sellTime) {
    var regx = /\(.*?\)/g;
    var reg = new RegExp("[\\u4E00-\\u9FFF]+");
    sellTime = sellTime.replace("（", "(").replace("）", ")");
    sellTime = sellTime.replace(regx, "");
    if (reg.test(sellTime)) {
        $(".selltime").find("a").eq(1).attr("Class", "stop");
        return false;
    }
    else {
        var myDate = new Date();
        var year = myDate.getFullYear();
        var month = myDate.getMonth() + 1;
        var date = myDate.getDate();
        var h = myDate.getHours();
        var m = myDate.getMinutes();
        var s = myDate.getSeconds();
        var now = year + '-' + padleft0(month) + "-" + padleft0(date);
        if (!checkEndTime(sellTime, now)) {
            return false
        }
    }
    return true
};

//补齐两位数
function padleft0(obj) {
    return obj.toString().replace(/^[0-9]{1}$/, "0" + obj);
}
//比较日期大小
function checkEndTime(startTime, endTime) {
    if (typeof (startTime) == "undefined" || typeof (endTime) == "undefined") {
        return;
    }
    var start = new Date(startTime.replace("-", "/").replace("-", "/"));
    var end = new Date(endTime.replace("-", "/").replace("-", "/"));
    if (end < start) {
        return false;
    }
    return true;
};
//检查头像
function CheckImgExists(imgurl) {
    var ImgObj = new Image(); //判断图片是否存在
    ImgObj.src = imgurl;
    //没有图片，则返回-1
    if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
        return true;
    } else {
        return false;
    }
};
function alertLayer(con) {
    var confirmhtml = '<div class="dp_pop_mask"></div>';
    confirmhtml += '<div class="dp_pop_layer">';
    confirmhtml += '<div class="dp_pop_top"><a href="javascript:;" class="dp_pop_close">×</a></div>';
    confirmhtml += '  <div class="con">' + con + '</div>';
    confirmhtml += '  <div class="btn"><a href="javascript:;" class="dp_pop_close">确定</a></div>';
    confirmhtml += '</div>';
    return confirmhtml;
}