const rmq = require('../../lib/rabbitmq');
const tpl = require('../../lib/template');

const create = async (session, number, message, media_url, template, data) => {

    if (!message && template && data) message = tpl.render(tpl.load(template), data);
    const payload = { session, type: 'api', number, message, media_url };
    await rmq.publish(process.env.RMQ_Q_SEND, payload);

};

module.exports = { create };