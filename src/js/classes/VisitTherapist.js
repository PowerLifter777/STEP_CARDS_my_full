import { VISIT } from "./Visit.js";
export class VisitTherapist extends VISIT {
    constructor({ purpose, description, urgency, patient, age }) {
        super({ purpose, description, urgency, patient })
        this.age = age;
    }

    visit() {
        const data = {
            doctor: 'therapist',
            age: this.age,
        }
        return this.sendVisitDataToServer(data);
    }
}