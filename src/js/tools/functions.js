import { MODAL } from "../classes/Modal.js";
import { Card } from "../classes/Card.js";
import { VisitCardiologist } from "../classes/VisitCardiologist.js";
import { VisitDentist } from "../classes/VisitDentist.js";
import { VisitTherapist } from "../classes/VisitTherapist.js";
import { mainObject } from "./dataObject.js";
import { GetToken, GetAllCards } from "./fetchData.js";
import { filterCards } from "../components/header/index.js";

/* проверка поддержки Webp, добавление классов */
export const isWebp = () => {
    // проверка поддержки Webp
    const testWebP = (callback) => {
        const webP = new Image();
        webP.onload = webP.onerror = () => {
            callback(webP.height == 2);
        };
        webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    }
    // добавление класса для HTML
    testWebP((support) => {
        const className = support === true ? 'webp' : 'no-webp';
        document.documentElement.classList.add(className);
    });
}

// Нахожу кнопки логина и создания поста и враппер для модалок.
const [loginBtn, visitBtn] = document.querySelectorAll('.btn');
const modalWrapper = document.querySelector('.modal');
loginBtn.addEventListener('click', () => createLoginForm(modalWrapper, loginBtn, visitBtn));
visitBtn.addEventListener('click', () => createVisitForm(modalWrapper));

// Создание формы авторизации
function createLoginForm(modalWrapper) {
    const modal = new MODAL(modalWrapper);
    modal.showLoginForm();
    const btn = modalWrapper.querySelector('button[type="submit"]');
    btn.addEventListener('click', (e) => submitLogin(e, modalWrapper))
}

// Получение с сервера токена авторизации. Запись токена в sessionStorage. Открытие сессии пользователя.
async function submitLogin(e, form) {
    e.preventDefault();
    const email = form.querySelector('input[name="username"]').value;
    const password = form.querySelector('input[name="password"]').value;

    const token = await GetToken(email, password);
    if (!!token) {
        form.innerHTML = '';
        form.classList.add('modal--hide');
        sessionStorage.token = JSON.stringify(token);
        loadUserCardsFromServer();
        openUserSession();
    }
}

// При открытии сессии кнопка логина меняется на кнопку создания визита.
function openUserSession() {
    visitBtn.classList.remove('btn--hide');
    loginBtn.remove();
}

// Проверка текущей сесии при перезагрузке страници. Чтоб не появлялась кнопка логина.
(function checkLoginSession() {
    sessionStorage.getItem('token') && openUserSession(loginBtn, visitBtn);
})()

// Создание формы для визита. По клику на кнопку данные формы передаются в функцию, которая создает соответствующий класс визита. 
function createVisitForm(modalWrapper) {
    const modal = new MODAL(modalWrapper);
    modal.showDefaultVisit();
    const doctorInput = modalWrapper.querySelector('#select-doctor');

    doctorInput.addEventListener('input', () => {
        modal.showSpecificFields(doctorInput.value);
        const btn = modalWrapper.querySelector('button[type="submit"]');
        btn.addEventListener('click', (e) => postVisitData(doctorInput.value, modal.createVisitParams(e)));
    });
}

// Создание соответствующего визита. И отправка данных на сервер. Если отправка успешна, то создается карточка. 
async function postVisitData(doctor, props) {
    let newDoctor;
    if (doctor === "cardiologist") newDoctor = new VisitCardiologist(props);
    if (doctor === "dentist") newDoctor = new VisitDentist(props);
    if (doctor === "therapist") newDoctor = new VisitTherapist(props);

    const visitDataResponse = await newDoctor.visit();
    if (visitDataResponse.status === 200) {
        const visitData = await visitDataResponse.json();
        createCard(visitData);
    } else {
        alert('Не удалось создать карточку. Сервер не доступен');
    }
}

// Создание и отрисовка карточки. Добавление карточки в главный объект карточек. Проверка наличия контента на странице, чтоб убрать надпись "Нет карточек"
function createCard(props) {
    const card = new Card(props);
    card.render();
    mainObject.data.push(props);
    checkContent();
}

// Если пользователь авторизован и есть токен, то происходит загрузка карточек, иначе отображается надпись "Нет карточек"
!!sessionStorage.getItem('token') ? loadUserCardsFromServer() : checkContent();

// Загрузка всех карточек с сервера при перезагрузке страницы
export async function loadUserCardsFromServer() {
    const data = await GetAllCards();
    mainObject.data = [...data];
    mainObject.data.sort((a, b) => a.id - b.id).sort((a, b) => a.status < b.status ? -1 : a.status < b.status ? 1 : 0);
    renderCards(mainObject.data);
    checkContent();
}

// Отрисовка загруженных карточек при перезагрузке страницы
export function renderCards(cards) {
    console.log(cards);
    cards.forEach(cardData => {
        const item = new Card(cardData);
        item.render();
    })
}

// Проверка массива карточек на пустотудля отображения надписа "Нет карточек"
export function checkContent() {
    console.log('mainObject', mainObject.data);
    const noContent = document.body.querySelector('.no-content');
    setTimeout(() => {
        if (!!mainObject.data.length && !!sessionStorage.getItem('token')) {
            noContent.classList.add('no-content--hide');
        } else {
            noContent.classList.remove('no-content--hide');
        }
    })
}

// Создание формы редактирования. Создание объекта новых данных карточки.
export function createEditModal(cardData) {
    const modalWrapper = document.querySelector('.modal');
    const modal = new MODAL(modalWrapper);
    const cardInfo = cardData;
    modal.showEditModal(cardInfo);
    const btn = modalWrapper.querySelector('button[type="submit"]');

    btn.addEventListener('click', (e) => {
        const cardChanges = modal.createVisitParams(e);
        const newCardInfo = { ...cardInfo, ...cardChanges };
        cardData.saveChangesOnServer(newCardInfo);
    });
}