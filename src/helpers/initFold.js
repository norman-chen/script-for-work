'use strict';

const fs = require('fs');

module.exports = (foldPath) => {
    if (fs.existsSync(foldPath)) {
        // read the file in the fold
        const l = fs.readdirSync(foldPath);

        // remove all the file in the fold
        l.forEach((p) => {
            fs.unlinkSync(foldPath + '/' + p);
        });

        // remove the fold
        fs.rmdirSync(foldPath);
    }

    // recreate the fold
    fs.mkdirSync(foldPath);
}