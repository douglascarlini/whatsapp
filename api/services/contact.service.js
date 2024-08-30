const wpp = require('../../lib/whatsapp');

const search = async (session, search = null) => {

    const client = wpp.sessions.get(session);

    const contacts = (await client.getContacts())

        .map(c => ({
            number: c.number,
            name: c.name,
        }));

    if (search) {
        const term = search;
        const re = new RegExp(term, "ig");
        return contacts.filter(c => re.test(c.name) || re.test(c.number));
    }

    return contacts;

}

module.exports = { search };