import { mainObject, createEditModal, renderCards, checkContent, DeleteCardByID, EditCardByID } from "../tools/index.js";
import { filterCards } from "../components/header/index.js";
export class Card {
    constructor({ id, doctor, purpose, description, urgency, patient, pressure, BMI, diseases, age, lastVisit, status }) {
        this.id = id;
        this.doctor = doctor;
        this.purpose = purpose;
        this.description = description;
        this.urgency = urgency;
        this.patient = patient;
        this.status = status || '';
        this.pressure = pressure || null;
        this.BMI = BMI || null;
        this.diseases = diseases || null;
        this.age = age || null;
        this.lastVisit = lastVisit || null;
    }
    // Отрисовка карточки на странице со всеми доступными полями
    render() {
        const cardWrapper = document.querySelector('.cards__content');
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('id', this.id);
        cardWrapper.prepend(card);
        card.insertAdjacentHTML('afterbegin', `
            <div class="card__container">
                <span class="card-change">✎</span>
                <span class="card-del">✖</span>
                <div class="card__element card-title">
                    <div class="card-title__doctor">
                        <div class="card-title__doctor-head">DOCTOR:</div>
                        <div class="card-title__doctor-text">
                            <div class="card-title__doctor-text-icon">
                                <picture>
                                    <source srcset="./dist/assets/images/сard/therapist.webp" type="image/webp">
                                    <img class="doctor-icon" src="./dist/assets/images/сard/therapist.png" alt="img">
                                </picture>
                            </div>
                            <p class="card-title__doctor-text-value">${this.doctor}</p>
                        </div>
                    </div>
                    <div class="card-title__status">
                        <div class="card-title__status-head">VISIT STATUS:</div>
                        <button class="card-title__status-text">${this.status.toUpperCase()}</button>
                    </div>
                </div>
                <div class="card__element card-main">
                    <div class="card-main__patient">
                        <div class="card-main__patient-head">
                            <p class="card-main__patient-head-title">PACIENT:</p>
                            ${!!this.age ? `<p class="card-main__patient-head-age">AGE:<span class="card-main__patient-head-age-val">${this.age}</span></p>` : ''}
                        </div>
                        <div class="card-main__patient-text">${this.patient}</div>
                    </div>
                    <div class="card-main__urgency">
                        <div class="card-main__urgency-head">URGENCY</div>
                        <div class="card-main__urgency-body" data-urgency="${this.urgency}">
                            <div class="urgency-body__elem urgency-body__elem--${this.urgency}"></div>
                            <div class="urgency-body__elem urgency-body__elem--${this.urgency}"></div>
                            <div class="urgency-body__elem urgency-body__elem--${this.urgency}"></div>
                        </div>
                    </div>
                </div>
                <div class="card-additional card-additional--hide">
                    <div class="card-additional__purpose">
                        <div class="card-additional__purpose-title">PURPOSE OF THE TARGET:</div>
                        <div class="card-additional__purpose-text">${this.purpose}</div>
                    </div>
                    <div class="card-additional__description">
                        <div class="card-additional__description-title">DESCRIPTION:</div>
                        <div class="card-additional__description-text">${this.description}</div>
                    </div>
                    ${!!this.lastVisit ? `
                    <div class="card-additional__date">
                        <div class="card-additional__date-title">DATE OF LAST VISIT:</div>
                        <div class="card-additional__date-text">${this.lastVisit}</div>
                    </div>`: ''}
                    ${!!this.BMI ? `
                    <div class="card-additional__imt">
                        <div class="card-additional__imt-title">BMI:</div>
                        <div class="card-additional__imt-text">${this.BMI} BMI</div>
                    </div>`: ''}
                    ${!!this.pressure ? `
                    <div class="card-additional__pressure">
                        <div class="card-additional__pressure-title">PRESSURE:</div>
                        <div class="card-additional__pressure-text">${this.pressure} mmHg</div>
                    </div>`: ''}
                    ${!!this.diseases ? `
                    <div class="card-additional__diseases">
                        <div class="card-additional__diseases-title">DISEASES OF THE CARDIOVASCULAR:</div>
                        <div class="card-additional__diseases-text">${this.diseases}</div>
                    </div>` : ''}
                </div>
                <div class="card-show-more">
                    <button class="card-show-more__btn">SHOW MORE DETAILS</button>
                    <picture>
                        <source srcset="./dist/assets/images/icon-down.webp" type="image/webp">
                        <img class="card-show-more__icon" src="./dist/assets/images/icon-down.png" alt="icon">
                    </picture>
                </div>
                <div class="card-hide-more card-hide-more--hide">
                    <button class="card-hide-more__btn">HIDE MORE DETAILS</button>
                    <picture>
                        <source srcset="./dist/assets/images/icon-up.webp" type="image/webp">
                        <img class="card-hide-more__icon" src="./dist/assets/images/icon-up.png" alt="icon">
                    </picture>
                 </div>
            </div>`)
        const delBtn = card.querySelector('.card-del');
        const moreBtn = card.querySelector('.card-show-more__btn');
        const hideBtn = card.querySelector('.card-hide-more__btn');
        const additionalInfo = card.querySelector('.card-additional');
        const editBtn = card.querySelector('.card-change');
        const statusBtn = card.querySelector('.card-title__status-text');
        delBtn.addEventListener('click', () => this.delete(card));
        moreBtn.addEventListener('click', () => this.showDetails(moreBtn, hideBtn, additionalInfo));
        hideBtn.addEventListener('click', () => this.hideDetails(moreBtn, hideBtn, additionalInfo));
        editBtn.addEventListener('click', () => this.openCardEditor());
        statusBtn.addEventListener('click', () => this.changeStatus(statusBtn));
        this.checkStatus(statusBtn);
    }

    // Удаление карточки с сервера
    async delete(card) {
        const dellRequest = await DeleteCardByID(card.id);
        if (dellRequest.status === 200) card.remove();
        mainObject.delCardById(this.id);
        checkContent();
    }

    // Скрыть/показать детали карточки
    showDetails(moreBtn, hideBtn, additionalInfo) {
        moreBtn.parentNode.classList.add('card-show-more--hide');
        hideBtn.parentNode.classList.remove('card-hide-more--hide');
        additionalInfo.classList.remove('card-additional--hide');
    }

    hideDetails(moreBtn, hideBtn, additionalInfo) {
        moreBtn.parentNode.classList.remove('card-show-more--hide');
        hideBtn.parentNode.classList.add('card-hide-more--hide');
        additionalInfo.classList.add('card-additional--hide');
    }

    // Передача id карточки в функцию для создания формы редактирования
    openCardEditor() {
        createEditModal(this);
    }

    // Изменение статуса визита при клике. Отправка изменений на сервер.
    async changeStatus(btn) {
        const requestForChange = (status) => this.saveChangesOnServer({ ...this, status: status });

        if (btn.textContent === 'OPEN' && await requestForChange('done')) {
            btn.innerHTML = 'DONE';
            btn.closest('.card').classList.add('card-visit-done');
        } else if (btn.textContent === 'DONE' && await requestForChange('open')) {
            btn.innerHTML = 'OPEN';
            this.status = 'open';
        }
    }

    // Проверка статуса для наложения опасити
    checkStatus(statusBtn) {
        if (statusBtn.textContent === 'DONE') {
            statusBtn.closest('.card').classList.add('card-visit-done');
        }
    }

    // Передача на сервер измененной карточки. При успешном запросе перезапись данных в объекте карточек и перерисовка. 
    async saveChangesOnServer(newCardInfo) {
        const response = await EditCardByID(newCardInfo.id, newCardInfo);
        if (response) {
            mainObject.data = mainObject.data.map(obj => obj.id === newCardInfo.id ? newCardInfo : obj);
            mainObject.data.sort((a, b) => a.id - b.id).sort((a, b) => a.status < b.status ? -1 : a.status < b.status ? 1 : 0);
            const cardWrapper = document.querySelector('.cards__content');
            cardWrapper.innerHTML = '';
            renderCards(mainObject.data);
            filterCards();
        }
        return response;
    }
}













