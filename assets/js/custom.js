var modalViewLoad = `
  <div class="form__preloader">
    <div class="form__loading_2">
      <span class="percent__progress"></span>
      <span class="chart-one animate">
        <figcaption>
        </figcaption>
      </span>
      <div class="form__loader_2"></div>
    </div>
  </div>`;

function CreateValidNot(typeError, langError) {

    var ErrorsText = [
        [
            ['en', 'No numbers and special characters'],
            ['ru', 'Без цифр и специальных символов'],
            ['pl', 'Brak cyfr i znaków specjalnych'],
            ['es', 'Sin números ni caracteres especiales'],
            ['de', 'Keine Zahlen und Sonderzeichen'],
            ['cs', 'Žádná čísla a speciální znaky'],
            ['fr', 'Pas de chiffres et de caractères spéciaux'],
            ['it', 'Nessun numero e caratteri speciali']
        ],
        [
            ['en', '2 characters minimum'],
            ['ru', 'Минимум 2 символа'],
            ['pl', 'Minimum 2 znaki'],
            ['es', 'Mínimo 2 caracteres'],
            ['de', 'Mindestens 2 Zeichen'],
            ['cs', '2 znaky minimálně'],
            ['fr', '2 caractères minimum'],
            ['it', 'Minimo 2 caratteri']
        ],
        [
            ['en', 'Incorrect Email'],
            ['ru', 'Неверный адрес электронной почты'],
            ['pl', 'Nieprawidłowy Email'],
            ['es', 'Email incorrecto'],
            ['de', 'Falsche Email'],
            ['cs', 'nesprávný email'],
            ['fr', 'Adresse Email incorrecte'],
            ['it', 'Email errata']
        ],
        [
            ['en', 'Incorrect Phone Number'],
            ['ru', 'Неверный номер телефона'],
            ['pl', 'Nieprawidłowy numer telefonu'],
            ['es', 'Número de teléfono incorrecto'],
            ['de', 'Falsche Telefonnummer'],
            ['cs', 'Nesprávné telefonní číslo'],
            ['fr', 'Numéro de téléphone incorrect'],
            ['it', 'Numero di telefono errato']
        ],
        [
            ['en', 'Thank you for your registration!'],
            ['ru', 'Спасибо за регистрацию!'],
            ['pl', 'Dziękujemy za rejestrację!'],
            ['es', '¡Gracias por su registro!'],
            ['de', 'Danke für deine Registrierung!'],
            ['cs', 'Děkujeme za vaši registraci!'],
            ['fr', "Merci pour votre inscription!"],
            ['it', 'Grazie per la tua registrazione!']
        ],
        [
            ['en', 'Our manager will contact you soon'],
            ['ru', 'Наш менеджер свяжется с вами в ближайшее время.'],
            ['pl', 'Nasz menedżer wkrótce się z Tobą skontaktuje.'],
            ['es', 'Nuestro gerente se pondrá en contacto con usted pronto.'],
            ['de', 'Unser Manager wird sich in Kürze mit Ihnen in Verbindung setzen.'],
            ['cs', 'Náš manažer vás bude brzy kontaktovat.'],
            ['fr', 'Notre responsable vous contactera prochainement.'],
            ['it', 'Il nostro responsabile ti contatterà presto.']
        ]
    ];
    var ErrorsTextByType = ErrorsText[typeError];
    var MinErrorText = ErrorsTextByType[0][1];
    for (var a = 0; a < ErrorsTextByType.length; a++) {

        var MinErrorItem = ErrorsTextByType[a];
        if (MinErrorItem[0] === langError) {
            MinErrorText = MinErrorItem[1];
            break
        }
    }

    return MinErrorText
}

var aTempl = true;

// A function for change text in error page
function checkEror() {
    var urlParams;
    (window.onpopstate = function() {
        var match,
            pl = /\+/g, // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function(s) {
                return decodeURIComponent(s.replace(pl, " "));
            },
            query = window.location.search.substring(1);

        urlParams = {};
        while (match = search.exec(query))
            urlParams[decode(match[1])] = decode(match[2]);
    })();

    var funnelLang = urlParams.lang
    var errorPopUpTitle = document.querySelector("#errorText h1");
    var errorPopUpText = document.querySelector("#errorText span");
    errorPopUpTitle.textContent = CreateValidNot(4, funnelLang);
    errorPopUpText.textContent = CreateValidNot(5, funnelLang);
}

/**
 * @param {{
 *  formSelector: string
 * }} options
 */
function useAuthForm(options) {
    var formSelectorNode = document.querySelector(options.formSelector)
    var phoneInput = formSelectorNode.querySelector("[name='phone']");
    var IpValue;
    phoneInput.removeAttribute('placeholder', "");

    var phoneValidationInput = window.intlTelInput(
        phoneInput, {
            initialCountry: "auto",
            autoHideDialCode: false,
            geoIpLookup: function(success) {
                window.fetch("https://ipinfo.io/?token=3008c9515795ca").then(function(resp) {
                    if (resp.ok) {
                        return resp.json();
                    } else {
                        throw resp
                    }
                }).then(function(resp) {
                    var countryCode = resp && resp.country ? resp.country : "gb";
                    success(countryCode);

                    //ip input
                    IpValue = resp.ip
                }).catch(function(resp) {
                    var countryCode = resp && resp.country ? resp.country : "gb";
                    success(countryCode);
                })
            }
        }
    );

    // Funnel language
    var funnelLang = document.documentElement.lang;
    funnelLang = funnelLang.substr(0, 2).toLowerCase();

    // added a loader at the end of the form
    formSelectorNode.insertAdjacentHTML('beforeend', modalViewLoad);

    // Form error symbols
    function createWarningIcon(parentWarningIcon) {
        var warningIconDiv = document.createElement('div');
        warningIconDiv.classList.add("warning-icon");
        parentWarningIcon.after(warningIconDiv);
    };

    // Form error notification
    function createErrorNot(text, parent) {
        var nextSibling = parent.nextElementSibling && parent.nextElementSibling.id === 'errorNot';
        var nextSiblingCheck = parent.nextElementSibling;
        if (!nextSibling) {
            var errorNot = document.createElement('span');
            errorNot.id = 'errorNot';
            errorNot.textContent = text;
            parent.after(errorNot);
        } else if (nextSiblingCheck !== text) {
            nextSiblingCheck.textContent = text;
        }
    }

    // Inputs validation
    function trimSpaces() {
        this.value = this.value.trim();
    }

    function changTextHandler(e) {
        if(/[\d&\/\\`=#,+()$~%.'":*?<>{}]/.test(this.value)) {
            this.value = this.value.replace(/[\d&\/\\`=#,+()$~%.'":*?<>{}]/g, '');
            e.target.classList.remove('valid');
            e.target.classList.add('error');
            const errorMessage = e.target.dataset.errorMessage || CreateValidNot(0, funnelLang);
            createErrorNot(errorMessage, e.target);
        } else if (e.target.value.length < 2) {
            e.target.classList.remove('valid');
            e.target.classList.add('error');
            const errorMessage = e.target.dataset.errorMessage || CreateValidNot(1, funnelLang)
            createErrorNot(errorMessage, e.target);
        } else {
            e.target.classList.remove('error');
            e.target.classList.add('valid');
        }
    }

    function validateEmail(email) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(email).toLowerCase().trim());
    }

    function changEmailHandler(e) {
        if (validateEmail(e.target.value) === false) {
            e.target.classList.remove('valid')
            e.target.classList.add('error')
            const errorMessage = e.target.dataset.errorMessage || CreateValidNot(2, funnelLang)
            createErrorNot(errorMessage, e.target);
        } else {
            e.target.classList.remove('error')
            e.target.classList.add('valid')
        }
    }

    function changPhoneHandler(e) {
        this.value = this.value.replace(/[^\d  \+]/g, '');
        if (!phoneValidationInput.isValidNumber()) {
            this.classList.remove('valid')
            this.classList.add('error')
            const errorMessage = e.target.dataset.errorMessage || CreateValidNot(3, funnelLang)
            createErrorNot(errorMessage, this);
        } else {
            this.classList.remove('error')
            this.classList.add('valid')
        }
    }
    var reqInputs = ['first_name', 'last_name', 'email', 'phone'];
    for (var i = 0; i < reqInputs.length; i++) {
        var reqInput = formSelectorNode.querySelector(`[name=${reqInputs[i]}]`);
        reqInput.addEventListener('change', trimSpaces);
        createWarningIcon(reqInput);
    }

    var textInputs = ['first_name', 'last_name'];
    var inputEmail = formSelectorNode.querySelector('[name=email]')
    var inputPhone = formSelectorNode.querySelector('[name=phone]')

    for (var i = 0; i < textInputs.length; i++) {
        var textInput = formSelectorNode.querySelector(`[name=${textInputs[i]}]`);
        textInput.addEventListener('change', changTextHandler);
        textInput.addEventListener('keyup', changTextHandler);
    }

    inputEmail.addEventListener('keyup', changEmailHandler)
    inputPhone.addEventListener('keyup', changPhoneHandler)

    formSelectorNode.addEventListener('submit', function(e) {
        e.preventDefault();

        var validInputs = formSelectorNode.querySelectorAll("input.valid").length

        if (validInputs !== 4) {
            var event = new Event('keyup');

            inputPhone.dispatchEvent(event)
            inputEmail.dispatchEvent(event)
            for (var i = 0; i < textInputs.length; i++) {
                var textInput = formSelectorNode.querySelector(`[name=${textInputs[i]}]`)
                textInput.dispatchEvent(event);
                textInput.dispatchEvent(event);
            }
            var errorInput = formSelectorNode.querySelector("input.error");
            errorInput.focus()
            return

        }

        var formData = {
            phone: phoneValidationInput.getNumber(),
            country_id: phoneValidationInput.getSelectedCountryData().iso2,
            language: funnelLang,
            utm_source: 'Quantum System DE',
            ip: IpValue
        };

        e.target.querySelectorAll('input').forEach(function(input) {
            var name = input.getAttribute('name');
            if (formData[name]) return;
            formData[name] = input.value;
        })

        formSelectorNode.classList.add('submit-possessed-start')

        window.fetch('LINK', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(function(response) {
            if (response.ok) {
                return response.json();
            } else {
                throw response
            }
        }).then(function(data) {
            formSelectorNode.classList.remove("submit-possessed-start");
            location.replace(data.data.autologin_url);
        }).catch(function(err) {
            formSelectorNode.classList.remove("submit-possessed-start");
            location.replace('error.html?lang=' + funnelLang);
        })
    })
}

document.addEventListener("DOMContentLoaded", function() {
    // indicate form
    if (aTempl) {
        useAuthForm({formSelector: '#reg-form'});
    }
});
