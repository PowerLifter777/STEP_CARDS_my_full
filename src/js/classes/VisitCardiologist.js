import { VISIT } from "./Visit.js";
export class VisitCardiologist extends VISIT {
    constructor({ purpose, description, urgency, patient, pressure, BMI, diseases, age }) {
        super({ purpose, description, urgency, patient })
        this.pressure = pressure;
        this.BMI = BMI;
        this.diseases = diseases;
        this.age = age;
    }

    visit() {
        const data = {
            doctor: 'cardiologist',
            pressure: this.pressure,
            BMI: this.BMI,
            diseases: this.diseases,
            age: this.age, 
        }
        return this.sendVisitDataToServer(data);
    }
}