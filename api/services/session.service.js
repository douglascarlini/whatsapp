const qrcode = require('qrcode');

const wpp = require('../../lib/whatsapp');
const handlers = require('../../lib/handlers');

const create = async (session, callback = () => { }, ok = () => { }) => {

    if (!wpp.sessions.has(session) || !wpp.sessions.get(session)) {

        const qr = async (qr) => {
            const image = await qrcode.toDataURL(qr);
            const b64 = image.replace(/^data:image\/png;base64,/, "");
            const buffer = Buffer.from(b64, 'base64');
            callback(buffer);
        }

        const client = wpp.setup(session);
        const cbs = handlers(session, qr);
        wpp.register(client, cbs);

    } else ok();

}

const remove = async (session) => {
    wpp.destroy(session);
}

module.exports = { create, remove };