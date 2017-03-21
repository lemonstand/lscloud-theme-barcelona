var zoom = 16;
var latitude = 41.040585;
var longitude = 28.970257;

$(window).bind("load", function() {
    var timeout = setTimeout(function() {
        $(".product-mini-gallery img").trigger("loadImagesNow");
        $(".brands-slider img").trigger("loadImagesNow");
    }, 1000);
});

$(window).load(function() {

    //SinglePage slide activator
    if ($('.section-single-product-page').length > 0) {
        var singlePSlider = $(".single-product-slider").carouFredSel({
            auto: false,
            items: 1
        });
        $(".single-product-gallery .next-btn").click(function(event) {
            event.preventDefault();
            $('.single-product-slider').trigger("next", 1);
        });
        $(".single-product-gallery .prev-btn").click(function(event) {
            event.preventDefault();
            $('.single-product-slider').trigger("prev", 1);
        });
        if ($('.single-product-vertical-gallery').length > 0) {
            $('.single-product-vertical-gallery ul').carouFredSel({
                direction: 'up',
                auto: false,
                items: 4,
                circular: true
            });
            $(".single-product-vertical-gallery .up-btn").click(function(event) {
                event.preventDefault();
                $('.single-product-vertical-gallery ul').trigger("next", 1);
            });
            $(".single-product-vertical-gallery .down-btn").click(function(event) {
                event.preventDefault();
                $('.single-product-vertical-gallery ul').trigger("prev", 1);
            });
            $(".single-product-vertical-gallery .vertical-gallery-item").click(function(event) {
                event.preventDefault();
                tid = $(this).attr('href');
                targetSlide = $(".single-product-gallery-item" + tid);
                console.log(targetSlide)
                singlePSlider.trigger('slideTo', targetSlide);
            });
        }

        // Horizontal Single page gallery
        if ($('.single-product-horizontal-gallery').length > 0) {
            $('.single-product-horizontal-gallery ul').carouFredSel({
                auto: false,
                circular: true
            });
            $(".single-product-horizontal-gallery .next-btn").click(function(event) {
                event.preventDefault();
                $('.single-product-horizontal-gallery ul').trigger("next", 1);
            });
            $(".single-product-horizontal-gallery .prev-btn").click(function(event) {
                event.preventDefault();
                $('.single-product-horizontal-gallery ul').trigger("prev", 1);
            });
            $(".single-product-horizontal-gallery .horizontal-gallery-item").click(function(event) {
                event.preventDefault();
                tid = $(this).attr('href');
                targetSlide = $(".single-product-gallery-item" + tid);
                console.log(targetSlide)
                singlePSlider.trigger('slideTo', targetSlide);
            });
        }
    }

});


$(document).ajaxComplete(function() {
    //Credit Card Validation
    if ($('.credit-card-input').length) {
        $('.credit-card-input').validateCreditCard(function(result) {
            $('.credit-card-input').parent().find('.fa').remove();
            if (result.length_valid === true) {
                $('.credit-card-input').parent().append('<span class="fa-check-circle fa" />');
            } else {
                $('.credit-card-input').parent().append('<span class="fa-times-circle fa" />');
            }
        });
        if ($('.credit-card-input').val() == '') {
            $('.credit-card-input').parent().find('.fa').remove();
        }
    }
});

$(document).ready(function() {

    if ($(".chzn-select").length) {
        //CHOSEN SELECTS
        $(".chzn-select").chosen({
            width: "100%"
        });
    }

    $(window).on('onAjaxAfterUpdate', function() {
        $(".chzn-select").trigger("chosen:updated");
        $(".chzn-select").chosen({
            width: "100%"
        });
    })

    //Use billing address for shipping address checkbox
    $(document).on('click', '#billing-continue', function() {
        if ($('.md-check').is(':checked')) {
            $(this).sendRequest('shop:onCheckoutBillingInfo', {
                onAfterUpdate: function() {
                    $(this).sendRequest('shop:onCopyBillingToShipping', {
                        extraFields: {
                            'nextStep': 'shipping_method',
                            'doCheckout': '1',
                            'step': ''
                        },
                        update: {
                            '#checkout-page': 'shop-checkout',
                            '#mini-cart': 'shop-minicart'
                        }
                    });
                }
            });
        } else {
            $(this).sendRequest('shop:checkout', {
                update: {
                    '#checkout-page': 'shop-checkout',
                    '#mini-cart': 'shop-minicart'
                }
            });
        }
    });

    //Checkout Shipping Methods - update cart
    $('#checkout-page').on('change', '#shipping-methods input', function() {
        // When the shipping method is shipping we want to update the
        // order totals area on the Checkout page. The native Checkout
        // action does all the calculations.
        //
        $(this).sendRequest('shop:checkout', {
            update: {
                '#cart-totals': 'shop-cart-totals',
                '#mini-cart': 'shop-minicart'
            }
        });
    });

    //Payment forms LEMONSTAND
    $(document).on('change', '#payment_method', function() {
        $(this).sendRequest('shop:onUpdatePaymentMethod', {              
            update: {
                '#payment_form': 'shop-paymentform'
            }        
        });
    });

    //Checkbox custom CSS
    if ($('.md-check').length > 0) {
        $('.md-check').iCheck({
            checkboxClass: 'md-check'
        });
    }

    //Featured, Arrival Tab controller
    $('.panel-title > a').click(function(e) {
        e.preventDefault();
        $('.panel-collapse.in').collapse('hide');
        var targetAccordion = $($(this).attr('href'));
        targetAccordion.collapse('show');
    });

    //PlaceHolders controller for input
    $('input,textarea').focus(function() {
        $(this).data('placeholder', $(this).attr('placeholder'))
        $(this).attr('placeholder', '');
    });
    $('input,textarea').blur(function() {
        $(this).attr('placeholder', $(this).data('placeholder'));
    });

    //DropDown Menu
    $(".top-menu .dropdown").hover(function() {
        $(this).addClass('open');
    }, function() {
        $(this).removeClass('open');
    });

    //Mega Menu
    $('.mega-menu > a').hover(function() {
        $('.top-menu .dropdown.open').removeClass('open');
        $(this).parent().addClass('active');
        $(this).parent().find('.mega-menu-holder').addClass('shown').fadeIn(0);
    }, function(event) {
        trgt = $(event.relatedTarget);
        if (!trgt.hasClass('shown')) {
            $(this).parent().find('.mega-menu-holder.shown').fadeOut(0).removeClass('shown');
            $(this).parent().removeClass('active');
        }
    });
    $('.mega-menu-holder').mouseleave(function(event) {
        if ($(this).hasClass('shown')) {
            $(this).fadeOut(0).removeClass('shown');
            $(this).parent().removeClass('active');
        }
    });

    //Top menu select (responsive mode) controller
    $('.top-drop-menu').change(function() {
        var loc = ($(this).find('option:selected').val());
        window.location = loc;
    });

    //Google Map Activator
    var mapIsNotActive = true;
    setupCustomMap();
    $('.payment-method-buttons button').click(function(e) {
        e.preventDefault();
        $(this).toggleClass('selected');
    });
    $('.section-shopping-cart-page .cart-item .close-btn').click(function(event) {
        event.preventDefault();
        el = $(this).parent().parent();
        el.fadeOut(function() {
            el.remove();
        });
    });

    function setupCustomMap() {
        if ($('.map-holder').length > 0 && mapIsNotActive) {
            var styles = [{
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [{
                    "visibility": "simplified"
                }, {
                    "color": "#E6E6E6"
                }]
            }, {
                "featureType": "administrative",
                "stylers": [{
                    "visibility": "simplified"
                }]
            }, {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{
                    "visibility": "on"
                }, {
                    "saturation": -100
                }]
            }, {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#808080"
                }, {
                    "visibility": "on"
                }]
            }, {
                "featureType": "water",
                "stylers": [{
                    "color": "#CECECE"
                }, {
                    "visibility": "on"
                }]
            }, {
                "featureType": "poi",
                "stylers": [{
                    "visibility": "on"
                }]
            }, {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#E5E5E5"
                }, {
                    "visibility": "on"
                }]
            }, {
                "featureType": "road.local",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#ffffff"
                }, {
                    "visibility": "on"
                }]
            }, {}];
            if ($('.map').hasClass('center')) {
                var lt = (latitude);
                var ld = (longitude);
            } else {
                var lt = (latitude + 0.0027);
                var ld = (longitude - 0.010);
            }
            var options = {
                mapTypeControlOptions: {
                    mapTypeIds: ['Styled']
                },
                center: new google.maps.LatLng(lt, ld),
                zoom: zoom,
                disableDefaultUI: true,
                scrollwheel: false,
                mapTypeId: 'Styled'
            };
            var div = document.getElementById('map');
            var map = new google.maps.Map(div, options);
            var styledMapType = new google.maps.StyledMapType(styles, {
                name: 'Styled'
            });
            var image = '';
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(latitude, longitude),
                map: map,
                icon: image
            });
            map.mapTypes.set('Styled', styledMapType);
            mapIsNotActive = false;
        }
    }

    //Mini Gallery Controller "in products"
    var miniGallerySliders = new Array();

    function checkMiniGalleries() {
        indx = $('.tab-pane.active').attr('id');
        if ($('.tab-pane.active .product-mini-gallery').length > 0) {
            if (miniGallerySliders[indx] === undefined || miniGallerySliders[indx] === false) {
                $('.tab-pane.active .product-mini-gallery').carouFredSel({
                    auto: false
                });
                miniGallerySliders[indx] = true;
            }
        }
    }

    //    Lightbox activator
    if ($('a[data-rel="prettyphoto"]').length > 0) {
        $('a[data-rel="prettyphoto"]').prettyPhoto();
    }



    // Color Options background color setters (radio buttons)
    if ($('.color-option').length > 0) {
        $('.color-option').each(function() {
            color = $(this).attr('data-color');
            $(this).css('background-color', color);
        });
    }

    //Rating Star activator
    if ($('.star').length > 0) {
        $('.star').raty({
            starOff: 'images/star-off.png',
            starOn: 'images/star-on.png',
            score: function() {
                return $(this).attr('data-score');
            }
        });
    }

    //
    // Star rating
    //
    $('.rating > span').click(function() {
        var currentId = $(this).attr('id');
        if (currentId === 'hate') {
            $('#hate').addClass('select');
            $('#dont-like, #ok, #like, #love').removeClass('select');
            $('.rating > p').text('I hate it');
            $("#item_rating").val('1');
        }
        if (currentId === 'dont-like') {
            $('#hate, #dont-like').addClass('select');
            $('#ok, #like, #love').removeClass('select');
            $('.rating > p').text('I don\'t like it');
            $("#item_rating").val('2');
        }
        if (currentId === 'ok') {
            $('#hate, #dont-like, #ok').addClass('select');
            $('#like, #love').removeClass('select');
            $('.rating > p').text('It\'s ok');
            $("#item_rating").val('3');
        }
        if (currentId === 'like') {
            $('#hate, #dont-like, #ok, #like').addClass('select');
            $('#love').removeClass('select');
            $('.rating > p').text('I like it');
            $("#item_rating").val('4');
        }
        if (currentId === 'love') {
            $('#hate, #dont-like, #ok, #like, #love').addClass('select');
            $('.rating > p').text('I love it');
            $("#item_rating").val('5');
        }

    });

    //Sidebar Price Slider
    if ($('.price-slider').length > 0) {
        $('.price-slider').slider({
            min: 100,
            max: 700,
            step: 10,
            value: [100, 400],
            handle: "square"
        });
    }

    //Pagination Helpers
    $('.paging-holder li a').each(function() {
        var $el = $(this);
        if (!$.isNumeric($el.text())) {
            $el.addClass('prev-next-page');
        }
    });

    //list / grid local storage
    $('.grid-list-buttons li a').on('click', function() {
        if ($(this).attr('href') == '#list-view') {
            localStorage.shopView = 'list';
        } else {
            localStorage.shopView = 'grid';
        }
    });
    if (localStorage.shopView == 'list') {
        $('.grid-list-buttons li, .product-grid .tab-pane').toggleClass('active');
    }

    //Sidebar widget activator
    if ($('.accordion-widget').length > 0) {
        $('.category-accordions .accordion-body').parent().find('.accordion-toggle').toggleClass('collapsed');
        $('.category-accordions .accordion-body').collapse("hide");
        $('.accordion-body').on('hidden', function() {});
        $('.accordion-body').on('shown', function() {});
    }

    //Product mini gallery
    if ($(".product-mini-gallery").length > 0) {
        allminigalleries = $(".product-mini-gallery img").length;
        $(".product-mini-gallery img").each(function(i) {
            src = $(this).attr('src');
            $(this).attr('data-original', src);

            if (i + 1 >= allminigalleries) {
                checkMiniGalleries();
            }
        });
        $(".product-mini-gallery img").lazyload({
            event: "loadImagesNow",
            effect: "fadeIn"
        });
    }
    $(".product-mini-gallery").parent().parent().parent().find('.mini-prev').click(function(event) {
        event.preventDefault();
        $(this).parent().find('.product-mini-gallery').trigger("prev", 1);
    });
    $(".product-mini-gallery").parent().parent().parent().find('.mini-next').click(function(event) {
        event.preventDefault();
        $(this).parent().find('.product-mini-gallery').trigger("next", 1);
    });

    //Grid/list buttons switchers on product sidebar page
    if ($('.grid-list-buttons').length > 0) {
        setTimeout(checkMiniGalleries, 200);
    }
    $('.grid-list-buttons a').click(function(e) {
        e.preventDefault();
        setTimeout(checkMiniGalleries, 200);
    });

    //Brand Slider activator
    if ($(".brands-slider").length > 0) {
        $(".brands-slider img").lazyload({
            event: "loadImagesNow",
            effect: "fadeIn"
        });
    }
    allBrandItems = $(".brands-slider img").length;
    $(".brands-slider img").each(function(i) {
        src = $(this).attr('src');
        $(this).attr('data-original', src);
        $(this).attr('src', "http://placehold.it/264x81/ffffff/333333/&text=Loading...");
        if (i + 1 >= allBrandItems) {
            startBrandsSlider();
        }
    });

    function startBrandsSlider() {
        $('.section-brands-slider .brands-slider').carouFredSel({
            auto: false
        });
        $(".section-brands-slider .brands-slider").parent().parent().find('.brands-next').click(function(event) {
            event.preventDefault();
            $(this).parent().find('.brands-slider').trigger("next", 1);
        });
        $(".section-brands-slider .brands-slider").parent().parent().find('.brands-prev').click(function(event) {
            event.preventDefault();
            $(this).parent().find('.brands-slider').trigger("prev", 1);
        });
    }

    //Image lazy activator
    if ($("img.lazy").length > 0) {
        allImgs = $("img.lazy").length;
        $("img.lazy").each(function(i) {
            src = $(this).attr('src');
            $(this).attr('data-original', src);
            if (i + 1 >= allImgs) {
                $("img.lazy").lazyload({
                    effect: "fadeIn"
                });
            }
        });
    }

    //    Footer products image lazy activator
    if ($(".footer-products").length > 0) {
        $(".footer-products img").lazyload({
            effect: "fadeIn"
        });
    }

    //    Tabs controller
    $('.active-tab').click(function(event) {
        event.preventDefault();
    });
    $('#homepage-products-tab .nav-tabs a.tab-control').click(function(event) {
        event.preventDefault();
        parentEl = $(this).parent().parent().parent().parent();
        //parentEl.find('.active-tab').text($(this).text());
        $("#homepage-products-tab  .active").removeClass('active');
        $(this).tab('show');
        parentEl.addClass('active');
        if (parentEl.find('.hover-holder li.active').length > 0) {
            parentEl.find('.nav-tabs > li').addClass('active');
        }
        setTimeout(function() {
            checkMiniGalleries();
        }, 200);
    });

    function clearAnimations() {
        $('.flex-caption .texts-holder:before,.flex-caption .texts-holder:after').animate({
            'opacity': 0
        });
        $('.animated.bounceInUp').each(function() {
            $('.animated.bounceInUp').removeClass('animated').removeClass('bounceInUp');
        });
        $('.animated.bounceOutUp').each(function() {
            $('.animated.bounceOutUp').removeClass('animated').removeClass('bounceOutUp');
        });
        $('.animated.bounceInLeft').each(function() {
            $('.animated.bounceInLeft').removeClass('animated').removeClass('bounceInLeft');
        });
    }
    //    Homepage 1 slider activator
    setupSliderStyle1();

    function setupSliderStyle1() {
        if ($('.flexslider').length > 0) {
            $('.flexslider').flexslider({
                prevText: "",
                nextText: "",
                slideshow: true,
                start: function(slider) {
                    $('.flexslider').find('.preloader').removeClass('loading');
                    cs = slider.find('.slide').eq(slider.currentSlide);
                    bl = cs.find('.flex-caption .back-layer');
                    flimg = cs.find('.flex-caption .front-layer .image');
                    fltxt = cs.find('.flex-caption .front-layer .texts-holder');
                    bl.find('.anim').addClass('animated bounceInUp');
                    setTimeout(function() {
                        flimg.find('.anim').addClass('animated bounceInLeft');
                    }, 500);
                    setTimeout(function() {
                        fltxt.find('.anim').addClass('animated bounceInUp');
                    }, 800);
                },
                after: function(slider) {
                    $('.flexslider').find('.preloader').removeClass('loading');
                    cs = slider.find('.slide').eq(slider.currentSlide);
                    bl = cs.find('.flex-caption .back-layer');
                    flimg = cs.find('.flex-caption .front-layer .image');
                    fltxt = cs.find('.flex-caption .front-layer .texts-holder');
                    bl.find('.anim').addClass('animated bounceInUp');
                    setTimeout(function() {
                        flimg.find('.anim').addClass('animated bounceInLeft');
                    }, 500);
                    setTimeout(function() {
                        fltxt.find('.anim').addClass('animated bounceInUp');
                    }, 800);
                },
                before: function(slider) {
                    $('.flexslider').find('.preloader').addClass('loading');
                    cs = slider.find('.slide').eq(slider.currentSlide);
                    el = cs.find('.flex-caption div');
                    bl = cs.find('.flex-caption .back-layer');
                    fl = cs.find('.flex-caption .front-layer');
                    clearAnimations();
                    fl.find('.anim').addClass('animated bounceOutUp');
                    bl.find('.anim').addClass('animated bounceOutUp');
                }
            });
        }
    }

    //    Top page cart close button
    $('.top-cart-holder .hover-holder .remove-item').click(function(event) {
        event.preventDefault();
        $(this).parent().parent().fadeOut(function() {
            $(this).remove();
        });
    });

    //Contact form setup
    checkContactForm();

    function checkContactForm() {
        if ($(".contact-form").length > 0) {
            //  triggers contact form validation
            var formStatus = $(".contact-form").validate();
            //   =====================================================
            //sending contact form
            $(".contact-form").submit(function(e) {
                e.preventDefault();
                if (formStatus.errorList.length === 0) {
                    $(".contact-form .submit").fadeOut(function() {
                        $('#loading').css('visibility', 'visible');
                        $.post('submit.php', $(".contact-form").serialize(), function(data) {
                            $(".contact-form input,.contact-form textarea").not('.submit').val('');
                            $('.message-box').html(data);
                            $('#loading').css('visibility', 'hidden');
                            $(".contact-form .submit").removeClass('disabled').css('display', 'block');
                        });
                    });
                }
            });
        }
    }
});

function writeReview() {
    $('#productWriteModal').modal('show');
}
