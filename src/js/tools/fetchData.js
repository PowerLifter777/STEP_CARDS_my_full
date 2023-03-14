import axios from "axios";

export const GetToken = async (email, password) => {
    // const email = 'cardstest@gmail.com';
    // const password = 'cardstest';
    const tokenRequest = await fetch("https://ajax.test-danit.com/api/v2/cards/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (tokenRequest.status === 200 & tokenRequest.ok) {
        return tokenRequest.text();
    } else {
        alert('Incorrect login or password');
        return
    }
}

export const GetAllCards = async () => {
    const response = await fetch("https://ajax.test-danit.com/api/v2/cards", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(sessionStorage.token)}`
        }
    });
    if (response.status === 200) {
        return response.json();
    } else {
        alert('Не удалось загрузить карточки. Сервер не доступен');
        return
    }
}

export const CreateNewCard = async (jsonStringifyData) => {
    const response = await fetch("https://ajax.test-danit.com/api/v2/cards", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(sessionStorage.token)}`
        },
        body: jsonStringifyData,
    });
    // const result = response;
    return response;
}

export const DeleteCardByID = async (id) => {
    const dellRequest = await fetch(`https://ajax.test-danit.com/api/v2/cards/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${JSON.parse(sessionStorage.token)}` },
    })
    return dellRequest;
}

export const EditCardByID = async (id, changes) => {
    const response = await fetch(`https://ajax.test-danit.com/api/v2/cards/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(sessionStorage.token)}`
        },
        body: JSON.stringify(changes)
    });
    if (response.status === 200) {
        return true;
    } else {
        alert('Не удалось изменить карточку. Сервер не доступен');
        return false;
    }
}