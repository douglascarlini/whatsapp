const rmq = require('../lib/rabbitmq');
const wpp = require('../lib/whatsapp');

const statWorker = () => {

    rmq.consume(process.env.RMQ_Q_STAT,

        async (ch, msg) => {

            try {

                const { session, number } = JSON.parse(msg.content.toString());

                const chatId = number + '@c.us';
                const client = wpp.sessions.get(session);
                const chat = await client.getChatById(chatId);

                await chat.sendStateTyping();
                await chat.sendSeen();

                ch.ack(msg);

            } catch (error) {

                console.log('STAT:', error);

            }

        });

}

module.exports = statWorker;