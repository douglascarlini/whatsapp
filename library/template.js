const fs = require('fs');

const template = {

    load(name) {

        const path = `./data/templates/${name}.txt`;
        return fs.readFileSync(path).toString();

    },

    render(base, data) {

        base = base.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return typeof data[key] !== 'undefined' ? data[key] : match;
        });

        base = base.replace(/\{\{#(\w+)\}\}\n([\s\S]*?)\{\{\/\1\}\}/g, (match, key, content) => {
            if (Array.isArray(data[key])) {
                return data[key].map(item => {
                    return content.replace(/\{\{(\w+)\}\}/g, (m, k) => {
                        return typeof item[k] !== 'undefined' ? item[k] : m;
                    });
                }).join('');
            }
            return '';
        });

        return base;

    }

}

module.exports = template;