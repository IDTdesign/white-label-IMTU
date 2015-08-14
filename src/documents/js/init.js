jQuery(document).ready(function ($) {
    'use strict';

    var contentSections = $('.cover'),
        navigationItems = $('#cd-vertical-nav a'),
        submenuItems = $('.active .submenu a, .js-local');

    function updateNavigation() {
        contentSections.each(function () {
            var $this = $(this);
            var activeSection = $('#cd-vertical-nav a[href="#' + $this.attr('id') + '"]').data('number') - 1;
            if (($this.offset().top - $(window).height() / 2 < $(window).scrollTop()) && ($this.offset().top + $this.height() - $(window).height() / 2 > $(window).scrollTop())) {
                navigationItems.eq(activeSection).addClass('is-selected');
            } else {
                navigationItems.eq(activeSection).removeClass('is-selected');
            }
        });
    }

    function smoothScroll(target) {
        $('body,html').animate(
            {'scrollTop': target.offset().top},
            600
        );
    }

    updateNavigation();
    $(window).on('scroll', function () {
        updateNavigation();
    });

    //smooth scroll to the section
    submenuItems.on('click', function (event) {
        event.preventDefault();
        smoothScroll($(this.hash));
    });

    //smooth scroll to the section
    navigationItems.on('click', function (event) {
        event.preventDefault();
        smoothScroll($(this.hash));
    });

    //smooth scroll to second section
    $('.cd-scroll-down').on('click', function (event) {
        event.preventDefault();
        smoothScroll($(this.hash));
    });

    //open-close navigation on touch devices
    $('.touch .cd-nav-trigger').on('click', function () {
        $('.touch #cd-vertical-nav').toggleClass('open');

    });

    //close navigation on touch devices when selectin an elemnt from the list
    $('.touch #cd-vertical-nav a').on('click', function () {
        $('.touch #cd-vertical-nav').removeClass('open');
    });

    // detect scrolling direction
    // add class to body

    $(function () {
        var bodyElem = $('body'),
            lastScrollTop = 0,
            maxScrollTop = 160, //top area with
            delta = 50;

        $(window).scroll(function (event) {
            var scrolledFromTop = $(this).scrollTop();

            if (scrolledFromTop < maxScrollTop) {
                bodyElem.addClass("js-scrollfix");
            } else {
                bodyElem.removeClass("js-scrollfix");
            }

            if (Math.abs(lastScrollTop - scrolledFromTop) <= delta) {
                return;
            }

            if (scrolledFromTop > lastScrollTop) {
                // downscroll code
                bodyElem.removeClass("js-scrollup").addClass("js-scrolldown");
            } else {
               // upscroll code
                bodyElem.removeClass("js-scrolldown").addClass("js-scrollup");
            }

            lastScrollTop = scrolledFromTop;
        });
    });

    $(function () {
        FastClick.attach(document.body);
    });
});
