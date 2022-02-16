const actions = function () {
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

  // FORM
  $(document).on('submit', '[data-ajax-form]', function (e) {
    e.preventDefault();

    let form = e.target;
    let formData = new FormData(form);
    let result = form.querySelector('.form-result');
    let btnSubmit = form.querySelector('.btn[type="submit"]');

    const validationConfig = {
      form: form,
      errorClass: 'feedback-input_error'
    }

    const isValid = validateForm(validationConfig);

    if (!isValid) {
      return false;
    }

    setControlState(btnSubmit, 'disabled', 'btn_disabled');

    $.ajax({
      method: form.method,
      url: form.action,
      processData: false,
      data: formData,
      dataType: 'json',
      success: function (response) {
        console.log(response);

        let resultMessage = setResultMessage({
          status: response.STATUS,
          responseText: response.STATUS === 'success' ? response.NOTE : response.ERRORS
        });

        if (response.STATUS === 'success') {
          $(result).html(resultMessage);

          form.reset();

          setTimeout(function () {
            result.innerHTML = '';
          }, 3000);
        } else if (response.STATUS === 'error') {
          $(result).html(resultMessage);
        }
      },
      error: function (response) {
        console.log(response);

        let resultMessage = setResultMessage({
          status: 'error',
          responseText: 'Неизвестная ошибка'
        });

        $(result).html(resultMessage);
      },
      complete: function () {
        setControlState(btnSubmit, 'default', 'btn_disabled');
      }
    });
  });
}

function formatResult (params) {
  let result = '';

  if (typeof params.responseText === 'object') {
    let responseArray = $.map(params.responseText, function(value) {
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

function setResultMessage (params) {
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

function setControlState (control, state, disabledClass) {
  let inputsArray = ['button', 'input'];

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

function validateForm (params) {
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
  actions();
});
