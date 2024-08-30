const service = require('../services/contact.service');
const wpp = require('../../lib/whatsapp');

const search = async (req, res) => {

    try {

        const search = req.query.search;
        const session = req.params.session;

        const result = await service.search(session, search);

        res.status(200).json(result);

    } catch (error) {

        res.status(500).json({ error });

    }

};

module.exports = { search };