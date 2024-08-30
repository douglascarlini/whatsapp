const wpp = require('../../lib/whatsapp');

const validate = (req, res, next) => {

    const { session, number } = req.params;

    if (number) {

        if (!/^55\d{2}\d{8,9}$/.test(number)) {
            const error = 'invalid number';
            res.status(400).json(error);
            return;
        }

    }

    if (session) {

        if (!/^[a-z0-9_\-]+$/.test(session)) {
            const error = 'invalid session';
            res.status(400).json(error);
            return;
        }

        if (!wpp.sessions.has(session) || !wpp.sessions.get(session)) {
            const error = 'session not found';
            res.status(404).json({ error });
            return;
        }

    }

    next();

}

module.exports = validate;