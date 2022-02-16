function setFieldState(input, state) {
  // получение тега, что б в случае ошибочного использования ф-ии с другими полями
  // отрабатывала другая логика (если будет)
  // либо функция не отрабатывала вообще
  if (input.prop("tagName") === 'INPUT') {
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
  // if(input.prop("tagName") === 'ANOTHER TAG'){
  //   another logic
  // }
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

$(document).ready(function () {

  $('.popup').magnificPopup({});

  // $('.owl-carousel').owlCarousel();

  $(document).on('click', '[data-scroll]', function (e) {
    e.preventDefault();
    let target = $(this.getAttribute('href')).get(0);
    if (target) {
      $('html, body').stop().animate({
        scrollTop: $(target).offset().top
      }, 200);
    }
  })

  $('input[type=tel]').mask('+7 (000) 000 00 00');

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
