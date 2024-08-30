const fs = require('fs');

const rmq = require('./rabbitmq');

const disabled = new Map();

const reTake = new RegExp(`^${process.env.CHAT_TAKE_CONTROL}$`, 'i');
const rePass = new RegExp(`^${process.env.CHAT_PASS_CONTROL}$`, 'i');

const handlers = (session, qr = () => { }) => ({

    qr,

    ready: async () => {

        const number = process.env.ADMIN_NUMBER;
        const message = `*Bot session for "${session}" is ready!*`;
        rmq.publish(process.env.RMQ_Q_SEND, { session, number, message });

    },

    reaction: async (msg) => {

        const reaction = msg.reaction;
        const number = msg.id.remote.split('@')[0];
        console.log(`[${session}/${number}] Reaction: ${reaction}`);

    },

    message: async (msg) => {

        try {

            // Extract data
            const isMedia = ["image", "video"].includes(msg.type);
            const mimetype = msg.mimetype || msg._data.mimetype;
            const caption = msg.caption || msg._data.caption;
            const message = isMedia ? caption : msg.body;
            const name = msg._data.notifyName ?? null;
            const created = new Date().toISOString();
            const number = msg.from.split("@")[0];
            const to = msg.to.split("@")[0];
            let token = `${session}/${to}`;
            const type = msg.type;
            let media = null;

            // Debug
            const length = message.length.toString().padStart(5, '0');
            console.log(`[${token}] New message [${length}] / Media: ${isMedia}`);

            // Take or pass chat control
            if (msg.fromMe) {

                const take = reTake.test(message);
                const pass = rePass.test(message);

                if (take) disabled.set(token, true);
                else if (pass) disabled.delete(token);

                return;

            }

            // Ignore messages if user took chat control
            if (disabled.has(`${session}/${number}`)) return;

            // Download message media
            if (msg.hasMedia) media = await msg.downloadMedia();
            else if (isMedia) media = { mimetype, data: msg.body };

            // Audios
            if (type == "ptt") {
                const buffer = Buffer.from(media.data, 'base64');
                const tag = `${new Date().getTime()}_${number}`;
                const filename = `data/audio_${tag}.mp3`;
                fs.writeFileSync(filename, buffer);
            }

            // Publish to received messages queue
            rmq.publish(process.env.RMQ_Q_RECV, { created, session, type, name, number, message, media, to });

        } catch (error) {

            console.log(`RECV:`, error);

        }

    }

})

module.exports = handlers;