var swipe_exception = false;


$(function(){

    function fixScrollEvent() {
        $("html,body").on("mousewheel", function (e) {
            e.preventDefault();
        
            var wheelDelta = event.wheelDelta;	
            var currentScrollPosition = window.pageYOffset;
                
            window.scrollTo(0, currentScrollPosition - wheelDelta);
        });
        
        $("html,body").on("keydown", function (e) {
            e.preventDefault(); 
                
            var currentScrollPosition = window.pageYOffset;

            switch (e.which) {
                case 38: // up
                    window.scrollTo(0, currentScrollPosition - 120);
                    break;
        
                case 40: // down
                    window.scrollTo(0, currentScrollPosition + 120);
                    break;
        
                default: return;
            } 
        });
    }

    var headerImg = $(".header_img").width();
    var galImg = $(".gal_img").width();
    $(".header_img").css("height",headerImg);
    $(".cont_wrap").css("min-height",$(window).height());
    $(".gal_img").css("height",galImg);
    $(".gal_img2").css("height",galImg / 2);
    
    $(window).bind("orientationchange, resize", function(e) {
        var headerImg = $(".header_img").width();
        var galImg = $(".gal_img").width();
        $(".header_img").css("height",headerImg);
        $(".cont_wrap").css("min-height",$(window).height());
        $(".gal_img").css("height",galImg);
        $(".gal_img2").css("height",galImg / 2);
    });	

    window.addEventListener('scroll', function() {		
        var scrollTop = $(this).scrollTop();
        if(scrollTop > 40){
            $('.header_panel,.lnb_mobile').addClass('show');
        } else {
            $('.header_panel,.lnb_mobile').removeClass('show');
        };
        $('.home_wrap').each(function(){
            if ($(window).width() <= 1024){
                $(this).addClass('mobile');
                if(scrollTop > $(this).offset().top - 300){
                    $(this).addClass('animated');
                };
                if(scrollTop > $(this).offset().top - 100){
                    $('.header_svg').addClass('sticky');
                } else {
                    $('.header_svg').removeClass('sticky');
                };
                if(scrollTop > $(this).offset().top + $(this).outerHeight(true) + 200){
                    $('.header_svg').hide();
                } else {
                    $('.header_svg').show();
                };
                if(scrollTop > $('.invite_wrap').offset().top + $('.invite_wrap').outerHeight(true) - $(window).height()){
                    $('.header_panel').removeClass('show');
                };
            } else {
                $(this).addClass('animated');
            };
        });
    });

    if(navigator.userAgent.indexOf('Trident') != -1){	//This is Internet Explorer 11 or below
        if(typeof(window.msIndexedDB) != 'undefined'){ //This is IE10 or higher
            $('.header_bg').hide();
            $('.header_bg_ie').show();
        }
    }


    $(document).on('click', '#interaction', function(e) {
        e.preventDefault();
        
        var $this = $(this);
        var md = $this.prev().attr('id').replace(/_(p)?map_canvas/, '');
        var map = maps[md];

        var option = {};

        if (map.getOptions("draggable")) {
            option = {
                draggable: false,
                pinchZoom: false,
                scrollWheel: false,
                keyboardShortcuts: false,
                disableDoubleTapZoom: true,
                disableDoubleClickZoom: true,
                disableTwoFingerTapZoom: true
            }
        } else { // 지도 인터랙션 켜기 (잠금풀기)
            option = {
                draggable: true,
                pinchZoom: true,
                scrollWheel: true,
                keyboardShortcuts: true,
                disableDoubleTapZoom: false,
                disableDoubleClickZoom: false,
                disableTwoFingerTapZoom: false
            }
        }
        
        map.setOptions(option);


        $this.toggleClass("control-on");
    });

    function callKimNavi(md){
        alert('모바일기기에서만 가능합니다.');
    }

    function callKakaoNavi(md){
        var $map_addr, $map_lat, $map_lon
        alert('모바일기기에서만 가능합니다.');
    }


    var $map_addr=''
    var $map_lat=''
    var $map_lon='';

    function callOllehNavi(md){
        alert('모바일기기에서만 가능합니다.');
    }


function callTmapNavi(md){
    //console.log(md);

        alert('모바일기기에서만 가능합니다.');
    }

    

window.onload = function () {
    $('.js_lightgallery').masonry({
        //columnWidth: .snsbbs_sections,
        //isFitWidth : true,
        itemSelector: '.item_g',
        transitionDuration: 0
    }).on( 'layoutComplete', function() {
    return true;
    });
}	

    var closest = function closest(el, fn) {
    return el && (fn(el) ? el : closest(el.parentNode, fn));
    };

    var photoswipeParseHash = function() {
    var hash = window.location.hash.substring(1),
        params = {};

    if (hash.length < 5) {
        return params;
    }

    var vars = hash.split('&');
    for (var i = 0; i < vars.length; i++) {
        if (!vars[i]) {
        continue;
        }
        var pair = vars[i].split('=');
        if (pair.length < 2) {
        continue;
        }
        params[pair[0]] = pair[1];
    }

    if (params.gid) {
        params.gid = parseInt(params.gid, 10);
    }

    return params;
    };

    function getGallery($el) {
    var el = [];
    var aTag = Array.prototype.slice.call($el.find("a"));
    var galleryImage = aTag.filter(function(el) {
        return $(el).hasClass('swipebox');
    });

    $.merge(el, galleryImage);

    return el;
    }

    function onThumbnailsClick(e) {
    e = e || window.event;
    e.preventDefault ? e.preventDefault() : e.returnValue = false;

    var eTarget = e.target || e.srcElement;
    var clickedListItem = closest(eTarget, function(el) {
        var tagName = el.tagName.toUpperCase();
        return (tagName && tagName === 'A');
    });

    if (!clickedListItem) {
        return;
    }

    if (clickedListItem.className.indexOf("swipebox") == -1) {
        return false;
    }

    var childNodes = el,
        numChildNodes = el.length,
        nodeIndex = 0,
        index = 0;

    var no_image_count = 0;
    for (var i = 0; i < numChildNodes; i++) {
        if (el[i].className.indexOf("swipebox") == -1) {
        no_image_count++;
        }

        if (el[i] == clickedListItem) {
        index = i - no_image_count;

        break;
        }
    }

    if (index >= 0) {
        openPhotoSwipe(index, el);
    }

    return false;
    }

    var gallery;

    function getPrefix(prop) {
        var style = document.body.style;
        var prefix = ['Webkit', 'ms', 'moz', 'o'];
        var prefix_len = prefix.length;

        if(style[prop] == '') {
            return prop;
        }

        prop = prop[0].toUpperCase() + prop.slice(1);

        for(var i = 0; i < prefix_len; i++) {
            if(style[prefix[i] + prop] == '') {
                return prefix[i] + prop;
            }
        }
    }

    function getTranslate(transform) {
        var regex;

        if(transform.indexOf('translate3d') == -1) {
            regex = /translate\(([-0-9.]+)px, ([-0-9.]+)px\)/;
        } else {
            regex = /translate3d\(([-0-9.]+)px, ([-0-9.]+)px, ([-0-9.]+)px\)/;
        }

        var matched = transform.match(regex);
        var coordinate = {};

        coordinate.x = matched[1];
        coordinate.y = matched[2];

        if(matched[3]) {
            coordinate.z = matched[3];
        }

        return coordinate;
    }

    function getScale(transform) {
        var regex = /scale\(([0-9.]+)\)/;
        var matched = transform.match(regex);

        return matched[1];
    }

    function psBeforeInitAddEvent() {
    gallery.listen('gettingData', function(index, item) {
        var size = item.el.getAttribute("data-size").split("X");

        item.w = size[0];
        item.h = size[1];
    });

    gallery.listen('arrowUpdate', function() {
        var $nextBtn = $('.pswp__button--arrow--right');
        var $prevBtn = $('.pswp__button--arrow--left');
        var loop = this.options.loop;
        var index = this.getCurrentIndex();

        $nextBtn.toggle(loop || index < this.items.length - 1);
        $prevBtn.toggle(loop || index > 0);
    });

    gallery.listen('initialZoomIn', function() {

    });
    }

    function psAfterInitAddEvent() {
    gallery.listen('initialZoomOut', function() {
        var item = this.currItem;
        var container_style = item.container.style;
        var transform = getPrefix('transform');
        var transition = getPrefix('transition');

        if(!transform || !transition) {
            return;
        }

        var container_transform = container_style[getPrefix('transform')];
        var scale = getScale(container_transform);
        var coordinate = getTranslate(container_transform);
        var initTransY = item.initialPosition.y;
        var currTransY = coordinate.y;
        var size = item.el.getAttribute("data-size").split("X");
        var transX = item.initialPosition.x;
        var transY;

        if(initTransY > currTransY) {
            transY = -(size[1]);
        } else {
            transY = window.screen.availHeight;
        }

        container_style[transition] = "transform " + gallery.options.hideAnimationDuration + "ms";

        if(!this.isGestureClose() && this.isVerticalDrag()){
            container_style[getPrefix('transform')] = "translate3d(" + transX + "px, " + transY + "px, 0px) scale(" + scale + ")";
        }
    });

    gallery.listen('close', function() {
        /* 슬라이드
        var slide_show = document.getElementById("slide-show");

        if(slide_show.checked) {
            var event = document.createEvent('Event');

            event.initEvent('change', true, true);

            slide_show.checked = false;
            slide_show.dispatchEvent(event);
        }
        */

        // pswp 플러그인에서 스크롤 이벤트를 unbind 시키는 문제로 scroll 이벤트가 재바인드
        this.framework.bind(window, 'scroll', function() {
            if(typeof headerAnimate == "function") {
                headerAnimate();
            }
        });


    });


    /* 슬라이드
    $("#slide-show").on("change", function(e) {
        var next;
        var index;
        var last = gallery.items.length - 1;

        if($(this).is(":checked")) {
            gallery.show = setInterval(function() {
                index = gallery.getCurrentIndex();

                if(index == 0) {
                    next = true;
                } else if(index == last) {
                    next = false;
                }

                if(next) {
                    gallery.next();
                } else {
                    gallery.prev();
                }
            }, 3000);
        } else {
            clearInterval(gallery.show);
            delete gallery.show;
        }
    });
    */
    }

    var $my_gallery = $("#sk_gallery");
    var my_gallery_count = $my_gallery.length;
    var el = getGallery($my_gallery);
    var $el = $(el);
    var hashData = photoswipeParseHash();
    
    $el.on("click", onThumbnailsClick);
    




    function setPosition(id){
        var $obj = $('#sk_'+id);
        // console.log(id);
        
        $('body').scrollTo($obj, 500);
    }

    $('.menu_scrolls').click(function(){
        try{
            if($(this).attr('id')){


                var id = $(this).attr('id').replace('p_','').replace('m_','');

                //console.log(id);

                setPosition(id);
            }
        }catch(e){
            //console.log(e);
        }
    }).css('cursor','pointer');


            //initialize('wedding');

    //혼주 연락처 팝업 처리
    $('.pa-groom').click(function() {
        $('.tabs_bride, #tabs_bride').removeClass('active');
        $('.tabs_groom, #tabs_groom').addClass('active');

        showParentPopup();
    });
    
    $('.pa-bride').click(function() {
        $('.tabs_groom, #tabs_groom').removeClass('active');
        $('.tabs_bride, #tabs_bride').addClass('active');
        
        showParentPopup();
    });

    $('.popup_back span').click(function(){
        $('body').css('overflow-y', '');
        $('.popup_parents').hide();
    });




});

$( window ).load(function() {


});