import { CreateNewCard } from "../tools/index.js";
export class VISIT {
    constructor({ purpose, description, urgency, patient }) {
        this.purpose = purpose;
        this.description = description;
        this.urgency = urgency;
        this.patient = patient;
        this.status = 'open';
        this.date = new Date().toLocaleString('ua').slice(0,-3);
    }

    createJSON(data) {
        return JSON.stringify({
            purpose: this.purpose,
            description: this.description,
            urgency: this.urgency,
            patient: this.patient,
            status: this.status,
            date: this.date,
            ...data,
        })
    }

    // Создание карточки на сервере
    async sendVisitDataToServer(data) {
        const jsonStringifyData = this.createJSON(data);
        return CreateNewCard(jsonStringifyData);
    }
}



