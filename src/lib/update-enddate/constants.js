'use strict';

const XoDs = require('xo-ds-handler');
const xoDs = new XoDs();

const listName = 'list2';

const listPath = `${__dirname}/${listName}.csv`;
const mapListPath = `${__dirname}/${listName}-map.csv`;
const notExistPath = `${__dirname}/${listName}-not-exist.csv`;
const notMatchMarketPath = `${__dirname}/${listName}-no-match-market.csv`;
const updatedByGPPath = `${__dirname}/${listName}-updated-by-GP.csv`;
const allRemovedPath = `${__dirname}/${listName}-all-removed.csv`;
const existManyButNoWin = `${__dirname}/${listName}-exist-many-but-no-winning.csv`;
const existManyLive = `${__dirname}/${listName}-exist-many-live.csv`;
const freeSrvPath = `${__dirname}/${listName}-free-srv.csv`;
const freeAddonPath = `${__dirname}/${listName}-free-addon.csv`;

const config = {
    xoDsConfig: {
        // 'write-store': {
        //     storefront: 'postgres://localservices:!q2w3e4r5t6y7@storefronts-pg-qa.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
        // }
        'write-store': {
            storefront: 'postgres://localservices:XvkTraVU94enXcud@storefronts-pg-prod.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
        }
    },
    DB: 'storefront'
};

xoDs.config(config.xoDsConfig);


const DB = 'storefront';

module.exports = {
    DB,
    xoDs,
    config,
    listPath,
    mapListPath,
    notExistPath,
    notMatchMarketPath,
    updatedByGPPath,
    allRemovedPath,
    existManyButNoWin,
    existManyLive,
    freeSrvPath,
    freeAddonPath
};
