'use strict';

const fs = require('fs');

module.exports = (files = []) => {
    files.forEach(file => {
        fs.existsSync(file.path) && fs.unlinkSync(file.path);

        if (file.title) {
            fs.appendFileSync(file.path, `${file.title}\n`);
        }
    })
}