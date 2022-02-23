function setFieldState(input, state) {
  if (state === 'focusIn') {
    input.closest('.animated-input').find('.animated-input__label').addClass('animated-input__label_focus')
  } else if (state === 'focusOut') {
    if (input.val() === '') {
      input.closest('.animated-input').find('.animated-input__label').removeClass('animated-input__label_focus')
    }
  } else if (state === 'changed') {
    if (input.val() !== '') {
      input.closest('.animated-input').find('.animated-input__label').addClass('animated-input__label_changed')
    } else {
      input.closest('.animated-input').find('.animated-input__label').removeClass('animated-input__label_changed')
    }
  }
}

function formatResult(params) {
  let result = '';

  if (typeof params.responseText === 'object') {
    let responseArray = $.map(params.responseText, function (value) {
      return value;
    });

    for (let i = 0; i < responseArray.length; i++) {
      result += responseArray[i] + '<br>';
    }
  } else if (typeof params.responseText === 'string') {
    result = params.responseText;
  }

  return result;
}

// инициализация сообщения
function setResultMessage(params) {
  let el = document.createElement('div');
  let classes = {
    success: 'success',
    error: 'error'
  }

  el.className = 'c-alert c-alert_' + classes[params.status];

  if (typeof params.responseText === 'object' || typeof params.responseText === 'string') {
    el.innerHTML = formatResult({
      responseText: params.responseText
    });
  }

  return el;
}

// состояние кнопки
function setControlState(control, state, disabledClass) {
  let inputsArray = ['button', 'input'];
  // отключаем элемент взависимости от переданного сотояния
  switch (state) {
    case 'default':
      control.classList.remove(disabledClass);
      if (inputsArray.indexOf(control.nodeName.toLowerCase()) > -1) {
        control.disabled = false;
      }
      break;

    case 'disabled':
      control.classList.add(disabledClass);

      if (inputsArray.indexOf(control.nodeName.toLowerCase()) > -1) {
        control.disabled = true;
      }
      break;
  }
}

function validateForm(params) {
  let isValid = true;
  let controls = params.form.querySelectorAll('input[required], input[data-required]');

  for (let i = 0; i < controls.length; i++) {
    let control = controls[i];

    if (control.value) {
      control.classList.remove(params.errorClass);

      if (typeof params.onSuccess === 'function') {
        params.onSuccess(control);
      }
    } else {
      isValid = false;

      control.classList.add(params.errorClass);

      if (typeof params.onError === 'function') {
        params.onError(control);
      }
    }
  }

  return isValid;
}

/**
 *
 * @param {event} event
 * @param {string} modifier
 */
function setSlideStyle(event, modifier) {
  const slider = event.target
  const slides  = slider.querySelectorAll('.owl-item')
  for (let i = 0; i <= slides.length; i++) {
    let slide = $(slides[i]);
    if (event.item.index === i) {
      $(slide).removeClass(`${modifier}`)
    } else {
      $(slide).addClass(`${modifier}`)
    }
  }
}

$(document).ready(function () {
  $('.block-1__astronaut').paroller({
    factor: -0.5,            // multiplier for scrolling speed and offset
    type: 'foreground',     // background, foreground
  });
  $('.popup').magnificPopup({
    callbacks: {
      open: function () {
        const magnificPopup = $.magnificPopup.instance;
        const content = magnificPopup.content.get(0);
        const inputs = $(content).find('.animated-input__input');

        inputs.each(function () {
          if (this.value.length) {
            setFieldState($(this), 'changed')
          }
        });
      }
    }
    // closeMarkup:'<div ><img  class="mfp-close" title="Закрыть"  src="/images/Icon ionic-md-close.png" alt=""></div>'
  });
  // $('.mfp-close').on( "click", function() {
  //   $.magnificPopup.close();
  // });
  const $slider = $('.wj-slider-container')
  $slider.owlCarousel({
    nav: false,
    dots: false,
    autoWidth: true,
    margin: 50,
    responsive: {
      640: {
        margin: 70
      },
      768: {
        margin: 30
      },
      1024: {
        margin: 108
      },
      1366: {
        margin: 126
      },
    }
  });
  $slider.on('changed.owl.carousel', function (event) {
  setSlideStyle(event,'wj-slide_secondary')
  })
  const tickerSpeed = 100
  $('.tickers__ticker').marquee({
    speed:tickerSpeed,
    duplicated:true,
    startVisible:true,
  });

  $(document).on('click', '[data-scroll]', function (e) {
    e.preventDefault();
    let target = $(this.getAttribute('href')).get(0);
    if (target) {
      $('html, body').stop().animate({
        scrollTop: $(target).offset().top
      }, 200);
    }
  })

  // настройки телефонной маски. Предусматривают как ввод через +7, так и через 8
  const phoneMaskOptions = {
    translation: {
      r: {
        pattern: /[+]/,
        optional: true
      }
    }
  };

  $('input[type=tel]').mask('r0 (000) 000-00-00', phoneMaskOptions);

  $(document).on('focus', '.animated-input__input', function () {
    setFieldState($(this), 'focusIn')
  });
  $(document).on('blur', '.animated-input__input', function () {
    setFieldState($(this), 'focusOut')

  });
  $(document).on('input', '.animated-input__input', function () {
    setFieldState($(this), 'changed')
  });



  // FORM
  $(document).on('submit', '[data-ajax-form]', function (e) {
    // сбрасываем формы
    e.preventDefault();
    // определяем форму
    let form = e.target;
    // определяем данные
    let formData = new FormData(form);
    // определяем контейнер для сообщения
    let result = form.querySelector('.form-result');
    // определяем кнопку
    let btnSubmit = form.querySelector('.btn[type="submit"]');
    // создаем конфиг для передачи в функцию валидации
    const validationConfig = {
      form: form,
      errorClass: 'feedback-input_error'
    }
    // выполняется валидация
    const isValid = validateForm(validationConfig);
    // в случае невалидных данных прерываем действия
    if (!isValid) {
      return false;
    }
    // отключаем кнопку до завершения отправки
    setControlState(btnSubmit, 'disabled', 'btn_disabled');

    $.ajax({
      method: form.method,
      url: form.action,
      processData: false,
      data: formData,
      dataType: 'json',
      success: function (response) {
        console.log(response);
        // инициализируем элемент сообщения
        let resultMessage = setResultMessage({
          status: response.STATUS,
          responseText: response.STATUS === 'success' ? response.NOTE : response.ERRORS
        });

        if (response.STATUS === 'success') {
          // кладем сообщение в контейнер
          $(result).html(resultMessage);
          // сбрасываем состояние формы
          form.reset();
          // сообщение исчезает через 3 секунды
          setTimeout(function () {
            result.innerHTML = '';
          }, 3000);
        } else if (response.STATUS === 'error') {
          // кладем сообщение в контейнер
          $(result).html(resultMessage);
        }
      },
      error: function (response) {
        console.log(response);
        // инициализируем элемент сообщения
        let resultMessage = setResultMessage({
          status: 'error',
          responseText: 'Неизвестная ошибка'
        });
        // кладем сообщение в контейнер
        $(result).html(resultMessage);
      },
      complete: function () {
        // включаем кнопку
        setControlState(btnSubmit, 'default', 'btn_disabled');
      }
    });
  });

});
