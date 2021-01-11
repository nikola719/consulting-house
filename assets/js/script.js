/**
 * This is script for index page
 */
// Check section is on screen
$.fn.isOnScreen = function(x, y){
  if(x == null || typeof x == 'undefined') x = 1;
  if(y == null || typeof y == 'undefined') y = 1;
  
  var win = $(window);
  
  var viewport = {
      top : win.scrollTop(),
      left : win.scrollLeft()
  };
  viewport.right = viewport.left + win.width();
  viewport.bottom = viewport.top + win.height();
  
  var height = this.outerHeight();
  var width = this.outerWidth();

  if(!width || !height){
      return false;
  }
  
  var bounds = this.offset();
  bounds.right = bounds.left + width;
  bounds.bottom = bounds.top + height;
  
  var visible = (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
  
  if(!visible){
      return false;   
  }
  
  var deltas = {
      top : Math.min( 1, ( bounds.bottom - viewport.top ) / height),
      bottom : Math.min(1, ( viewport.bottom - bounds.top ) / height),
      left : Math.min(1, ( bounds.right - viewport.left ) / width),
      right : Math.min(1, ( viewport.right - bounds.left ) / width)
  };
  
  return (deltas.left * deltas.right) >= x && (deltas.top * deltas.bottom) >= y;
};

var historyJson = [
  {
    year: 2009,
    families: 1400,
    volumn: 430,
    ave_deals: 14,
    ave_volumn: 109983,
    commission: 11
  },{
    year: 2010,
    families: 1450,
    volumn: 460,
    ave_deals: 19,
    ave_volumn: 139589,
    commission: 11.3
  },{
    year: 2011,
    families: 1500,
    volumn: 500,
    ave_deals: 23,
    ave_volumn: 163984,
    commission: 11.6
  },{
    year: 2012,
    families: 1600,
    volumn: 600,
    ave_deals: 30,
    ave_volumn: 253286,
    commission: 12
  },
]

$(document).ready(function () {
  // Init Home slider
  // $('#home_slider').slick({
  //   arrows: false,
  //   autoplay: true,
  //   autoplaySpeed: 2000,
  //   dots: false,
  //   infinite: true,
  //   speed: 300,
  //   slidesToShow: 1,
  // });

  // Init Fancybox
  $('[data-fancybox="gallery"]').fancybox({
    animationEffect: "zoom-in-out",
    transitionEffect: "tube",
    thumbs: {
      autoStart: true,
    }
  });

  // Wow init
  new WOW().init();

  // Init scroll spy
  $('.page-scroller__num').click(function () {
    $('.page-scroller__num.active').removeClass('active');
    $(this).addClass('active');

    let target = $(this).attr('href');
    $('html, body').animate({
      scrollTop: $(target).offset().top
    }, 800);
  });

  // change page-scroller percent
  $(window).scroll(function () {
    let s = $(window).scrollTop(),
      d = $(document).height(),
      c = $(window).height();
    scrollPercent = (s / (d - c)) * 100;
    if (s > 50) $('.header').addClass('header-sticky');
    else $('.header').removeClass('header-sticky');
    let position = scrollPercent + '%';
    $(".page-scroller__percent").css('height', position);
  });

  // Next section
  $('.page-scroller__down').click(function () {
    let currentId = $('.page-scroller__num.active').data('id');
    let nextId;
    if (currentId < 7) nextId = currentId + 1;
    else nextId = 1;
    $('.page-scroller__num[data-id="' + nextId + '"]').trigger('click');
  });

  // active page scroller when element in view
  $(window).on('resize scroll', function () {
    $('.section').each(function () {
      let currentId = $(this).data('id');
      if ($(this).isOnScreen(0, 0.5)) {
        $('.page-scroller__num[data-id="' + currentId + '"]').addClass('active');
      } else {
        $('.page-scroller__num[data-id="' + currentId + '"]').removeClass('active');
      }
    });
  });

  // Init flyup settings
  $('.btn-learn-more').click(function() {
    $('.hamburger').trigger('click');
  });
  $('.hamburger').click(function() {
    $(this).toggleClass('active');
    if ($(this).hasClass('active')) {
      $('.flyup').css("display", "flex").hide().fadeToggle();
      $('body').css('overflow', 'hidden');
    }
    else {
      $('.flyup').fadeOut();
      $('body').css('overflow-y', 'auto');
    }
  });
  $('.btn-commission-splits').click(function(e) {
    e.preventDefault();
    if ($('#form_split').valid()) {
      $('.flyup-content__step1').fadeOut(400, () => {
        $('.flyup-content__step2').fadeIn();
      });
    }
  });
  $('.btn-choose-plan').click(function() {
    $('.flyup').fadeOut(400, () => {
      $('.flyup-content__step1').show();
      $('.flyup-content__step2').hide();
    });
    $('.hamburger').trigger('click');
  });

  // Video play button
  $('.btn-video-play').on('click', function() {
    let videoId = $(this).data('target');
    let video = document.getElementById(videoId);
    if (video.paused) {
      video.play();
      video.controls = true;
      $(this).fadeOut();
    } else {
      video.pause();
      $(this).fadeIn();
    }
  });

  // Numbers
  function animateNum(elmnt) {
    var $this = elmnt;
    jQuery({ Counter: 0 }).animate({ Counter: $this.text() }, {
      duration: 1000,
      easing: 'swing',
      step: function () {
        $this.text(Math.ceil(this.Counter));
      }
    });
  }
  function animateHistoryNum() {
    $('.history-number').each(function() {
      animateNum($(this));
    });
  }
  animateHistoryNum();

  /** 
   * History section update
   * @param year
   * @param mode true-down false-up
   * */ 
  function updateHistory(year, mode) {
    if (mode) year --;
    else year ++;
    historyJson.forEach((history, index) => {
      if (history.year == year) {
        $('#history_families').html(history.families);
        $('#history_volumn').html(history.volumn);
        $('#history_deals').html(history.ave_deals);
        $('#history_ave_volumn').html(history.ave_volumn);
        $('#history_commission').html(history.commission);
        animateHistoryNum();
      }
    });
    $('.timeline-control__year').text(year);
  }
  $('.timeline-control__next').click(function() {
    let year = $('.timeline-control__year').text();
    updateHistory(year, true);
  });
  $('.timeline-control__prev').click(function() {
    let year = $('.timeline-control__year').text();
    updateHistory(year, false);
  });
});