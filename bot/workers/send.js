const { MessageMedia } = require('whatsapp-web.js');

const rmq = require('../lib/rabbitmq');
const wpp = require('../lib/whatsapp');

const sendWorker = () => {

    rmq.consume(process.env.RMQ_Q_SEND,

        async (ch, msg) => {

            try {

                const { session, type, number, message, media_url } = JSON.parse(msg.content.toString());
                if (type == 'api') rmq.publish(process.env.RMQ_Q_RECV, { session, type, number, message });

                let [chatId, options] = [number + '@c.us', {}];
                if (media_url) options.media = await MessageMedia.fromUrl(media_url);
                await wpp.sessions.get(session).sendMessage(chatId, message, options);

                ch.ack(msg);

            } catch (error) {

                console.log(`SEND:`, error);

            }

        });

}

module.exports = sendWorker;