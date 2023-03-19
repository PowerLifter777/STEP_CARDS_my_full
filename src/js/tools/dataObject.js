// Главный обЪект карточек
export const mainObject = {
    data: [],

    getCardById(id) {
        const [card] = this.data.filter(card => card.id === id);
        return card;
    },

    delCardById(id) {
        this.data = this.data.filter(card => card.id !== id);
    },

    sortNow() {
        // this.data.sort((a, b) => b.id - a.id).sort((a, b) => b.status < a.status ? -1 : b.status > a.status ? 1 : 0);
        this.data.sort((a, b) => b.id - a.id)
            .sort((a, b) => a.date > b.date ? -1 : a.date < b.date ? 1 : 0)
            .sort((a, b) => b.status < a.status ? -1 : b.status > a.status ? 1 : 0);
    }
}