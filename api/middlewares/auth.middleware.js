const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {

    const authorization = req.query.key ?? req.headers.authorization;

    if (authorization) {

        const token = authorization.replace('Bearer ', '');

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

            const method = req.method;
            const path = req.baseUrl + req.path;
            const ip = req.ip.replace('::ffff:', '');
            console.log(`${method} ${path} from ${ip}`);

            if (err) return res.sendStatus(403);
            req.user = user;

            next();

        });

    } else {

        res.sendStatus(401);

    }

};

module.exports = { auth };