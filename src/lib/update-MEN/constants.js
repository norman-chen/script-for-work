'use strict';

const XoDs = require('xo-ds-handler');
const xoDs = new XoDs();

const listName = 'list3';

const foldName = `${listName}-log-prod-1127`;

const foldPath = `${__dirname}/${foldName}`;

const listPath = `${__dirname}/${listName}.csv`;

const mapListPath = `${__dirname}/${foldName}/${listName}-map.csv`;
const notExistPath = `${__dirname}/${foldName}/${listName}-not-exist.csv`;
const notMatchMarketPath = `${__dirname}/${foldName}/${listName}-no-match-market.csv`;
const updatedByGPPath = `${__dirname}/${foldName}/${listName}-updated-by-GP.csv`;
const allRemovedPath = `${__dirname}/${foldName}/${listName}-all-removed.csv`;
const existManyButNoWin = `${__dirname}/${foldName}/${listName}-exist-many-but-no-winning.csv`;
const existManyLive = `${__dirname}/${foldName}/${listName}-exist-many-live.csv`;
const freeSrvPath = `${__dirname}/${foldName}/${listName}-free-srv.csv`;
const freeAddonPath = `${__dirname}/${foldName}/${listName}-free-addon.csv`;
const failToUpdatePath = `${__dirname}/${foldName}/${listName}-fail.csv`;
const succeedToUpdatePath = `${__dirname}/${foldName}/${listName}-succeed.csv`;
const mappedAbnormal = `${__dirname}/${foldName}/${listName}-mapped-abnormal.csv`;

const config = {
    xoDsConfig: {
        'write-store': {
            storefront: 'postgres://localservices:!q2w3e4r5t6y7@storefronts-pg-qa.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
        }
        // 'write-store': {
        //     storefront: 'postgres://localservices:XvkTraVU94enXcud@storefronts-pg-prod.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
        // }
    },
    DB: 'storefront'
};

xoDs.config(config.xoDsConfig);

const isUpdateByApi = true;
const DB = 'storefront';

const requestInfo = {
    url   : 'https://qa-sales-api.localsolutions.theknot.com',
    token : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNeUFjY291bnQgQWRtaW4gQXBwbGljYXRpb24iLCJpYXQiOjE0OTk0MTc4MDEsImV4cCI6NDY1NTA5MDkxNywiYXVkIjoicWEucGFydG5lcnNhZG1pbi50aGVrbm90LmNvbSIsInN1YiI6InYxIHNlY3VyaXR5IiwiY2xpZW50SWQiOiI5ZDlkM2ZjMy03OWUxLTRiYTUtYjE2Ny01ZjA1ODE5NmYxZjUifQ.BK5-8gkpUK9zOosfLRFzNj54r9LdvbbvoUypd3yc44M',
    apikey: '2f40b70d252548e79f5b62cda387c8e0'
};

// const requestInfo = {
//     url   : 'https://prod-sales-api.localsolutions.theknot.com',
//     token : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNeUFjY291bnQgQWRtaW4gQXBwbGljYXRpb24iLCJpYXQiOjE0OTk0MTc4MDEsImV4cCI6NDY1NTA5MDkxNywiYXVkIjoiaHR0cDovL3BhcnRuZXJzYWRtaW4udGhla25vdC5jb20iLCJzdWIiOiJ2MSBzZWN1cml0eSIsImNsaWVudElkIjoiNTQ5MTUzM2ItNTI2Ny00NzhmLThlOWItNTNkNzUyYWQ5ZTRhIn0.jF218AKdaS8q3gFa_ixn5KZA0wht9xgzR-MVNdeizqY',
//     apikey: '2c3e706eec474381a58aef482a5cff68'
// };

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
    freeAddonPath,
    requestInfo,
    failToUpdatePath,
    foldPath,
    mappedAbnormal,
    isUpdateByApi,
    succeedToUpdatePath,
    newEndDate: '2020-6-29 14:00:00'
};
