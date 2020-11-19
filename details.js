$(window).on('load', function () {
    // html载入
    function render() {
        // var url = 'http://sx1.com.192.168.86.128.xip.io/apih5video/getImgInfo';
        var url = "http://www.myfast.com/api/test/details";
        var data = {"atlas_id":25,"page":1,limit:100};

        $.ajax({
            type: "POST",
            url: url,
            data: data,
            async:false,
            success: function(r){
                //     var key = "Y2KxDL9waDOn9Q1q";
                //     var decrypt_data = XXTEA.decryptFromBase64(r, key);
                //     var json_data = JSON.parse(decrypt_data);

                var json_data = r.data;
                $.each(json_data, function (key, value) {
                    var oBox = $('<div>').addClass('box').appendTo($('#main'));
                    var oPic = $('<div>').addClass('pic').appendTo($(oBox));
                    var oImg = $('<img>').attr('src', $(value).attr('url')).appendTo($(oPic));
                });
            }
        });
    }

    render();

    $("img").on('load', function () {
        waterfall();
    })

    // 单图片点击事件
    $('#main .box').on('tap',function(event){
        var boxL = $('#main .box').length;
        var current = $(this).index()+1;
        $('#show .num').text(current+"/"+boxL);
        $('.current').text(current);
        $('.total').text(boxL);

        $('#main').hide();
        var documentH = $(document).height();
        var documentW = $(document).width();
        $('#show .img img').attr('src',$(this).find('img').attr('src'));
        $('#show').css({'width':documentW,'height':documentH}).show();
        $('#show .img img').fadeIn("fast");
        event.stopPropagation();
    })

    // 关闭按钮
    $('#show .close').on('click',function(event){
        $('#show').hide();
        $('#main').show();
        $('#show .img img').hide();
        waterfall();
        event.stopPropagation();
    });
});

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

// 左右滑动事件
$(document).on("pageinit","#show",function(){
    // $('#main').on("swiperight",function () {
    //     location.href="index.html";
    // });

    $("#show .img").on("swiperight",function(){
        var current = parseInt($('.current').text());
        var total = parseInt($('.total').text());
        if (current > 1) {
            var el = $('#main .box:eq('+(current-2)+')').find('img').attr('src');
            $('#show .img img').attr('src',el);
            $('#show .img img').hide();
            $('#show .img img').fadeIn(100);
            $('#show .num').text((current-1)+"/"+total);
            $('.current').text(current-1);
        } else {
            $('.tips p').text('已经是第一张');
            $('.tips').show();
            window.setTimeout(function(){
                $('.tips').hide();
            },1500);
        }
    });

    $("#show .img").on("swipeleft",function(){
        var current = parseInt($('.current').text());
        var total = parseInt($('.total').text());
        if (current < total) {
            var el = $('#main .box:eq('+(current)+')').find('img').attr('src');
            $('#show .img img').attr('src',el);
            $('#show .img img').hide();
            $('#show .img img').fadeIn(100);
            var a= current+1;
            $('#show .num').text((current+1)+"/"+total);
            $('.current').text(current+1);
        } else {
            $('.tips p').text('已经是最后一张');
            $('.tips').show();
            window.setTimeout(function(){
                $('.tips').hide();
            },1500);
        }
    });
});