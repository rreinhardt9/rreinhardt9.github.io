$(function() {
  // Manual affix behavior for sticky navbar (Bootstrap 5 removed affix)
  $(window).on('scroll', function() {
    if ($(window).scrollTop() > 100) {
      $('#mainNav').addClass('affix');
    } else {
      $('#mainNav').removeClass('affix');
    }
  });

  // Closes the Responsive Menu on Menu Item Click (Bootstrap 5 syntax)
  $('.navbar-collapse ul li a').click(function() {
    const navbarToggler = $('.navbar-toggler:visible');
    if (navbarToggler.length) {
      const bsCollapse = new bootstrap.Collapse($('.navbar-collapse')[0], {
        toggle: true
      });
    }
  });

  // Bootstrap 5 Scrollspy - now initialized via data attributes or JS
  const scrollSpy = new bootstrap.ScrollSpy(document.body, {
    target: '#mainNav',
    offset: 51
  });

  // jQuery for page scrolling feature - requires jQuery Easing plugin
  $('a.page-scroll').on('click', function(event) {
    const $anchor = $(this);
    const href = $anchor.attr('href');
    if (href && href.startsWith('#')) {
      const target = $(href);
      if (target.length) {
        $('html, body').stop().animate({
          scrollTop: target.offset().top
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
      }
    }
  });
});
