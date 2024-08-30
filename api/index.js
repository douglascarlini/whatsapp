const cors = require('cors');
const express = require('express');

const api = {

    start: async (port = 80) => {

        const app = express();

        app.use(cors());
        app.use(express.json());
        app.set('trust proxy', true);

        app.use('/auth', require('./routes/auth.routes'));
        const { auth } = require('./middlewares/auth.middleware');
        app.use('/session', auth, require('./routes/session.routes'));
        app.use('/contact', auth, require('./routes/contact.routes'));
        app.use('/message', auth, require('./routes/message.routes'));
        app.use('/schedule', auth, require('./routes/schedule.routes'));

        app.listen(port, () => console.log(`API is running on port ${port}...`));

    }
}

module.exports = api;