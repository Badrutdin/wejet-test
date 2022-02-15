const actions = function () {
  $('.popup').magnificPopup({});
  $('.owl-carousel').owlCarousel();
  $(document).on('click', '[data-scroll]', function (e) {
    e.preventDefault();
    let target = $(this.getAttribute('href')).get(0);
    if (target) {
      $('html, body').stop().animate({
        scrollTop: $(target).offset().top
      }, 200);
    }
  })
  $(document).on('focus', '.animated-input__input', function () {
    $(this).closest('.animated-input').find('.animated-input__label').addClass('animated-input__label_focus')
  });
  $(document).on('blur', '.animated-input__input', function () {
    $(this).closest('.animated-input').find('.animated-input__label').removeClass('animated-input__label_focus')
  });
  $(document).on('input', '.animated-input__input', function () {
    if ($(this).val() !== '') {
      $(this).addClass('animated-input__input_changed')
      $(this).closest('.animated-input').find('.animated-input__label').addClass('animated-input__label_changed')
    } else {
      $(this).removeClass('animated-input__input_changed')
      $(this).closest('.animated-input').find('.animated-input__label').removeClass('animated-input__label_changed')
    }
  });
  // просто добавил поэксперементировать
  $(document).on('focus', '[type="tel"]',function(){
    if ($(this).val() === ''){
    $(this).val('+7')
    $(this).trigger('input')
    }
  })
  $(document).on('blur', '[type="tel"]',function(){
    if ($(this).val() === '+7'){
      $(this).val('')
      $(this).trigger('input')
    }
  })

}

$(document).ready(function () {
  actions();
});
