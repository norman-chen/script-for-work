// const _ = require('lodash');
const fs = require('fs');

let bakIds = require('./bak');
let prodIds = require('./prod');

;(() => {
    bakIds = Array.from(new Set(bakIds));
    prodIds = Array.from(new Set(prodIds));

    // const newIds = [];
    bakIds.forEach((bId) => {
        if (!prodIds.includes(bId)) {
            fs.appendFileSync(`${__dirname}/new-ids.log`, `'${bId}',\n`);
            // newIds.push(bId)
        }
    });
})();
