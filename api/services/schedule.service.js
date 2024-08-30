const agenda = require('../../lib/schedule');
const util = require('../../lib/util');

const create = async ({ when, session, number, message, media_url, template, data }) => {

    if (/^\d{4}/.test(when)) when = util.date.add(3, new Date(when.split(' ').join('T') + ':00'));
    const payload = { session, number, message, media_url, template, data };
    return await agenda.create(when, 'send message', payload);

}

module.exports = { create };