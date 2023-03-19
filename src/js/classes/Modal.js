export class MODAL {
    constructor(wrapper = document.body) {
        this.wrapper = wrapper;
        this.date = new Date().toLocaleString('ua').slice(0, -3);
    }

    // Отрисовка формы авторизации
    showLoginForm() {
        this.wrapper.classList.remove('modal--hide');
        this.wrapper.innerHTML = '';
        const modalWrapper = document.createElement('div');
        modalWrapper.classList.add('modal__content-wrapper', 'modal__content-wrapper--login');
        this.wrapper.append(modalWrapper);

        modalWrapper.innerHTML = `
            <span class="modal-close">✖</span>
            <div class="modal__content">
                <h3 class="modal__content-title">Welcome Back</h3>
                <div class="modal__content-img">
                    <picture>
                        <source srcset="./dist/assets/images/log-icon.webp" type="image/webp">
                            <img class="modal__content-icon" src="./dist/assets/images/log-icon.png" alt="login">
                    </picture>
                </div>
                <form class="form-login">
                    <input class="form-login__input" type="text" name="username" placeholder="email">
                    <input class="form-login__input" type="password" id="password" name="password" placeholder="password">
                    <button class="btn btn--small disabled" type="submit" disabled>login</button>
                </form>
            </div>
        `
        this.closeModal('login');
        this.submitButtonActivation();
    }

    // Активация сабмит кнопок при заполнении всех полей
    submitButtonActivation() {
        const inputs = this.wrapper.querySelectorAll('input');
        const submitBtn = this.wrapper.querySelector('button');
        inputs.forEach(input => input.addEventListener('input', () => {
            if (!![...inputs].every(a => !!a.value)) {
                submitBtn.classList.remove('disabled');
                submitBtn.removeAttribute('disabled');
            } else {
                submitBtn.classList.add('disabled');
            }
        }))
    }

    // Закрытие модалок. Форма логина закрывается по крестику. Форма визита по крестику и вне области.
    closeModal(modalType) {
        const closeBtn = this.wrapper.querySelector('.modal-close');
        const submitBtn = this.wrapper.querySelector('button[type="submit"]');
        const modalContentWrapper = this.wrapper.querySelector('.modal__content-wrapper');

        const hideModal = () => {
            modalContentWrapper.remove();
            this.wrapper.classList.add('modal--hide');
        }

        if (modalType === 'login') closeBtn.addEventListener('click', hideModal);

        if (modalType === 'visit') {
            this.wrapper.addEventListener('click', function handleClick(e) {
                if (!e.target.closest('.modal__content-wrapper') || e.target === closeBtn || e.target === submitBtn) hideModal();
            });
        }
    }

    // Часть формы визита, которая отображается до выбора доктора.
    showDefaultVisit() {
        this.wrapper.classList.remove('modal--hide');
        this.wrapper.innerHTML = '';
        const modalWrapper = document.createElement('div');
        modalWrapper.classList.add('modal__content-wrapper', 'modal__content-wrapper--visit');
        this.wrapper.append(modalWrapper);

        modalWrapper.innerHTML = `
            <span span class="modal-close">×</span>
            <div class="modal__content modal__content--visit">
                <h3 class="modal__content-title modal__content-title--visit">VISIT FORM</h3>
                <div class="modal__content-img">
                    <img class="modal__content-icon modal__content-icon--visit" src="./dist/assets/images/patient.png" alt="LOGO">              
                </div>
                <form class="form-visit">
                    <label class="form-visit__label">Doctor
                        <select class="form-visit__select" id="select-doctor" name="specialist">
                            <option value="" disabled selected>Select specialist</option>
                            <option value="cardiologist">Cardiologist</option>
                            <option value="dentist">Dentist</option>
                            <option value="therapist">Therapist</option>
                        </select>
                    </label>
                    <label class="form-visit__label" id="form-patient-name">Patient name
                        <input class="form-visit__input" type="text" id="patient-name" name="patient-name" placeholder="Enter full patient name" required>
                    </label>
                    <label class="form-visit__label" id="form-purpose">Purpose of the visit
                        <input class="form-visit__input" type="text" id="purpose" name="purpose" placeholder="Enter purpose of the visit" required>
                    </label>
                    <label class="form-visit__label" id="form-description">Description of the visit
                        <input class="form-visit__input" type="text" id="description" name="description" placeholder="Enter description of the visit" required>
                    </label>
                    <label class="form-visit__label" id="form-urgency">Urgency of the visit
                        <div class="label-container-radio">
                            <label class="form-visit__label--radio"> Normal
                                <input type="radio" name="urgency" id="urgency-normal" value="normal" checked>
                            </label>
                            <label class="form-visit__label--radio"> Priority
                                <input type="radio" name="urgency" id="urgency-priority" value="priority">
                            </label>
                            <label class="form-visit__label--radio"> Urgent
                                <input type="radio" name="urgency" id="urgency-urgent" value="urgent">
                            </label>
                        </div>
                    </label>
                    <div class="form-visit__specialist"></div>
                </form>
            </div>`
        this.closeModal('visit');
        this.checkboxActivation();
    }

    // Скрипт переключения чекбоксов приоритета.
    checkboxActivation() {
        const urgency = this.wrapper.querySelectorAll('[name="urgency"]');
        const urgencyForm = this.wrapper.querySelector('#form-urgency');
        urgencyForm.addEventListener('click', (e) => {
            urgency.forEach(el => {
                if (el === e.target) {
                    el.setAttribute('checked', true);
                } else {
                    el.removeAttribute('checked');
                }
            })
        })
    }

    // Часть формы визита которая появляется после выбора доктора.
    showSpecificFields(doctor) {
        const modalForm = this.wrapper.querySelector('.form-visit__specialist');
        if (doctor === 'cardiologist') {
            modalForm.innerHTML = `
               <label class="form-visit__label" id="form-pressure">Normal pressure
                    <div class="form-pressure__container">
                        <input class="form-visit__input form-visit__input--shot" type="number" id="pressure-top" name="pressure" placeholder="top" required>
                        <span>⁄</span>
                        <input class="form-visit__input form-visit__input--shot" type="number" id="pressure-bottom" name="pressure" placeholder="bottom" required>
                    </div>
                </label>
                <label class="form-visit__label" id="form-body-mass">Body mass index
                    <div class="form-body-mass__container">
                    <output class="form-visit__label-output">25</output>
                    <input oninput="this.previousElementSibling.value = this.value" class="form-visit__input" type="range" min="0" max="50" step="1" value="25" id="mass-index" name="mass-index" placeholder="Enter patient body mass index">
                    </div>
                </label>
                <label class="form-visit__label" id="form-past-diseases">Past diseases of the cardiovascular system
                    <textarea class="form-visit__text-area" placeholder="Enter pacient past diseases of the cardiovascular system" required></textarea>
                </label>
                <label class="form-visit__label" id="form-age">Patient age
                    <input class="form-visit__input form-visit__input--shot" type="number" id="age" name="age" placeholder="Age" required>
                </label>
                <button class="btn btn--big btn--bg-prime submit disabled">Create visit</button>`
        } else if (doctor === 'dentist') {
            modalForm.innerHTML = `
                <label class="form-visit__label" id="form-date">Date of last visit
                    <input class="form-visit__input" type="date" id="visit" name="visit" placeholder="Enter date of last visit" required>
                </label>
                <button class="btn btn--big btn--bg-prime submit disabled">Create visit</button>`
        } else if (doctor === 'therapist') {
            modalForm.innerHTML = `
                <label class="form-visit__label" id="form-age">Patient age
                    <input class="form-visit__input form-visit__input--shot" type="number" id="age" name="age" placeholder="Age" required>
                </label>
                <button class="btn btn--big btn--bg-prime submit disabled">Create visit</button>`
        }
        this.closeModal('visit');
        this.submitButtonActivation();
    }

    // Запись в объект информации из заполненной формы 
    createVisitParams(e) {
        e.preventDefault();
        const purpose = this.wrapper.querySelector('#purpose');
        const description = this.wrapper.querySelector('#description');
        const patient = this.wrapper.querySelector('#patient-name');
        const urgency = this.wrapper.querySelector('input[name="urgency"][checked="true"]') || 'normal';
        const pressureTop = this.wrapper.querySelector('#pressure-top') || '';
        const pressureBottom = this.wrapper.querySelector('#pressure-bottom') || '';
        const BMI = this.wrapper.querySelector('#mass-index') || '';
        const diseases = this.wrapper.querySelector('.form-visit__text-area') || '';
        const age = this.wrapper.querySelector('#age') || '';
        const lastVisit = this.wrapper.querySelector('#visit') || '';
        const date = this.date;

        return {
            patient: patient.value,
            purpose: purpose.value,
            description: description.value,
            urgency: urgency.value || 'normal',
            date: this.date,
            ...(!!lastVisit.value && { lastVisit: lastVisit.value }),
            ...(!!pressureTop.value && !!pressureBottom.value && { pressure: `${pressureTop.value}/${pressureBottom.value}` }),
            ...(!!BMI.value && { BMI: BMI.value }),
            ...(!!diseases.value && { diseases: diseases.value }),
            ...(!!age.value && { age: age.value }),
        }
    }

    // Добавление текущей информации из карточки в форму для редактирования
    addCurrentCardInfo({ purpose, description, patient, urgency, pressure, BMI, diseases, age, lastVisit }) {
        this.wrapper.querySelector('#select-doctor').parentNode.remove();
        if (!!purpose) this.wrapper.querySelector('#purpose').value = purpose;
        if (!!description) this.wrapper.querySelector('#description').value = description;
        if (!!patient) this.wrapper.querySelector('#patient-name').value = patient;
        if (!!urgency) this.wrapper.querySelector(`input[name="urgency"][value="${urgency}"]`).setAttribute('checked', true);
        if (!!pressure) {
            this.wrapper.querySelector('#pressure-top').value = pressure.slice(0, pressure.indexOf('/'));
            this.wrapper.querySelector('#pressure-bottom').value = pressure.slice(pressure.indexOf('/') + 1);
        }
        if (!!BMI) {
            this.wrapper.querySelector('.form-visit__label-output').value = BMI;
            this.wrapper.querySelector('#mass-index').value = BMI;
        }
        if (!!diseases) this.wrapper.querySelector('.form-visit__text-area').value = diseases;
        if (!!age) this.wrapper.querySelector('#age').value = age;
        if (!!lastVisit) this.wrapper.querySelector('#visit').value = lastVisit;
    }

    // Отрисовка формы для редактирования карточки с добавлением в нее текущей информации 
    showEditModal({ doctor, ...currentCardData }) {
        this.showDefaultVisit();
        this.showSpecificFields(doctor);
        this.addCurrentCardInfo(currentCardData);
    }
}
















