class Event {
    constructor(name, start, end) {
        this.name = name;
        this.start = start;
        this.end = end;
        this.duration = this.end.getTime() - this.start.getTime();
    }

    outside(time) {
        return time < this.start || time > this.end;
    }

    inside(time) {
        return !this.outside(time);
    }
}
module.exports = Event;
