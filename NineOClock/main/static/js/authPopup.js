document.addEventListener('DOMContentLoaded', function () {
    var authPopup = document.getElementById('authPopup');
    var openAuthPopup = document.getElementById('openAuthPopup');
    var close = document.getElementById('closeAuthPopup');
    var loginForm = document.querySelector('.form-login');
    var registerForm = document.querySelector('.form-signup');
    var logoutButton = document.getElementById('logoutButton');

    loginForm.action = '/login/';
    registerForm.action = '/register/';

    if (openAuthPopup) {
        openAuthPopup.onclick = function () {
            authPopup.style.display = 'block';
        }
    }

    if (close) {
        close.onclick = function () {
            authPopup.style.display = 'none';
        }
    }

    window.onclick = function (event) {
        if (event.target == authPopup) {
            authPopup.style.display = 'none';
        }
    }

    function handleRegFormSubmit(event, form, redirectUrl) {
        event.preventDefault();
        var formData = new FormData(form);
        const form_data = new URLSearchParams();
        for (const [key, value] of formData.entries()) {
            form_data.append(key, value);
        };
        console.log(form.action)
        fetch(form.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                // 'X-CSRFToken': getCookie('csrftoken'),
            },
            body: form_data,
        }).then(async response => {
            try {
                var variable = await response.json();
                return (variable);
            } catch (e) {
                throw new Error('La respuesta del servidor no es un JSON válido ' + e);
            }
        }).then(data => {
            if (data.success) {
                window.location.href = redirectUrl; // Redirección después de éxito
            } else {
                alert(data.message);
            }
        }).catch(error => {
            console.error('Error:', error);
            alert(error.message || 'Ocurrió un error. Por favor, inténtelo de nuevo.');
        });
    }

    function handleLogFormSubmit(event, form, RedirectUrl) {
        event.preventDefault();
        var formData = new FormData(form);
        const form_data = new URLSearchParams();
        for (const [key, value] of formData.entries()) {
            form_data.append(key, value);
        };
        console.log(form.action)
        fetch(form.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                // 'X-CSRFToken': getCookie('csrftoken'),
            },
            body: form_data,
        }).then(async response => {
            try {
                var variable = await response.json();
                return (variable);
            } catch (e) {
                throw new Error('La respuesta del servidor no es un JSON válido ' + e);
            }
        }).then(data => {
            if (data.success) {
                window.location.reload(RedirectUrl); // Redirección después de éxito
            } else {
                alert(data.message);
            }
        }).catch(error => {
            console.error('Error:', error);
            alert(error.message || 'Ocurrió un error. Por favor, inténtelo de nuevo.');
        });
    }

    if (loginForm) {
        loginForm.onsubmit = function (event) {
            handleLogFormSubmit(event, loginForm, '/');
        }
    }

    if (registerForm) {
        registerForm.onsubmit = function (event) {
            handleRegFormSubmit(event, registerForm, '/');
        }
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            fetch('/logout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    // 'X-CSRFToken': '{{ csrf_token }}'
                },
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.reload();
                } else {
                    alert(data.error);
                }
            })
        });
    }

    const switchers = [...document.querySelectorAll('.switcher')]

    switchers.forEach(item => {
        item.addEventListener('click', function() {
            switchers.forEach(item => item.parentElement.classList.remove('is-active'))
            this.parentElement.classList.add('is-active')
        })
    });
});
