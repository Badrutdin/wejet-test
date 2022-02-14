const actions = function () {
  $('.popup').magnificPopup();
  $(document).on('click', '[data-scroll]', function (e) {
    e.preventDefault();
    let target = $(this.getAttribute('href')).get(0);
    if (target) {
      $('html, body').stop().animate({
        scrollTop: $(target).offset().top
      }, 200);
    }
  })
}

$(document).ready(function () {
  actions();
});
