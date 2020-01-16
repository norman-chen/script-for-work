/// DB
/// DB
/// DB
const XoDs = require('xo-ds-handler');
const xoDs = new XoDs();
const xoReq = new(require('xo-request'))();

const config = {
    xoDsConfig: {
        // NEED CHANGED
        // 'write-store': {
        //     storefront: 'postgres://localservices:!q2w3e4r5t6y7@storefronts-pg-qa.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
        // }
        // NEED CHANGED
        // 'write-store': {
        //     storefront: 'postgres://localservices:XvkTraVU94enXcud@storefronts-pg-prod.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
        // }
    },
    DB: 'storefront'
};

xoDs.config(config.xoDsConfig);

// NEED CHANGED
// const requestInfo = {
//     url   : 'https://qa-sales-api.localsolutions.theknot.com',
//     token : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNeUFjY291bnQgQWRtaW4gQXBwbGljYXRpb24iLCJpYXQiOjE0OTk0MTc4MDEsImV4cCI6NDY1NTA5MDkxNywiYXVkIjoicWEucGFydG5lcnNhZG1pbi50aGVrbm90LmNvbSIsInN1YiI6InYxIHNlY3VyaXR5IiwiY2xpZW50SWQiOiI5ZDlkM2ZjMy03OWUxLTRiYTUtYjE2Ny01ZjA1ODE5NmYxZjUifQ.BK5-8gkpUK9zOosfLRFzNj54r9LdvbbvoUypd3yc44M',
//     apikey: '2f40b70d252548e79f5b62cda387c8e0'
// };

// NEED CHANGED
// const requestInfo = {
//     url   : 'https://prod-sales-api.localsolutions.theknot.com',
//     token : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNeUFjY291bnQgQWRtaW4gQXBwbGljYXRpb24iLCJpYXQiOjE0OTk0MTc4MDEsImV4cCI6NDY1NTA5MDkxNywiYXVkIjoiaHR0cDovL3BhcnRuZXJzYWRtaW4udGhla25vdC5jb20iLCJzdWIiOiJ2MSBzZWN1cml0eSIsImNsaWVudElkIjoiNTQ5MTUzM2ItNTI2Ny00NzhmLThlOWItNTNkNzUyYWQ5ZTRhIn0.jF218AKdaS8q3gFa_ixn5KZA0wht9xgzR-MVNdeizqY',
//     apikey: '2c3e706eec474381a58aef482a5cff68'
// };

const storefrontIds = [
    'd976c3c6-06dc-4be7-ad51-a655007f93a1'
];

;(async() => {
    const sql = `select
        data->>'id' as id,
        data->>'storefrontId' as sfid,
        data->'services' as srv,
        data->'accountId' as accid
    from sales_profiles
    where data->>'storefrontId' in (${storefrontIds.map((id) => `'${id}'`).join(',')})
    `;

    const sales = await xoDs.pg.execute('storefront', sql);

    for (let i = 0; i < sales.length; i++) {
        const sa = sales[i];

        const { url, apikey, token } = requestInfo;
        const options = {
            payload: {
                services : sa.srv,
                accountId: sa.accid
            },
            headers: {
                Authorization: token
            }
        };

        return xoReq.put(`${url}/sales/${sa.id}?apikey=${apikey}`, options)
            .catch((error) => {
                console.log(sa.storefrontId);
                console.log('error: ', error);
            });
    }
})();
