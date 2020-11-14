var data = {
    "content": [
        {"src": '0.jpg','url':'#'},
        {"src": '1.jpg','url':'#'},
        {"src": '2.jpg','url':'#'},
        {"src": '3.jpg','url':'#'},
        {"src": '4.jpg','url':'#'},
        {"src": '5.jpg','url':'#'},
        {"src": '6.jpg','url':'#'},
        {"src": '7.jpg','url':'#'},
        {"src": '8.jpg','url':'#'},
        {"src": '9.jpg','url':'#'},
        {"src": '10.jpg','url':'#'},
        {"src": '11.jpg','url':'#'},
        {"src": '12.jpg','url':'#'},
        {"src": '13.jpg','url':'#'},
        {"src": '14.jpg','url':'#'},
        {"src": '15.jpg','url':'#'},
        {"src": '16.jpg','url':'#'},
        {"src": '17.jpg','url':'#'},
        {"src": '18.jpg','url':'#'},
    ]
};

$(window).on('load', function () {
    function render() {
        $.each(data.content, function (key, value) {
            var oBox = $('<div>').addClass('box').appendTo($('#main'));
            var oLink = $('<a>').attr('url',$(value).attr('url')).appendTo($(oBox));
            var oPic = $('<div>').addClass('pic').appendTo($(oLink));
            var oTit = $('<div>').addClass('title').appendTo($(oLink));
            var oSpan = $('<span>').appendTo($(oTit));
            $(oSpan).html(key);
            var oImg = $('<img>').attr('src', 'images/' + $(value).attr('src')).appendTo($(oPic));
        });
    }

    render();

    $("img").on('load', function () {
        waterfall();
    })

    var $lastBox = $('#main>div').last();
    var lastBoxDis = $lastBox.offset().top + Math.floor($lastBox.outerHeight());
    $('#main').height(lastBoxDis);

    $(window).on('scroll', function () {
        if (checkScrollSlide()) {
            render();
            $("img").on('load', function () {
                waterfall();
            })
        }
    });
});

$(window).on('resize', function () {
    waterfall();
})

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

function setCss(value, top, left) {
    $(value).css({
        'position': 'absolute',
        'top': top + 'px',
        'left': left + 'px',
    });
}

function checkScrollSlide() {
    var $lastBox = $('#main>div').last();
    var lastBoxDis = $lastBox.offset().top + Math.floor($lastBox.outerHeight() / 2);
    var scrollTop = $(window).scrollTop();
    var documentH = $(window).height();
    return (lastBoxDis < scrollTop + documentH) ? true : false;
}
