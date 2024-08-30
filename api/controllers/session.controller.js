const service = require('../services/session.service');
const wpp = require('../../lib/whatsapp');

const create = async (req, res) => {

    try {

        const session = req.params.session;

        if (!/^[a-z0-9_\-]+$/.test(session)) {
            const error = 'invalid session';
            res.status(400).json(error);
            return;
        }

        await service.create(session, async (image) => {
            res.set('Content-Type', 'image/png');
            res.status(200).send(image);
        }, () => res.send("OK"));

    } catch (error) {

        res.status(500).json({ error });

    }

}

const remove = async (req, res) => {

    try {

        const session = req.params.session;

        if (!/^[a-z0-9_\-]+$/.test(session)) {
            const error = 'invalid session';
            res.status(400).json(error);
            return;
        }

        await service.remove(session);
        res.status(200).json({});

    } catch (error) {

        res.status(500).json({ error });

    }

}

module.exports = { create, remove };