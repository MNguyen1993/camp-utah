const $formInputs = document.querySelectorAll('.form-input input');

$formInputs.forEach((element) => {
    element.addEventListener('focus', () => {
        element.classList.add('focus')
    })
})

$formInputs.forEach((element) => {
    element.addEventListener('blur', () => {
        if (element.value == '') {
            element.classList.remove('focus')
        }
    })
})
