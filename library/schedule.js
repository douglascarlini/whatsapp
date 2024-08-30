const { Agenda } = require('@hokify/agenda');
const rmq = require('./rabbitmq');

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@db:27017/agenda?authSource=admin`;
const agenda = new Agenda({ db: { address: uri } });

module.exports = {

    worker: async () => {

        try {

            await agenda.start();

            agenda.define('send message', async (job) => {
                try {
                    const data = { type: 'api', ...job.attrs.data };
                    await rmq.publish(process.env.RMQ_Q_SEND, data);
                } catch (error) {
                    console.log('Error on send schedule message:', error);
                }
            });

        } catch (error) {

            console.log('Agenda error:', error);
            await new Promise(res => setTimeout(res, 5000));

        }

    },

    create: async (when, name, data) => await agenda.schedule(when, name, data),

};