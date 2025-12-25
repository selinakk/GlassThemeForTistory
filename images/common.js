function requestSearch(className){
    try{
        window.location.href = '/search/' + encodeURIComponent(document.querySelectorAll(className)[0].value);
        return false;
    }catch(e){

    }
}

function setKeywordFromUrl(){
    var url = location.href.replace(/\/$/, "");
    var splitList = url.split('?')

    var path = (splitList.length > 1)
            ? splitList[0]
            : url;

    var found = path.match(/\/search\/(.+)/);
    if(found && found.length > 1)
        $('.searchInput').val(decodeURIComponent(found[1]))

}


function initProtectedKeyUp(){
    $('.box-protected input[type="password"]').on('keyup', function(){
        ($(this).val().replace(/ /g, '') != '')
                ? $(this).addClass('active')
                : $(this).removeClass('active')
    })
}


function setThumbnail(){

    $('.article-type-common:not(.checked-item)').each(function () {

        $(this).addClass('checked-item');
        var thumb = $(this).find('.thumbnail');
				var bgImg = thumb.css('background-image');
        var thumbUrl = bgImg ? bgImg.replace(/(url\(|\)|")/g, '') : bgImg;
        var img = $(this).find('.thumbnail .img-thumbnail')
        var hasThumb = true;
        var isResizeType = $(this).hasClass('article-type-resize');


        // resize no-img
        if(isResizeType && ( !img.attr('src') || img.attr('src') == 'none'))
            img.attr('src', '//t1.daumcdn.net/tistory_admin/assets/skin/no-image.png');


        // smart crop thumbnail
        if(!isResizeType){
            var thumbType = '';
            if(thumbUrl){
                if($(this).hasClass('article-type-crop')){
                    thumbType = 'S640x460.fwebp.q85'
                }
                else if($(this).hasClass('article-type-thumbnail')){
                    thumbType = 'S160x108.fwebp.q85';
                }
                else if($(this).hasClass('article-type-poster')){
                    thumbType = 'S200x265.fwebp.q85';
                }
            }

            if(thumbType != ''){
                var newThumbUrl = 'url(https://i1.daumcdn.net/thumb/' + thumbType + '/?scode=mtistory2&fname=' + thumbUrl + ')';
                thumb.css("background-image", newThumbUrl);
            }
        }
    });


    // resize for notice
    if($('.area-view .article-type-resize').length > 0){
        $('.notice-thumbnail:not(.checked-item)').each(function(){
            $(this).addClass('checked-item');
            var imgUrl = $(this).css('background-image').replace(/(url\(|\)|")/g, '');
            if(imgUrl != 'none')  $(this).find('.img-thumbnail').attr('src', imgUrl);
        });
    }
}



function initDefault(){

    var img = $('#tt-body-category .category-banner').css('background-image');
    var isCategorySection = /\/category\/(.+)/.exec(window.location.pathname) != null;

    if(isCategorySection && img != 'none' && img != undefined){
         $('body').addClass('use-category-banner');
    }


    if(window.location.pathname == '/notice'){
        $('body').addClass('notice-index')
    }

    if($('.area-view .absent_post').length > 0){
        $('body').addClass('notfoundpage');
    }

    $("#textA").bind({
        copy : function(){
            $('#message').text('copy behaviour detected!');
        },
        paste : function(){
            $('#message').text('paste behaviour detected!');
        },
        cut : function(){
            $('#message').text('cut behaviour detected!');
        }
    });

    $('.article_view').find('table').each(function (idx, el) {
        $(el).wrap('<div class="table-overflow">')
    })


    $('.area-aside .box-calendar .inner-calendar .cal_month a').filter(':eq(0), :eq(2)').text('')

    var $monthEl = $('.cal_month a:eq(1)');
    if($monthEl.length) {
        var text = $monthEl.text();
        text = text.replace('/', '. ');
        $monthEl.text(text);
    }

    $('.category_list').find('.link_item, .link_sub_item').filter('[href="' + location.pathname +'"]').addClass('selected');
}

function setProtectedView(){
    var protectedHeaderEl = $('#tt-body-page .article-header.article-header-protected');
    if(protectedHeaderEl && protectedHeaderEl.length > 0 ){
        $('body').addClass('protected-view');
    }
}


function displayControl() {
    var $location = $(location),
    pathname = $location.attr('pathname'),
    href = $location.attr('href'),
    parts = pathname.split('/');

    $('.btn_search_del').click(function () {
        $('.inp_search').val('');
    });

    if ($('.category_search_list').length != false) {
        $('.category_index_list').hide();


        $('.category_search_list .item_category').each(function (i) {
            var href = $(this).find('.link_category').attr('href'),
            $category_index_item = $('.category_index_list').find('[href="' + href + '"]'),
            thumbnail_full_path = $category_index_item.find('.item-thumbnail').css('background-image'),
            thumbnail_path = window.TistoryBlog.url + pathname;
            if (thumbnail_full_path != undefined) {
                thumbnail_path = thumbnail_full_path.replace(/^url\(['"](.+)['"]\)/, '$1');
            }
            if (thumbnail_path) {
                $(this).find('.link_category').data('thumbnail', thumbnail_path).css({
                    "background-image": "url(" + thumbnail_path + ")"
                });
                $(this).find('.item-thumbnail').data('thumbnail', thumbnail_path).css({
                    "background-image": "url(" + thumbnail_path + ")"
                });
            } else {
                $(this).find('.item-thumbnail').addClass('no_img');
            }

            $(this).find('.summary').text($category_index_item.find('.summary').text());
        });
    }

    $('.item-thumbnail').each(function (i) {
        var $o = $(this),
        thumbnail_path = $o.css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1'),
        base_path = window.TistoryBlog.url + pathname;

        if (thumbnail_path == base_path || thumbnail_path == href) {
            $o.addClass('no-img');
        }
    });
    $('.category_search_list .item_category').each(function (i) {
        var $o = $(this),
        thumbnail_path = $o.css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1'),
        base_path = window.TistoryBlog.url + pathname;
        if (thumbnail_path == base_path) {
            $o.addClass('no-img');
        }
    });
    $('.category_search_list .link_category').each(function (i) {
        var $o = $(this),
        thumbnail_path = $o.css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1'),
        base_path = window.TistoryBlog.url + pathname;
        if (thumbnail_path == base_path) {
            $o.addClass('no-img');
        }
    });

    if ($('.area-view').length != false) {

        $('.area-view .article-header').each(function(){
            var thumbnail = $(this).attr('thumbnail')

            if(thumbnail !== undefined && thumbnail){
                $(this).css('background-image', 'url(' + thumbnail + ')');
            }
            else if(!$(this).hasClass('article-header-protected')){
                $(this).addClass('article-header-noimg');
            }
        });


        if ($('.area-align > .area-slogun:first-child').length) { $('.header').addClass('border-none'); }
        if ($('.area-view > .article-type-common:first-child').length) { $('.main').addClass('notice-margin'); }
        if ($('#tt-body-archive').length > 0 || $('#tt-body-tag').length > 0 ){
            $('.main').addClass('notice-margin');
        }
    }

    if (window.T.config.USER.name) {
        $('.btn-for-user').show();
        $('.btn-for-guest').hide();
    } else {
        $('.btn-for-user').hide();
        $('.btn-for-guest').show();
    }

    $('.btn-for-guest [data-action="login"]').click(function () {
        document.location.href = 'https://www.tistory.com/auth/login?redirectUrl=' + encodeURIComponent(window.TistoryBlog.url);
    });
    $('.btn-for-user [data-action="logout"]').click(function () {
        document.location.href = 'https://www.tistory.com/auth/logout?redirectUrl=' + encodeURIComponent(window.TistoryBlog.url);
    });


    $('.area-cover').each(function () {
        $container = $(this);
        if ($container.find('.box-article .article-type-crop, .box-article .article-type-resize').length >= 3) {
            $container.children('.button-more').show();
        }
    });

    $('.area-cover .button-more').bind('click', function () {
        var $btn = $(this),
        $container = $btn.closest('.area-cover');
        $container.find('article:hidden').each(function(i) {
            $(this).slideDown();
        });

        // check, has hidden item
        if($container.children('article:hidden').length == 0) {
            $btn.hide();
        }
    });


    var $container = $('.area-main');
    var $pageMore = $container.find('.paging-more');

    var currentPage = 1;
    var nextPage = null;
    var $currentLink = $('.area-paging:last .link_num .selected');
    var $nextLink = $currentLink.parent().next('.link_num');
    if ($currentLink.length) {
        currentPage = Number($currentLink.text());
    }
    if ($nextLink.length) {
        nextPage = Number($nextLink.text());
    } else {
        nextPage = null;
    }

    if (nextPage) {
        $pageMore.on('click', function (e) {
            e.preventDefault();

            if(!$(this).hasClass('paging-more-loading')){
                $(this).addClass('paging-more-loading');
                loadList();
            }
        });
    } else {
        dropMore();
    }

    function dropMore() {
        $pageMore.parent().addClass('area-paging-more-end');
        $pageMore.remove();
    }

    function loadList() {
        var nextUrl = $nextLink.attr('href');
        $.ajax(nextUrl, {
            success: function (result) {
                $pageMore.removeClass('paging-more-loading');
                var $list = $(result).find('.area-main');

                if(!$list.length) {
                    dropMore();
                    return;
                }

                $currentLink = $list.find('.area-paging:last .link_num .selected');
                $nextLink = $currentLink.parent().next('.link_num');

                if ($nextLink.length) {
                    nextPage = Number($nextLink.text());
                } else {
                    dropMore();
                }

                $list.find('article').each(function () {
                    $container.find('article:last').after(this);
                });


                setThumbnail();
            }
        })
    }


    if($('.area-common .article-type-thumbnail, .area-view .article-type-thumbnail').length) {
        $('.title-search').addClass('title-border');
    }
}


function sliderControl() {
    $('#main .type_featured .slide_zone').each(function (i) {
        var id = 'featured_slide' + i;
        $(this).closest('.type_featured').attr('id', id);

        $(this).slick({
            arrows: true,
            dots: true,
            infinite: true,
            speed: 500,
            fade: true,
            appendArrows: $('#' + id + ' .box_arrow'),
            appendDots: $('#' + id + ' .inner_main_slide'),
            prevArrow: $('#' + id + ' .box_arrow .btn_prev'),
            nextArrow: $('#' + id + ' .box_arrow .btn_next'),
            dotsClass: 'slide_page slick-dots thema_apply',
            customPaging: function (slider, i) {
                return $('<button type="button" class="ico_circle"/>').text(i + 1);
            },
            cssEase: 'linear',
            responsive: [{
                breakpoint: 1439,
                settings: {
                    fade: false
                }
            }]
        });
    });
}

function commonClickHandler(){
    $('body').bind('click', function (e) {
        var $target = $(e.target);
        if(e.originalEvent.target.nodeName === 'INPUT') return;
        if(e.originalEvent.target.nodeName === 'ASIDE') return;
        if ($('.area-aside').find(e.originalEvent.target).length) return;

        if ($target.hasClass('tab-button') == false) {
            if ($target.closest('.button-menu').length > 0) {
                $('.area-aside').addClass('area-aside-on');
                $('body').css('overflow', 'hidden');
                $('body').addClass('bg-dimmed');
            } else if ($target.closest('.inner_sidebar').length == 0 && $target.closest('.area_popup').length == 0) {
                $('.area-aside').removeClass('area-aside-on');
                $('body').removeClass('bg-dimmed');
                $('body').css('overflow', '');
            }
        }

        var $targetChildView = false;
        if ($target.hasClass('button-modify') == true) {
            if ($target.next(".list-modify").css('display') == 'none') {
                $targetChildView = true;
            }
        }

        $(".list-modify").css('display', 'none');

        if ($target.hasClass('button-modify') == true && $targetChildView == true) {
            $target.next(".list-modify").css('display', 'block');
        }
    });



    $('.button-search').on('click', function() {
        window.location.href='/search/'+looseURIEncode(document.getElementsByName('search')[0].value)
    });

    $('.box-site button').click(function (e) {
        if ($(this).hasClass('on') == true) {
            $(this).removeClass('on');
        } else {
            $(this).addClass('on');
        }

        if ( $(this).siblings('ul').hasClass('on') == true) {
            $(this).siblings('ul').removeClass('on');
        } else {
            $(this).siblings('ul').addClass('on');
        }
    });

    $('.tab-recent li').click(function (e) {
        $(this).siblings('li').removeClass('on');
        $(this).addClass('on');

        if ($(this).hasClass('recent_button') == true) {
            $('.list-recent').css('display', 'block');
            $('.list-tab').css('display', 'none');
        }

        if ($(this).hasClass('sidebar_button') == true) {
            $('.list-recent').css('display', 'none');
            $('.list-tab').css('display', 'block');
        }
    });

    $('.tab-sns li').click(function (e) {
        $(this).siblings('li').removeClass('on');
        $(this).addClass('on');

        if ($(this).hasClass('item-facebook') == true) {
            $('.plugin-facebook').css('display', 'block');
            $('.plugin-twitter').css('display', 'none');
        }

        if ($(this).hasClass('item-twitter') == true) {
            $('.plugin-facebook').css('display', 'none');
            $('.plugin-twitter').css('display', 'block');
        }
    });
}

function hasWritePermission(){
    return (
        window.T.config.ROLE === 'owner' ||
        window.T.config.ROLE === 'manager' ||
        window.T.config.ROLE === 'editor' ||
        window.T.config.ROLE === 'writer'
    )
}

function renderEmptyPostsScreen(){
    if(window.location.pathname.startsWith('/archive')){
        return;
    }
    
    const postCountSpan = document.querySelector('.area-common .title-search span');
    
    if(!postCountSpan){
        return;
    }

    const postCountString = postCountSpan.textContent;
    if(postCountString !== '0'){
        return;
    }

    postCountSpan.parentElement.classList.add('title-border')

    const emptyMessage = `
        <article class="article-type-common">
            <div class="cont-empty"> <strong class="tit-g">아직 작성하신 글이 없어요.</strong>
            ${hasWritePermission()
                ? `<p class="desc-g">내 블로그의 첫 시작이 될 오늘의 기록을 남겨보세요!</p>
                    <div class="group-btn">
                        <a href="/manage/post" class="btn-g btn-primary">글쓰기</a>
                    </div>`
                : ''
            }
            </div>
        </article>
    `;

    postCountSpan.parentElement.insertAdjacentHTML('afterend',emptyMessage);
}

function initProfileButtons(){
    const writeButton = document.querySelector('.box-profile .btn-write');
    const blogManageButton = document.querySelector('.box-profile .btn-blog-manage');

    if(writeButton){
        writeButton.addEventListener('click', ()=>{
            window.location.href = '/manage/post';
        })
    }

    if(blogManageButton){
        blogManageButton.addEventListener('click', ()=>{
            window.location = '/manage';
        })
    }
}

function checkProfileHref () {
    const facebookAnchor = document.querySelector('.link-sns.link-facebook');
    const youtubeAnchor = document.querySelector('.link-sns.link-youtube');
    const instaAnchor = document.querySelector('.link-sns.link-insta');
    const twitterAnchor = document.querySelector('.link-sns.link-twitter');
    const bannerLinkAnchor = document.querySelector('.link-promotion');

    const anchors = [facebookAnchor, youtubeAnchor, instaAnchor, twitterAnchor, bannerLinkAnchor];
    for (const anchor of anchors) {
        if (!anchor) {
            continue;
        }
        const href = anchor.getAttribute('href');
        if (href.startsWith('//https://') || href.startsWith('//http://')) {
            anchor.setAttribute('href', href.slice(2));
        }
    }
}

(function($) {
   $(document).ready(function(){
			 setKeywordFromUrl();
			 setProtectedView();
			 initProtectedKeyUp();
			 initDefault();
			 setThumbnail();
			 displayControl();
			 sliderControl();
			 commonClickHandler();
             renderEmptyPostsScreen();
             initProfileButtons();
             checkProfileHref();
	 })
})(tjQuery);