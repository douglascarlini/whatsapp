const jwt = require('jsonwebtoken');

const service = require('../services/auth.service');

const login = async (req, res) => {

    try {

        const { username, password } = req.body;

        const user = await service.search(username, password);

        if (user) {

            const payload = { username: user.username, role: user.role };
            const token = jwt.sign(payload, process.env.JWT_SECRET);

            res.status(200).json({ token });

        } else {

            res.status(401).json({ error: "invalid credentials" });

        }

    } catch (error) {

        res.status(500).json({ error });

    }

}

module.exports = { login };