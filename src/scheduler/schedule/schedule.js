const Event = require('./event');

class Schedule extends Array {
    constructor() {
        super();
    }

    /**
     * @param {string} name
     * @param {Date} start
     * @param {Date} end
     * @param {Object} game
     * @return {Schedule}
     */
    add(title, start, end, game) {
        if (title instanceof Event) {
            this.push(title);
            return this;
        }

        this.push(new Event(title, start, end, game));
        return this;
    }

    isAvailable(newEvent) {
        let available = true;

        this.forEach((event) => {
            if (event.overlap(newEvent)) {
                available = false;
            }
        });

        return available;
    }
}
module.exports = Schedule;
