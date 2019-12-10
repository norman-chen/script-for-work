'use strict';


/// Log
/// Log
/// Log

const listName = 'list'; // NEED CHANGED
const listPath = `${__dirname}/${listName}.csv`;

const foldName = `${listName}-log-prod-1206`; // NEED CHANGED

const foldPath = `${__dirname}/${foldName}`;
const mapListPath = `${__dirname}/${foldName}/${listName}-map.csv`;
const failToUpdatePath = `${__dirname}/${foldName}/${listName}-fail.csv`;
const succeedToUpdatePath = `${__dirname}/${foldName}/${listName}-succeed.csv`;

const initFiles = require('../../helpers/initFiles');
const initFold = require('../../helpers/initFold');

const init = () => {
    initFold(foldPath);
    initFiles([
        {
            path : mapListPath,
            title: 'LocationId,CategoryCode,SKU,MarketCode,ScriptedMarketCode'
        },
        {
            path: succeedToUpdatePath
        },
        {
            path: failToUpdatePath
        }
    ]);
};

/// DB
/// DB
/// DB
const XoDs = require('xo-ds-handler');
const xoDs = new XoDs();

const config = {
    xoDsConfig: {
        // NEED CHANGED
        // 'write-store': {
        //     storefront: 'postgres://localservices:!q2w3e4r5t6y7@storefronts-pg-qa.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
        // }
        // NEED CHANGED
        'write-store': {
            storefront: 'postgres://localservices:XvkTraVU94enXcud@storefronts-pg-prod.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
        }
    },
    DB: 'storefront'
};

xoDs.config(config.xoDsConfig);
const DB = 'storefront';


/// API request
/// API request
/// API request
const isUpdateByApi = false; // NEED CHANGED
// NEED CHANGED
// const requestInfo = {
//     url   : 'https://qa-sales-api.localsolutions.theknot.com',
//     token : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNeUFjY291bnQgQWRtaW4gQXBwbGljYXRpb24iLCJpYXQiOjE0OTk0MTc4MDEsImV4cCI6NDY1NTA5MDkxNywiYXVkIjoicWEucGFydG5lcnNhZG1pbi50aGVrbm90LmNvbSIsInN1YiI6InYxIHNlY3VyaXR5IiwiY2xpZW50SWQiOiI5ZDlkM2ZjMy03OWUxLTRiYTUtYjE2Ny01ZjA1ODE5NmYxZjUifQ.BK5-8gkpUK9zOosfLRFzNj54r9LdvbbvoUypd3yc44M',
//     apikey: '2f40b70d252548e79f5b62cda387c8e0'
// };

// NEED CHANGED
const requestInfo = {
    url   : 'https://prod-sales-api.localsolutions.theknot.com',
    token : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNeUFjY291bnQgQWRtaW4gQXBwbGljYXRpb24iLCJpYXQiOjE0OTk0MTc4MDEsImV4cCI6NDY1NTA5MDkxNywiYXVkIjoiaHR0cDovL3BhcnRuZXJzYWRtaW4udGhla25vdC5jb20iLCJzdWIiOiJ2MSBzZWN1cml0eSIsImNsaWVudElkIjoiNTQ5MTUzM2ItNTI2Ny00NzhmLThlOWItNTNkNzUyYWQ5ZTRhIn0.jF218AKdaS8q3gFa_ixn5KZA0wht9xgzR-MVNdeizqY',
    apikey: '2c3e706eec474381a58aef482a5cff68'
};


module.exports = {
    DB,
    xoDs,
    listName,
    listPath,
    mapListPath,
    succeedToUpdatePath,
    failToUpdatePath,
    requestInfo,
    isUpdateByApi,
    newEndDate: '2020-6-29 14:00:00', // NEED CHANGED
    init
};
