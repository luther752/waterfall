$(window).on('load', function () {
    var page = 1;

    // html载入
    function render(page) {
        // var url = 'http://sx1.com.192.168.86.128.xip.io/apih5video/atlasList';
        var url = "http://www.myfast.com/api/test/index";
        var limit = 10;
        var data = {"page":page,"limit":limit};

        $.ajax({
            type: "POST",
            url: url,
            data: data,
            async:false,
            success: function(r){
                // var key = "Y2KxDL9waDOn9Q1q";
                // var decrypt_data = XXTEA.decryptFromBase64(r, key);
                // var json_data = JSON.parse(decrypt_data);

                var json_data = r.data;
                $.each(json_data, function (key, value) {
                    var oBox = $('<div>').addClass('box').appendTo($('#main'));
                    var oLink = $('<a>').attr(
                        {
                            'href':'details.html?id='+$(value).attr('id'),
                            'target':'_blank'
                        }).appendTo($(oBox));
                    var oPic = $('<div>').addClass('pic').appendTo($(oLink));
                    var oTit = $('<div>').addClass('title').appendTo($(oLink));
                    var oSpan = $('<span>').html($(value).attr('title')).appendTo($(oTit));
                    var oImg = $('<img>').attr('src', $(value).attr('cover')).appendTo($(oPic));
                });
            }
        });
    }

    render(page);
    $("img").on('load', function () {
        waterfall();
    })

    // 页面滚动
    $(window).on('scroll', function () {
        if (checkScrollSlide()) {
            page++;
            if (localStorage) {
                localStorage.page = page;
            }
            render(page);
            $("img").on('load', function () {
                waterfall();
            })
        }
    });
});

$(window).on('resize', function () {
    waterfall();
})

// 生成瀑布流
function waterfall() {
    var $boxes = $('#main>div');
    var w = $boxes.eq(0).outerWidth();
    var cols = Math.floor($(window).width() / w);
    $('#main').width(w * cols).css('margin', '0 auto');
    var hArr = [];
    $boxes.each(function (index, value) {
        if (index < cols) {
            var h = $(value).outerHeight();
            hArr.push(h);
            if (index == 0) {
                setCss(value, 0, '-5');
            } else {
                setCss(value, 0, w + 5);
            }
        } else {
            var minH = Math.min.apply(null, hArr);
            var minHIndex = $.inArray(minH, hArr);

            // box向上top增加
            var row = Math.floor(index / 2);
            var top_add = row * 10;

            if (minHIndex == 0) {
                setCss(value, minH + top_add, '-5');
            } else {
                setCss(value, minH + top_add, minHIndex * w + 5);
            }
            hArr[minHIndex] += $(value).outerHeight();
        }
    });
}

// 设置瀑布流css
function setCss(value, top, left) {
    $(value).css({
        'position': 'absolute',
        'top': top + 'px',
        'left': left + 'px',
    });
}

// 检测滚动到屏幕底部
function checkScrollSlide() {
    var $lastBox = $('#main>div').last();
    var lastBoxDis = $lastBox.offset().top + Math.floor($lastBox.outerHeight() / 2);
    var scrollTop = $(window).scrollTop();
    var documentH = $(window).height();
    return (lastBoxDis < scrollTop + documentH) ? true : false;
}