const _ = require('lodash');
const dayjs = require('dayjs');

class Event {
    constructor(title, start, end, game) {
        if (_.isObject(title)) {
            start = title.start;
            end = title.end;
            title = title.title;
            game = title.game;
        }

        this.title = title;
        this.start = dayjs(start);
        this.end = dayjs(end);
        this.duration = this.end - this.start;
        this.game = game;
    }

    outside(dateTime) {
        return !this.inside(dateTime);
    }

    inside(dateTime) {
        return this.start < dateTime  && dateTime < this.end;
    }

    overlap(event) {
        const points = [
            event.start,
            event.end,
        ];

        const parts = Math.round(event.duration / (10*60*1000));
        const partialDuration = event.duration / parts;
        for (let i=1; i<parts; i++) {
            points.push(event.start.add(partialDuration * i, 'millisecond'));
        }

        const insidePoint = points.find((p) => this.inside(p));
        return !_.isUndefined(insidePoint);
    }
}
module.exports = Event;
