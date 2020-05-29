'use strict';

const Hoek = require('hoek');

const shared = {
    positionMax: 50,
    positionGap: 300,
    targetSfs  : [],
    autoPublish: false
};

const qa = {
    'xo-ds-handler': {
        'write-store': {
            storefront: 'postgres://localservices:!q2w3e4r5t6y7@storefronts-pg-qa.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
        },
        'read-store': {
            admin: {
                host           : 'https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com',
                accessKeyId    : 'AKIAIC6COCXKOPJHILHQ',
                secretAccessKey: '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',
                requestTimeout : 90000
            }
        }
    },
    DB           : 'storefront',
    sfUri        : 'http://qa-storefront-api.localsolutions.theknot.com',
    token        : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNeUFjY291bnQgQWRtaW4gQXBwbGljYXRpb24iLCJpYXQiOjE0OTk0MTc4MDEsImV4cCI6NDY1NTA5MDkxNywiYXVkIjoicWEucGFydG5lcnNhZG1pbi50aGVrbm90LmNvbSIsInN1YiI6InYxIHNlY3VyaXR5IiwiY2xpZW50SWQiOiI5ZDlkM2ZjMy03OWUxLTRiYTUtYjE2Ny01ZjA1ODE5NmYxZjUifQ.BK5-8gkpUK9zOosfLRFzNj54r9LdvbbvoUypd3yc44M',
    apikey       : '2f40b70d252548e79f5b62cda387c8e0',
    getSFOneTime : 100000,
    offset       : 0,
    esUpdateLimit: 5000,
    env          : 'qa'
};

const production = {
    'xo-ds-handler': {
        'write-store': {
            storefront: 'postgres://localservices:XvkTraVU94enXcud@storefronts-pg-prod.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
        },
        'read-store': {
            admin: {
                host           : 'https://search-xo-local-partners-prod-ap25bstxjtk5xaxpvu3jxmajh4.us-east-1.es.amazonaws.com',
                accessKeyId    : 'AKIAJLYS6NZ5LPWW6QNQ',
                secretAccessKey: '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',
                requestTimeout : 90000
            }
        }
    },
    DB           : 'storefront',
    sfUri        : 'http://prod-storefront-api.localsolutions.theknot.com',
    token        : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNeUFjY291bnQgQWRtaW4gQXBwbGljYXRpb24iLCJpYXQiOjE0OTk0MTc4MDEsImV4cCI6NDY1NTA5MDkxNywiYXVkIjoiaHR0cDovL3BhcnRuZXJzYWRtaW4udGhla25vdC5jb20iLCJzdWIiOiJ2MSBzZWN1cml0eSIsImNsaWVudElkIjoiNTQ5MTUzM2ItNTI2Ny00NzhmLThlOWItNTNkNzUyYWQ5ZTRhIn0.jF218AKdaS8q3gFa_ixn5KZA0wht9xgzR-MVNdeizqY',
    apikey       : '2c3e706eec474381a58aef482a5cff68',
    getSFOneTime : 100000,
    esUpdateLimit: 5000,
    offset       : 250000,
    env          : 'prod'
};

if (process.argv.includes('--NODE_ENV=production')) {
    module.exports = Hoek.merge(production, shared);
} else {
    module.exports = Hoek.merge(qa, shared);
}
