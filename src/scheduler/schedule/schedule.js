const Event = require('./event');

class Schedule {
    constructor() {
        this.events = [];
    }

    /**
     * @param {string} name
     * @param {Date} start
     * @param {Date} end
     * @return {Schedule}
     */
    add(name, start, end) {
        this.events.push(new Event(name, start, end));
        return this;
    }

    isAvailable(start, end) {
        let available = true;

        this.events.forEach((event) => {
            // TODO: Check halfway time?
            if (event.inside(start) || event.inside(end)) {
                available = false;
            }
        });

        return available;
    }
}
module.exports = Schedule;
