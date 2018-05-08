(function ($) {
var urlParam = function (name, url) {
    if (!url) {
        url = window.location.href;
    }
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(url);
    if (!results) {
        return "";
    }
    return results[1] || "";
};
var QZloginForm = function ($this) {
    $this.on("click", "#qqLogin", function (event) {
        event.preventDefault();
        var returnUrl = window.location.href;
        if (urlParam("from")) { returnUrl = urlParam("from"); }
        window.location.href = "//i.gamersky.com/oauth/authorizelogin?authorizetype=qq&returnUrl=" + encodeURI(returnUrl);
    }).on("click", "#sinaLogin", function (event) {
        event.preventDefault();
        var returnUrl = window.location.href;
        if (urlParam("from")) { returnUrl = urlParam("from"); }
        window.location.href = "//i.gamersky.com/oauth/authorizelogin?authorizetype=sina&returnUrl=" + encodeURI(returnUrl);
    }).on("click", "#wxLogin", function (event) {
        event.preventDefault();
        var returnUrl = window.location.href;
        if (urlParam("from")) { returnUrl = urlParam("from"); }
        window.location.href = "//i.gamersky.com/oauth/authorizelogin?authorizetype=weixin&returnUrl=" + encodeURI(returnUrl);
    }).on("keyup", "ui-passport-userName,.ui-passport-password", function (event) {
        if (event.keyCode == 13) { $this.find(".ui-passport-login-button").click(); }
    }).on("click", ".ui-passport-login-button", function () {
        var $userName = $this.find(".ui-passport-userName"), userName = $userName.val();
        var $pwd = $this.find(".ui-passport-password"), pwd = $pwd.val();
        var expiration = $this.find("#persistentcookie").attr("checked") ? "Year" : "None";
        if (userName == "") { alert("请填写用户名！"); $userName.focus(); return; }
        if (pwd == "") { alert("请填写密码！"); $pwd.focus(); return; }

        $.ajax({
            type: "GET",
            url: "//i.gamersky.com/api/userlogin",
            dataType: "jsonp",
            data: {
                logindata: JSON2.stringify({ username: userName, password: pwd, checkcode: "", expiration: expiration })
            },
            success: function (responseJson) {
                switch (responseJson.status) {
                    case "ok":
						//window.location.reload();
                        var loginTimestamp = new Date().getTime();
                        window.location.href = window.location.href+'?timestamp='+loginTimestamp;
                        break;
                    case "err": alert(responseJson.body); break;
                }
            }
        });
    });
}
    QZloginForm($(".User-login"));
    $(".Ul-close a.Close").click(function () {
        try {
            if (unescape(urlParam("from"))) {
                window.location.href = unescape(urlParam("from"));
            }
        } catch (e) { }
    });
    $('.ui-passport-login-button').on('click', function () {
        $(this).focus();
    });

$(document).bind('login', function () {
    try {
        if (unescape(urlParam("from"))) {
            window.location.href = unescape(urlParam("from"));
        }
    } catch (e) {

    }
});
function iptClear() {
    var ipt = $('.Ul-userName');
    ipt.parent().find('.UI-ipt-btn-clear').addClass('cur').on('tap', function () {
        ipt.val('');
        $(this).removeClass('cur');
    });
}
function iptSpsw() {
    var ipt = $('.UI-ipt-btn-showpsw').parent().find('.Ul-password');
    $('.UI-ipt-btn-showpsw').on('tap', function () {
        if (ipt[0].type == 'text') {
            $(this).text('显示密码');
            ipt[0].type = 'password';
        } else {
            $(this).text('隐藏密码');
            ipt[0].type = 'text';
        }
    });
}
iptSpsw()
})(jQuery)