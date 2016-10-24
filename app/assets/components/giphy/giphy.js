(function() {
    var a = $ = undefined;
    if (window.jQuery === undefined || window.jQuery.fn.jquery !== '1.10.2') {
        var b = document.createElement('script');
        b.setAttribute("type", "text/javascript");
        b.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js");
        if (b.readyState) {
            b.onreadystatechange = function() {
                if (this.readyState == 'complete' || this.readyState == 'loaded')
                    c();
            }
            ;
        } else
            b.onload = c;
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(b);
    } else {
        script_loaded = true;
        a = window.jQuery;
        $ = window.jQuery;
        c();
    }
    function c() {
        var a = document.createElement('script');
        a.setAttribute("type", "text/javascript");
        if (document.location.protocol == 'https:')
            a.setAttribute("src", "https://ssl.google-analytics.com/ga.js");
        else
            a.setAttribute("src", "http://www.google-analytics.com/ga.js");
        if (a.readyState) {
            a.onreadystatechange = function() {
                if (this.readyState == 'complete' || this.readyState == 'loaded')
                    d();
            }
            ;
        } else
            a.onload = d;
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(a);
    }
    function d() {
        // var a = document.createElement('script');
        // a.setAttribute("type", "text/javascript");
        // a.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquerymobile/1.4.2/jquery.mobile.min.js");
        // if (a.readyState) {
        //     a.onreadystatechange = function() {
        //         if (this.readyState == 'complete' || this.readyState == 'loaded')
        //             f();
        //     }
        //     ;
        // } else
        //     a.onload = f;
        // (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(a);
        f();
    }
    function e() {
        var a = document.getElementsByTagName('script');
        for (var c = 0; c < a.length; c++) {
            b = a[c];
            if (b.src.indexOf('/js/widgets/embed.js') > -1)
                return b.src.split('//')[1].split('/')[0];
        }
        return 'giphy.com';
    }
    ;function f() {
        var a = _giphy.pop();
        var b = a.id;
        var c = a.h;
        var d = a.w;
        var f = a.clickthrough_url;
        var g = $("#_giphy_" + b).parent().width();
        var h = $("#_giphy_" + b).css('max-width').replace('px', '');
        if (!isNaN(h))
            if (!isNaN(g) && g > h)
                i = h;
            else if (!isNaN(g))
                i = g;
            else
                i = d;
        else
            var i = $("#_giphy_" + b).parent().width() || 500;
        var j = (c * i) / d;
        var k = $('<div />');
        k.attr('width', i);
        k.attr('height', j);
        k.attr('id', 'gifdiv' + b);
        k.css('overflow', 'hidden');
        k.css('position', 'relative');
        k.addClass('giphy-embed');
        var l = $('<img>');
        if (typeof _giphy_play_on_hover !== "undefined")
            var m = "https://media.giphy.com/media/" + b + "/200w_s.gif";
        else
            var m = "https://media.giphy.com/media/" + b + "/giphy.gif";
        l.attr('data-animated', "https://media.giphy.com/media/" + b + "/giphy.gif");
        l.attr('data-still', "https://media.giphy.com/media/" + b + "/200w_s.gif");
        l.attr('id', "gifimg" + b);
        l.attr('src', m);
        l.addClass('giphyembed');
        l.css('width', i);
        l.css('height', j);
        l.css('cursor', 'pointer');
        var n = e();
        var o = 'https:' == document.location.protocol ? 'https://' : 'http://';
        var p = $("<a>");
        p.attr("href", f);
        p.attr("target", "_blank");
        l.appendTo(p);
        p.appendTo(k);
        var q = document.title;
        document.title = document.location.href;
        var r = _gat._getTracker("UA-38174542-5");
        r._trackPageview('/embed/' + b + '/widget/track/');
        document.title = q;
        var s = $('<iframe>', {
            width: 1,
            height: 1,
            frameborder: 0,
            src: '//' + n + '/embed/' + b + '/widget/track/'
        }).appendTo($("#_giphy_" + b));
        $("#_giphy_" + b).width(i);
        $("#_giphy_" + b).height(j);
        if (typeof _gif_artist !== 'undefined' && typeof _suppress_chrome === 'undefined') {
            var t = $('<a id="' + b + '"></a>').attr('href', o + n + '/' + _gif_artist + '?utm_source=iframe&utm_medium=embed&utm_campaign=artist_name').attr('target', '_blank').attr('style', "font-family:'Interface',Helvetica,Arial;display:block; position: absolute;z-index:1000; height:36px; overflow:hidden; line-height:36px; font-size:14px; color:#666; background:white; margin:0px; padding:0px; opacity: 0.95; -webkit-transition: left .5s ease-out; -moz-transition: left .5s ease-out; -ms-transition: left .5s ease-out; -o-transition: left .5s ease-out; transition: left .5s ease-in-out;").css('top', $('#_giphy_' + b).height() + $('#_giphy_' + b).position().top - 44).append('<img src="' + _gif_artist_avatar + '" height="40" style="display:block; float:right"/><span style="display:block; float:left; padding:0px 19px; white-space:nowrap;">Created by <span style="color: #0cf;">' + _gif_artist + '</span>').appendTo(k);
            k.hover(function(a) {
                $('#' + b).css('left', '0px');
            }, function(a) {
                $('#' + b).css('left', '-500px');
            });
        }
        k.appendTo('#_giphy_' + b);
        if (typeof _giphy_play_on_hover !== "undefined") {
            $("#gifimg" + b).on("tap", function(a) {
                if ($(this).attr("src") == $(this).attr("data-animated")) {
                    $(".giphyembed").each(function() {
                        $(this).attr("src", $(this).attr("data-still"));
                    });
                    $(this).attr("src", $(this).attr("data-still"));
                    a.preventDefault();
                    return false;
                } else {
                    $(this).attr("src", $(this).attr("data-animated"));
                    a.preventDefault();
                    return false;
                }
            });
            $("#gifdiv" + b).on('mouseover', function(a) {
                $(".giphyembed").each(function() {
                    $(this).attr("src", $(this).attr("data-still"));
                });
                $(this).find('.giphyembed').attr("src", $(this).find('.giphyembed').attr("data-animated"));
            });
            $("#gifdiv" + b).on('mouseleave', function(a) {
                $(this).find('.giphyembed').attr("src", $(this).find('.giphyembed').attr("data-still"));
            });
        }
        $(document).on('scroll', function() {
            var a = $(window).scrollTop();
            var c = a + $(window).height();
            if (((($("#_giphy_" + b).offset().top + $("#_giphy_" + b).height()) <= c) && (($("#_giphy_" + b).offset().top + $("#_giphy_" + b).height()) >= a)) ) {
                if ($("#_giphy_" + b).find('img').attr("src") != $("#_giphy_" + b).find('img').attr("data-animated"))
                    $("#_giphy_" + b).find('img').attr("src", $("#_giphy_" + b).find('img').attr("data-animated"));
            } else
                $("#_giphy_" + b).find('img').attr("src", $("#_giphy_" + b).find('img').attr("data-still"));
        });
    }
})(window);
