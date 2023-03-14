// Главный обЪект карточек
export const mainObject = {
    data: [],

    getCardById(id) {
        const [card] = this.data.filter(card => card.id === id);
        return card;
    },

    delCardById(id) {
        this.data = this.data.filter(card => card.id !== id);
    }
}