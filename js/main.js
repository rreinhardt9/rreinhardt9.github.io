$(function() {
  //  Offset for Main Navigation
  $('#mainNav').affix({
    offset: {
      top: 100
    }
  });

  // Closes the Responsive Menu on Menu Item Click
  $('.navbar-collapse ul li a').click(() => $('.navbar-toggle:visible').click());

  $('body').scrollspy({
    target: '.navbar-fixed-top',
    offset: 51
  });

  // jQuery for page scrolling feature - requires jQuery Easing plugin
  return $('a.page-scroll').bind('click', function(event) {
    const $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1250, 'easeInOutExpo');
    event.preventDefault();
  });
});
