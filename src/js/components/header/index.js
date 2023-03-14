// Сортировка и поиск карточек ---------------------------------------------

import { renderCards } from "../../tools/index.js";
import { mainObject } from "../../tools/dataObject.js";

const searchInput = document.body.querySelector('.search-form__input');
const statusSelect = document.body.querySelector('select[name="search-status"]');
const prioritySelect = document.body.querySelector('select[name="search-priority"]');
const searchBtn = document.body.querySelector('button[name="search-button"]');
const searchAllBtn = document.body.querySelector('button[name="search-all"]');
const cardWrapper = document.body.querySelector('.cards__content');

searchBtn.addEventListener('click', () => filterCards());

const getSearchParams = () => {
    const serchParams = {
        ...(!!searchInput.value && { text: searchInput.value }),
        ...(!!statusSelect.value && { status: statusSelect.value }),
        ...(!!prioritySelect.value && { urgency: prioritySelect.value }),
    };
    return serchParams;
}

export function filterCards() {
    const searchParams = getSearchParams();
    if (!!Object.keys(searchParams).length) {
        const res = mainObject.data
            .filter(obj => !!searchParams.urgency ? obj.urgency === searchParams.urgency : obj)
            .filter(obj => !!searchParams.text ? [obj.patient, obj.description, obj.purpose].some(field => field.toLowerCase().includes(searchParams.text.toLowerCase())) : obj)
            .filter(obj => !!searchParams.status ? obj.status === searchParams.status : obj);
        cardWrapper.innerHTML = '';
        checkSearchedCards(res);
        renderCards(res);
    }
}

(function showAllCards() {
    searchAllBtn.addEventListener('click', () => {
        [searchInput, statusSelect, prioritySelect].forEach(input => input.value = '');
        cardWrapper.innerHTML = '';
        checkSearchedCards(mainObject.data);
        renderCards(mainObject.data);
    })
})()

function checkSearchedCards(searchedData) {
    const noContent = document.body.querySelector('.no-search');
    if (!searchedData.length) {
        noContent.classList.remove('no-search--hide');
    } else {
        noContent.classList.add('no-search--hide');
    }
}