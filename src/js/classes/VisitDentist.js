import { VISIT } from "./Visit.js";
export class VisitDentist extends VISIT {
    constructor({ purpose, description, urgency, patient, lastVisit }) {
        super({ purpose, description, urgency, patient })
        this.lastVisit = lastVisit;
    }

    visit() {
        const data = {
            doctor: 'dentist',
            lastVisit: this.lastVisit,
        }
        return this.sendVisitDataToServer(data);
    }
}
