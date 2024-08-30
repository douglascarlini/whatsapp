const users = [{ id: 1, username: process.env.API_USER, password: process.env.API_PASS, role: "admin" }];

const search = async (username, password) => users.find(u => { return u.username === username && u.password === password });

module.exports = { search };