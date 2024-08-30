const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');

const localSessionPath = "./sessions";

module.exports = {

    sessions: new Map(),

    setup(id) {

        if (!this.sessions.has(id) || !this.sessions.get(id)) {

            const localSession = new LocalAuth({ clientId: id, dataPath: localSessionPath });

            delete localSession.logout
            localSession.logout = () => { }

            const client = new Client({
                authStrategy: localSession,
                puppeteer: {
                    executablePath: process.env.CHROME_BIN || null,
                    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
                },
                userAgent: 'Mozilla/5.0 (X11 Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
            });

            this.sessions.set(id, client);

        }

        return this.sessions.get(id);

    },

    restore(handlers = null) {

        try {

            if (!fs.existsSync(localSessionPath)) {
                fs.mkdirSync(localSessionPath);
            }

            const files = fs.readdirSync(localSessionPath);
            console.log(`> ${files.length} session(s)...`);

            for (const file of files) {
                const match = file.match(/^session-(.+)$/);
                if (match) {
                    console.log(`Loading ${match[1]}...`);
                    const sessionId = match[1];
                    this.setup(sessionId);
                }
            }

            if (handlers) this.initialize(handlers);

        } catch (error) {

            console.error('Failed to restore sessions:', error);

        }

    },

    register(client, callbacks = {}) {
        client.on('message_reaction', callbacks['reaction'] ?? (() => { }));
        client.on('message_create', callbacks['message'] ?? (() => { }));
        client.on('ready', callbacks['ready'] ?? (() => { }));
        client.on('qr', callbacks['qr'] ?? (() => { }));
        client.initialize();
    },

    initialize(handlers) {
        for (const [session, client] of this.sessions) {
            this.register(client, handlers(session));
        }
    },

    destroy(session) {

        const sessionPath = `${localSessionPath}/session-${session}`;
        const config = { recursive: true, force: true };

        if (this.sessions.has(session)) {
            const client = this.sessions.get(session);
            if (client) {
                client.logout();
                client.destroy();
            }
            this.sessions.delete(session);
        }

        if (fs.existsSync(sessionPath)) {
            fs.rmSync(sessionPath, config);
        }

    }

}