const util = {
    date: {
        add: (hour = -3, date = new Date()) => {
            const hours = date.getHours();
            const zone = new Date(date);
            zone.setHours(hours + hour);
            return zone;
        }
    }
}

module.exports = util;