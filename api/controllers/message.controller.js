const service = require('../services/message.service');
const wpp = require('../../lib/whatsapp');

const create = async (req, res) => {

    try {

        const session = req.params.session;
        const { number, message, media_url, template, data } = req.body;
        await service.create(session, number, message, media_url, template, data);

        res.status(200).json({ success: true });

    } catch (error) {

        res.status(500).json({ error });

    }

};

module.exports = { create };