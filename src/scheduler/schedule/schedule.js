const Event = require('./event');

class Schedule extends Array {
    constructor() {
        super();
    }

    /**
     * @param {string} name
     * @param {Date} start
     * @param {Date} end
     * @return {Schedule}
     */
    add(title, start, end) {
        this.push(new Event(title, start, end));
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
