const api = require('./api');

const rmq = require('./lib/rabbitmq');
const wpp = require('./lib/whatsapp');

const agenda = require('./lib/schedule');
const handlers = require('./lib/handlers');

const sendWorker = require('./workers/send');
const statWorker = require('./workers/stat');

(async () => {

    await rmq.wait();

    sendWorker();
    statWorker();

    wpp.restore(handlers);
    await agenda.worker();

    api.start();

})();