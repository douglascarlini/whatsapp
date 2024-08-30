const service = require('../services/schedule.service');

const create = async (req, res) => {

    try {

        const data = { ...req.params, ...req.body };
        await service.create({ ...data });

        res.status(200).json({});

    } catch (error) {

        console.log('Schedule create error:', error);
        res.status(500).json({ error });

    }

};

module.exports = { create };