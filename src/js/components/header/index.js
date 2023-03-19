// Сортировка и поиск карточек ---------------------------------------------

import { renderCards } from "../../tools/index.js";
import { mainObject } from "../../tools/dataObject.js";

const searchInput = document.body.querySelector('.search-form__input');
const statusSelect = document.body.querySelector('select[name="search-status"]');
const prioritySelect = document.body.querySelector('select[name="search-priority"]');
const searchBtn = document.body.querySelector('button[name="search-button"]');
const searchAllBtn = document.body.querySelector('button[name="search-all"]');
const cardWrapper = document.body.querySelector('.cards__content');
const inputs = [searchInput, statusSelect, prioritySelect];

searchBtn.addEventListener('click', () => {
    !!Object.keys(getSearchParams()).length && renderFilteredCards();
});

function getSearchParams() {
    const serchParams = {
        ...(!!searchInput.value && { text: searchInput.value }),
        ...(!!statusSelect.value && { status: statusSelect.value }),
        ...(!!prioritySelect.value && { urgency: prioritySelect.value }),
    };
    sessionStorage.filter = JSON.stringify(serchParams);
    return serchParams;
}

function filterCards(params) {
    const res = mainObject.data
        .filter(obj => !!params.urgency ? obj.urgency === params.urgency : obj)
        .filter(obj => !!params.text ? [obj.patient, obj.description, obj.purpose, obj.age].some(field => {
            if (!!field) return field.toLowerCase().includes(params.text.toLowerCase());
        }) : obj)
        .filter(obj => !!params.status ? obj.status === params.status : obj);
    return res;
}

export function renderFilteredCards() {
    // const searchParams = getSearchParams();
    const searchParams = JSON.parse(sessionStorage.getItem('filter'));
    console.log(searchParams);
    if (!!searchParams) {
        const res = filterCards(searchParams);
        cardWrapper.innerHTML = '';
        checkSearchedCards(res);
        renderCards(res);
    } else {
        cardWrapper.innerHTML = '';
        renderCards(mainObject.data);
    }
}

(function showAllCards() {
    searchAllBtn.addEventListener('click', () => {
        checkSearchBtns();
        sessionStorage.removeItem('filter');
        if (inputs.some(input => !!input.value)) {
            inputs.forEach(input => input.value = '');
            cardWrapper.innerHTML = '';
            checkSearchedCards(mainObject.data);
            renderFilteredCards();
        }
    });
})()

function checkSearchedCards(searchedData) {
    const noContent = document.body.querySelector('.no-search');
    if (!searchedData.length) {
        noContent.classList.remove('no-search--hide');
    } else {
        noContent.classList.add('no-search--hide');
    }
}

function checkSearchBtns() {
    [searchBtn, searchAllBtn].forEach(btn => btn.classList.add('disabled'));
    const inputs = [searchInput, statusSelect, prioritySelect];
    inputs.forEach(input => input.addEventListener('input', () => {
        if (!!input.value) {
            [searchBtn, searchAllBtn].forEach(btn => btn.classList.remove('disabled'));
        } else {
            [searchBtn, searchAllBtn].forEach(btn => btn.classList.add('disabled'));
        }
    }))
}
checkSearchBtns();

(function setFilter() {
    const filter = JSON.parse(sessionStorage.getItem('filter'));
    console.log('filter', filter);
    if (!!filter) {
        if (!!filter.text) searchInput.value = filter.text;
        if (!!filter.urgency) prioritySelect.value = filter.urgency;
        if (!!filter.status) statusSelect.value = filter.status;
        if (!!Object.keys(filter)) {
            [searchBtn, searchAllBtn].forEach(btn => btn.classList.remove('disabled'));
        }
    } else {
        [searchBtn, searchAllBtn].forEach(btn => btn.classList.add('disabled'));
    }
})()
